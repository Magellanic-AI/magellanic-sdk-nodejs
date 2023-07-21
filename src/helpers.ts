import crypto from 'crypto';

const GCM_ALGORITHM = 'aes-256-gcm';
const GCM_IV_LENGTH = 12;
const GCM_TAG_LENGTH = 16;

export function encryptAes(data: string, key: string) {
  const iv = crypto.randomBytes(GCM_IV_LENGTH);
  const cipher = crypto.createCipheriv(
    GCM_ALGORITHM,
    Buffer.from(key, 'hex'),
    iv,
  );
  return Buffer.concat([
    iv,
    cipher.update(data, 'utf8'),
    cipher.final(),
    cipher.getAuthTag(),
  ]).toString('base64');
}

export function decryptAes(encryptedData: string, key: string) {
  const message = Buffer.from(encryptedData, 'base64');
  const iv = Buffer.allocUnsafe(GCM_IV_LENGTH);
  const tag = Buffer.allocUnsafe(GCM_TAG_LENGTH);
  const data = Buffer.alloc(message.length - GCM_IV_LENGTH - GCM_TAG_LENGTH, 0);

  message.copy(iv, 0, 0, GCM_IV_LENGTH);
  message.copy(tag, 0, message.length - GCM_TAG_LENGTH);
  message.copy(data, 0, GCM_IV_LENGTH);

  const decipher = crypto.createDecipheriv(
    GCM_ALGORITHM,
    Buffer.from(key, 'hex'),
    iv,
  );
  decipher.setAuthTag(tag);

  let decrypted = decipher.update(data, undefined, 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
