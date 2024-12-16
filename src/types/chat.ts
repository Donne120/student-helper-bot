export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface User {
  name: string;
  email: string;
}