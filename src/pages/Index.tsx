import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SuggestedPrompt } from "@/components/SuggestedPrompt";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Clock, History } from "lucide-react";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const suggestedPrompts = [
  {
    title: "Explain a complex topic",
    description: "Break down difficult concepts",
    icon: Book,
  },
  {
    title: "Help with homework",
    description: "Get step-by-step guidance",
    icon: Clock,
  },
  {
    title: "Study techniques",
    description: "Learn effective study methods",
    icon: History,
  },
];

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your ALU Student Companion. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I understand your question. Let me help you with that...",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSendAudio = async (blob: Blob) => {
    // Here you would typically:
    // 1. Convert audio to text using a speech-to-text service
    // 2. Send the text to your AI service
    // 3. Get the response and add it to messages
    
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "🎤 Voice message sent",
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const handleFileUpload = async (file: File) => {
    // Here you would typically:
    // 1. Upload the file to a storage service
    // 2. Process the file (OCR for images, text extraction for PDFs)
    // 3. Send the content to your AI service
    // 4. Get the response and add it to messages

    const userMessage: Message = {
      id: Date.now().toString(),
      content: `📎 Uploaded: ${file.name}`,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <img
            src="/lovable-uploads/e416da77-8f14-4c29-99a1-e7af0cf8dccf.png"
            alt="ALU Logo"
            className="h-8"
          />
          <h1 className="text-xl font-semibold">ALU Student Companion</h1>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden p-4">
        {messages.length === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {suggestedPrompts.map((prompt) => (
              <SuggestedPrompt
                key={prompt.title}
                title={prompt.title}
                description={prompt.description}
                onClick={() => handleSendMessage(prompt.title)}
              />
            ))}
          </div>
        )}

        <ScrollArea className="flex-1">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message.content}
                isUser={message.isUser}
                timestamp={message.timestamp}
              />
            ))}
            {isTyping && (
              <div className="flex gap-3">
                <img
                  src="/lovable-uploads/e416da77-8f14-4c29-99a1-e7af0cf8dccf.png"
                  alt="ALU_SC"
                  className="w-8 h-8"
                />
                <div className="typing-indicator">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </main>

      <ChatInput
        onSendMessage={handleSendMessage}
        onSendAudio={handleSendAudio}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default Index;