declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PAYLOAD_SECRET: string
      MONGODB_URI: string
      NEXT_PUBLIC_SERVER_URL: string
      VERCEL_PROJECT_PRODUCTION_URL: string
      BLOB_READ_WRITE_TOKEN: string
      CRON_SECRET: string
      PREVIEW_SECRET: string
      RESEND_API_KEY: string
      TELEGRAM_BOT_TOKEN: string
      TELEGRAM_CHANNEL_ID: string
    }
  }
}

export {}
