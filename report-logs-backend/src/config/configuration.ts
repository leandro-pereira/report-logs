import { config } from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

config();

// Carregar credenciais do arquivo JSON local
const credentialsPath = process.env.FIREBASE_CREDENTIALS_PATH || 
  path.join(process.cwd(), 'firebase-credentials.json');

let firebaseConfig: any = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Se o arquivo de credenciais existe, usar ele
if (fs.existsSync(credentialsPath)) {
  try {
    const credentials = JSON.parse(fs.readFileSync(credentialsPath, 'utf8'));
    firebaseConfig = {
      projectId: credentials.project_id,
      privateKey: credentials.private_key,
      clientEmail: credentials.client_email,
    };
    console.log('✓ Credenciais do Firebase carregadas do arquivo local');
  } catch (error) {
    console.warn('Aviso: Não foi possível carregar credenciais do arquivo. Usando variáveis de ambiente.');
  }
}

export const configuration = {
  firebase: firebaseConfig,
  email: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_TO,
  },
  app: {
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  logRetention: {
    days: parseInt(process.env.LOG_RETENTION_DAYS || '30', 10),
  },
};
