export const backblazeConfig = {
  apiUrl: process.env.NEXT_PUBLIC_BACKBLAZE_API_URL || '',
  bucketName: process.env.NEXT_PUBLIC_BACKBLAZE_BUCKET_NAME || '',
  accountId: process.env.NEXT_PUBLIC_BACKBLAZE_ACCOUNT_ID || '',
  applicationKeyId: process.env.NEXT_PUBLIC_BACKBLAZE_APP_KEY_ID || '',
  applicationKey: process.env.NEXT_PUBLIC_BACKBLAZE_APP_KEY || '',
  bucketUrl: process.env.BACKBLAZE_BUCKET_URL || '',
};
