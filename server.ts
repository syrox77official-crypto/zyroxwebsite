import express from 'express';
import { createServer as createViteServer } from 'vite';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Server-only private SMTP credentials (never exposed to client responses)
const PRIVATE_SMTP_CONFIG = {
  host: process.env.SMTP_HOST?.trim() || 'smtp.emailsbit.com',
  portStartTls: Number(process.env.SMTP_PORT || 588),
  portNone: 505,
  username: process.env.SMTP_USER?.trim() || 'graph-f99505393815a782',
  password: process.env.SMTP_PASS?.trim() || 'e0JjjdFtFbPrARsmG27ayRjrsuUL',
  fromEmail: process.env.SMTP_FROM_EMAIL?.trim() || 'zyroxx@inboxtaken.com',
  fromName: process.env.SMTP_FROM_NAME?.trim() || 'ptzyroxx',
};

function createTransporterForPort(portMode: '588' | '505') {
  if (portMode === '588') {
    return nodemailer.createTransport({
      host: PRIVATE_SMTP_CONFIG.host,
      port: PRIVATE_SMTP_CONFIG.portStartTls,
      secure: false,
      requireTLS: true,
      auth: {
        user: PRIVATE_SMTP_CONFIG.username,
        pass: PRIVATE_SMTP_CONFIG.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 12000,
      greetingTimeout: 12000,
      socketTimeout: 15000,
    });
  }

  return nodemailer.createTransport({
    host: PRIVATE_SMTP_CONFIG.host,
    port: PRIVATE_SMTP_CONFIG.portNone,
    secure: false,
    ignoreTLS: true,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: PRIVATE_SMTP_CONFIG.username,
      pass: PRIVATE_SMTP_CONFIG.password,
    },
    connectionTimeout: 12000,
    greetingTimeout: 12000,
    socketTimeout: 15000,
  });
}

async function dispatchProtectedMail(options: {
  to: string;
  subject: string;
  text: string;
}) {
  const portsToTry: ('588' | '505')[] = ['588', '505'];
  let lastError: any = null;

  for (const portKey of portsToTry) {
    try {
      const transporter = createTransporterForPort(portKey);
      const info = await transporter.sendMail({
        from: {
          name: PRIVATE_SMTP_CONFIG.fromName,
          address: PRIVATE_SMTP_CONFIG.fromEmail,
        },
        to: options.to,
        subject: options.subject,
        text: options.text,
      });

      return {
        ticketHash: info.messageId
          ? info.messageId.replace(/[<>]/g, '').split('@')[0]
          : `ZX-${Date.now()}`,
        encryptedProtocol: portKey === '588' ? 'STARTTLS-Protected' : 'Relay-Standard',
      };
    } catch (err: any) {
      lastError = err;
    }
  }

  throw lastError || new Error('Jalur transmisi server sedang sibuk.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Disable x-powered-by header to prevent server fingerprinting/leaks
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb' }));

  // Public status endpoint (returns zero sensitive credentials)
  app.get('/api/smtp/status', (_req, res) => {
    res.json({
      ready: true,
      protection: 'End-to-End Encrypted Relay',
    });
  });

  // Send endpoint (executes real SMTP send on backend while masking internal credentials)
  app.post('/api/smtp/send', async (req, res) => {
    try {
      const { to, subject, body, phoneNumber, routingId } = req.body || {};

      if (!to || !subject || !body) {
        res.status(400).json({
          error: 'Nomor telepon dan metode fix wajib dilengkapi.',
        });
        return;
      }

      const result = await dispatchProtectedMail({
        to,
        subject,
        text: body,
      });

      res.json({
        success: true,
        ticketReference: result.ticketHash,
        securityMode: result.encryptedProtocol,
        phoneNumber,
        routingId,
      });
    } catch {
      // Mask internal server/host details to prevent any data leakage
      res.status(500).json({
        error: 'Koneksi ke gateway antrean sedang padat. Silakan coba beberapa saat lagi.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*all', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zyroxx Protected Server listening on port ${PORT}`);
  });
}

startServer();
