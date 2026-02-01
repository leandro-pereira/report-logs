import * as admin from 'firebase-admin';
import { Injectable } from '@nestjs/common';
import { configuration } from '../config/configuration';

@Injectable()
export class FirebaseService {
  private firebaseApp: admin.app.App;
  private db: admin.firestore.Firestore;

  constructor() {
    this.initializeFirebase();
  }

  private initializeFirebase() {
    if (!admin.apps.length) {
      this.firebaseApp = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: configuration.firebase.projectId,
          privateKey: configuration.firebase.privateKey,
          clientEmail: configuration.firebase.clientEmail,
        } as admin.ServiceAccount),
      });
    } else {
      this.firebaseApp = admin.app();
    }

    this.db = admin.firestore();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.db;
  }

  async saveLog(logData: any): Promise<string> {
    const docRef = await this.db.collection('logs').add({
      ...logData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return docRef.id;
  }

  async getLogs(limit = 100): Promise<any[]> {
    const snapshot = await this.db
      .collection('logs')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }

  async deleteOldLogs(daysOld: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const snapshot = await this.db
      .collection('logs')
      .where('createdAt', '<', cutoffDate)
      .get();

    let deletedCount = 0;
    const batch = this.db.batch();

    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
      deletedCount++;
    });

    if (deletedCount > 0) {
      await batch.commit();
    }

    return deletedCount;
  }

  async getLogById(logId: string): Promise<any> {
    const doc = await this.db.collection('logs').doc(logId).get();
    if (!doc.exists) {
      return null;
    }
    return {
      id: doc.id,
      ...doc.data(),
    };
  }
}
