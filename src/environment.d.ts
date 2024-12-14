declare global {
  namespace NodeJS {
    interface ProcessEnv {
      LINE_BOT_ACCESS_TOKEN: string;
      LINE_BOT_CHANNEL_SECRET: string;
      OPENAI_API_KEY: string;
      PORT: string;
    }
  }
}

export {};
