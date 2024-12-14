import * as dotenv from 'dotenv';
import { ClientConfig, MiddlewareConfig } from '@line/bot-sdk';
import OpenAI from 'openai';

dotenv.config();

// LINE Bot 配置
export const lineConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_BOT_ACCESS_TOKEN || '',
};

export const lineMiddlewareConfig: MiddlewareConfig = {
  channelSecret: process.env.LINE_BOT_SECRET || '',
};

// OpenAI 配置
export const openaiClient = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || (() => {
    throw new Error('OpenAI API Key is not defined');
  })()
});

// 服務器配置
export const SERVER_PORT = process.env.SERVER_PORT || 3000;