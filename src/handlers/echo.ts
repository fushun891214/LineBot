import { webhook, messagingApi } from '@line/bot-sdk';

export class EchoHandler {
  private client: messagingApi.MessagingApiClient;

  constructor(client: messagingApi.MessagingApiClient) {
    this.client = client;
  }

  async handleEvent(event: webhook.Event): Promise<void> {
    if (event.type !== 'message' || event.message.type !== 'text') {
      return;
    }

    if (!event.replyToken) return;
    
    await this.client.replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: 'text',
        text: event.message.text,
      }],
    });
  }
}