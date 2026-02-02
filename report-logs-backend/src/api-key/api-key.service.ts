import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as admin from 'firebase-admin';
import { FirebaseService } from '../firebase/firebase.service';

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  secret: string;
  createdAt: Date;
  expiryDate?: Date;
  lastUsedAt?: Date;
  active: boolean;
  metadata?: Record<string, any>;
}

@Injectable()
export class ApiKeyService {
  private apiKeys: Map<string, ApiKey> = new Map();

  constructor(private firebaseService: FirebaseService) {
    this.loadApiKeys();
  }

  /**
   * Cria ou atualiza uma chave API por aplicação
   * Se a chave já existe, gera uma NOVA chave e atualiza o mesmo registro
   * Mantém o ID da aplicação mas renova key, secret e updatedAt
   */
  createOrUpdateApiKey(name: string): ApiKey {
    // Busca chave existente para essa aplicação
    const existingKey = Array.from(this.apiKeys.values()).find(
      (key) => key.name === name,
    );

    // Se existe, atualiza com nova chave mantendo o mesmo registro
    if (existingKey) {
      // Remover chave antiga do mapa
      this.apiKeys.delete(existingKey.key);

      // Gerar nova chave e secret
      const newKey = this.generateKey();
      const newSecret = this.generateSecret();

      // Atualizar o registro existente
      const updatedKey: ApiKey = {
        ...existingKey,
        key: newKey,
        secret: newSecret,
        lastUsedAt: new Date(),
      };

      // Adicionar ao mapa com a nova chave
      this.apiKeys.set(newKey, updatedKey);
      // Atualizar apenas esta chave no Firestore
      this.updateApiKeyToFirestore(updatedKey);

      return updatedKey;
    }

    // Se não existe, cria nova
    return this.generateNewApiKey(name);
  }

  /**
   * Gera uma nova chave API (interno)
   */
  private generateNewApiKey(name: string): ApiKey {
    const id = this.generateId();
    const key = this.generateKey();
    const secret = this.generateSecret();

    const apiKey: ApiKey = {
      id,
      name,
      key,
      secret,
      createdAt: new Date(),
      active: true,
    };

    this.apiKeys.set(key, apiKey);
    // Atualizar apenas esta chave no Firestore
    this.updateApiKeyToFirestore(apiKey);

    return apiKey;
  }

  /**
   * Valida uma chave API
   */
  validateApiKey(apiKey: string, apiSecret: string): ApiKey {
    const key = this.apiKeys.get(apiKey);

    if (!key) {
      throw new UnauthorizedException('API Key inválida');
    }

    if (!key.active) {
      throw new UnauthorizedException('API Key desativada');
    }

    if (key.expiryDate && new Date() > key.expiryDate) {
      throw new UnauthorizedException('API Key expirada');
    }

    if (key.secret !== apiSecret) {
      throw new UnauthorizedException('API Secret inválido');
    }

    // Atualizar último uso
    key.lastUsedAt = new Date();
    // Atualizar apenas esta chave no Firestore
    this.updateApiKeyToFirestore(key);

    return key;
  }

  /**
   * Obtém estatísticas de uma chave
   */
  getKeyStats(keyId: string): any {
    for (const key of this.apiKeys.values()) {
      if (key.id === keyId) {
        const now = new Date();
        const isExpired = key.expiryDate && now > key.expiryDate;
        const daysUntilExpiry = key.expiryDate
          ? Math.ceil((key.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
          : null;

        return {
          id: key.id,
          name: key.name,
          active: key.active,
          createdAt: key.createdAt,
          expiryDate: key.expiryDate,
          lastUsedAt: key.lastUsedAt,
          daysSinceCreation: Math.floor(
            (new Date().getTime() - key.createdAt.getTime()) / (1000 * 60 * 60 * 24),
          ),
          isExpired,
          daysUntilExpiry,
        };
      }
    }
    return null;
  }

  /**
   * Carrega chaves do Firestore
   */
  private async loadApiKeys() {
    try {
      const db = this.firebaseService.getFirestore();
      const snapshot = await db.collection('api-keys').get();

      this.apiKeys.clear();
      let count = 0;

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const apiKey: ApiKey = {
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
          lastUsedAt: data.lastUsedAt ? new Date(data.lastUsedAt) : undefined,
        } as ApiKey;
        this.apiKeys.set(apiKey.key, apiKey);
        count++;
      });

      if (count > 0) {
        console.log(`✓ ${count} chaves API carregadas do Firestore`);
      }
    } catch (error) {
      console.error('Erro ao carregar chaves API do Firestore:', error);
    }
  }

  /**
   * Salva chaves no Firestore
   */
  private saveApiKeysToFirestore() {
    try {
      const db = this.firebaseService.getFirestore();
      const batch = db.batch();

      // Deletar todas as chaves antigas
      db.collection('api-keys').get().then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });
      });

      // Adicionar todas as chaves novas
      this.apiKeys.forEach((apiKey) => {
        const docRef = db.collection('api-keys').doc(apiKey.id);
        const data: any = {
          id: apiKey.id,
          name: apiKey.name,
          key: apiKey.key,
          secret: apiKey.secret,
          createdAt: apiKey.createdAt.toISOString(),
          active: apiKey.active,
          metadata: apiKey.metadata || {},
          updatedAt: new Date().toISOString(),
        };

        if (apiKey.expiryDate) {
          data.expiryDate = apiKey.expiryDate.toISOString();
        }

        if (apiKey.lastUsedAt) {
          data.lastUsedAt = apiKey.lastUsedAt.toISOString();
        }

        batch.set(docRef, data);
      });

      batch.commit().catch((error) => {
        console.error('Erro ao salvar chaves API no Firestore:', error);
      });
    } catch (error) {
      console.error('Erro ao preparar batch de chaves API:', error);
    }
  }

  /**
   * Atualiza apenas uma chave específica no Firestore (mais eficiente)
   */
  private updateApiKeyToFirestore(apiKey: ApiKey) {
    try {
      const db = this.firebaseService.getFirestore();
      const docRef = db.collection('api-keys').doc(apiKey.id);

      const data: any = {
        id: apiKey.id,
        name: apiKey.name,
        key: apiKey.key,
        secret: apiKey.secret,
        createdAt: apiKey.createdAt.toISOString(),
        active: apiKey.active,
        metadata: apiKey.metadata || {},
        updatedAt: new Date().toISOString(),
      };

      if (apiKey.expiryDate) {
        data.expiryDate = apiKey.expiryDate.toISOString();
      }

      if (apiKey.lastUsedAt) {
        data.lastUsedAt = apiKey.lastUsedAt.toISOString();
      }

      // Usar set com merge para atualizar apenas os campos especificados
      docRef.set(data, { merge: true }).catch((error) => {
        console.error(`Erro ao atualizar chave ${apiKey.id} no Firestore:`, error);
      });
    } catch (error) {
      console.error('Erro ao atualizar chave API no Firestore:', error);
    }
  }

  /**
   * Gera um ID único
   */
  private generateId(): string {
    return `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Gera uma chave pública
   */
  private generateKey(): string {
    return `pk_${crypto.randomBytes(16).toString('hex')}`;
  }

  /**
   * Gera um secret privado
   */
  private generateSecret(): string {
    return crypto.randomBytes(32).toString('hex');
  }
}
