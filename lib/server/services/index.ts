import "server-only";

/**
 * Interface contract for email delivery (e.g. Resend in Phase 10).
 */
export interface IEmailService {
  sendContactNotification(params: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }): Promise<{ messageId: string }>;
}

/**
 * Interface contract for cloud media/file storage (Cloud Storage for Firebase).
 */
export interface IStorageService {
  upload(pathname: string, file: Blob | Buffer, options?: { access?: "public" }): Promise<{ url: string }>;
  delete(url: string): Promise<void>;
}

/**
 * Interface contract for anti-spam verification (e.g. Cloudflare Turnstile in Phase 10).
 */
export interface IVerificationService {
  verifyToken(token: string, remoteIp?: string): Promise<{ success: boolean; errorCodes?: string[] }>;
}

/**
 * Interface contract for Cloud Firestore database operations.
 */
export interface IDatabaseService {
  isConnected(): boolean;
  ping(): Promise<boolean>;
}
