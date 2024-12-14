import express from 'express';
import { messagingApi, middleware, webhook } from '@line/bot-sdk';
import { 
  lineConfig, 
  lineMiddlewareConfig, 
  SERVER_PORT
} from './config';
import { ChatGPTHandler } from './handlers/chatgpt';
import { EchoHandler } from './handlers/echo';
import { ConversationService } from './services/conversation';

const app = express();
const client = new messagingApi.MessagingApiClient(lineConfig);
const conversationService = new ConversationService(5);
const chatGPTHandler = new ChatGPTHandler(client, conversationService);
const echoHandler = new EchoHandler(client);

app.post(
  '/callback',
  middleware(lineMiddlewareConfig),
  async (req, res) => {
    const events: webhook.Event[] = req.body.events;
    
    await Promise.all(
      events.map(event => echoHandler.handleEvent(event))
    );

    return res.status(200).json({ status: 'success' });
  }
);

app.post(
  '/chatgpt',
  middleware(lineMiddlewareConfig),
  async (req, res) => {
    const events: webhook.Event[] = req.body.events;
    
    try {
      await Promise.all(
        events.map(event => chatGPTHandler.handleEvent(event))
      );
      return res.status(200).json({ status: 'success' });
    } catch (error) {
      console.error('Route Error:', error);
      return res.status(500).json({ status: 'error' });
    }
  }
);

app.listen(SERVER_PORT, () => {
  console.log(`Application is live and listening on port ${SERVER_PORT}`);
});