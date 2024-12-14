type Message = {
    role: 'user' | 'assistant' | 'system';
    content: string;
    name?: string;
  };
  
  export class ConversationService {
    private history: Map<string, Message[]>;
    private readonly maxHistory: number;
  
    constructor(maxHistory: number = 5) {
      this.history = new Map();
      this.maxHistory = maxHistory;
    }
  
    addMessage(userId: string, message: Message): void {
      let messages = this.history.get(userId) || [];
      messages.push(message);
      
      if (messages.length > this.maxHistory) {
        messages = messages.slice(-this.maxHistory);
      }
      
      this.history.set(userId, messages);
    }
  
    getHistory(userId: string): Message[] {
      return this.history.get(userId) || [];
    }
  
    clearHistory(userId: string): void {
      this.history.delete(userId);
    }
  }