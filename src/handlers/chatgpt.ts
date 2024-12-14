import { webhook, messagingApi } from '@line/bot-sdk';
import { openaiClient } from '../config';
import { ConversationService } from '../services/conversation';

export class ChatGPTHandler {
  private client: messagingApi.MessagingApiClient;
  private conversationService: ConversationService;

  constructor(client: messagingApi.MessagingApiClient, conversationService: ConversationService) {
    this.client = client;
    this.conversationService = conversationService;
  }

  async handleEvent(event: webhook.Event): Promise<void> {
    // 確保事件是文字訊息事件
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }

    const userId = event.source.userId;
    if (!userId || !event.replyToken) return;

    try {
      const messages = this.conversationService.getHistory(userId);
      messages.push({ role: "user", content: event.message.text });
      
      const completion = await openaiClient.chat.completions.create({
        messages,
        model: "gpt-3.5-turbo",
        max_tokens: 1000,
        temperature: 0.7,
      });

      const responseMessage = completion.choices[0].message.content;
      this.conversationService.addMessage(userId, { 
        role: "assistant", 
        content: responseMessage || '' 
      });

      await this.client.replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: 'text',
          text: responseMessage || '抱歉，我現在無法回應。',
        }],
      });
    } catch (error) {
      if (event.replyToken) {
        await this.handleError(error, userId, event.replyToken);
      }
    }
  }

  private async handleError(error: any, userId: string, replyToken: string): Promise<void> {
    console.error('ChatGPT Handler Error:', error);
    
    if (error.error?.code === 'context_length_exceeded') {
      this.conversationService.clearHistory(userId);
      await this.client.replyMessage({
        replyToken: replyToken,
        messages: [{
          type: 'text',
          text: '對話已重置，請重新發送您的問題。',
        }],
      });
      return;
    }
    
    await this.client.replyMessage({
      replyToken: replyToken,
      messages: [{
        type: 'text',
        text: '抱歉，處理您的請求時發生錯誤。',
      }],
    });
  }
}