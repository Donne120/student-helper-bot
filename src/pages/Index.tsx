import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { SuggestedPrompt } from "@/components/SuggestedPrompt";
import { UserProfile } from "@/components/UserProfile";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Book, Clock, History, Lightbulb, BookOpen, Calculator } from "lucide-react";

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
  {
    title: "Research assistance",
    description: "Help with academic research",
    icon: BookOpen,
  },
  {
    title: "Math problem solver",
    description: "Step-by-step math solutions",
    icon: Calculator,
  },
  {
    title: "Learning strategies",
    description: "Personalized learning tips",
    icon: Lightbulb,
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

  const handleEditMessage = (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, content: newContent }
          : msg
      )
    );
  };

  const handleSendAudio = async (blob: Blob) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: "🎤 Voice message sent",
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
  };

  const handleFileUpload = async (file: File) => {
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

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r hidden md:block">
          <UserProfile />
          <div className="p-4">
            <h2 className="font-semibold mb-4">Suggested Prompts</h2>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt) => (
                <SuggestedPrompt
                  key={prompt.title}
                  title={prompt.title}
                  description={prompt.description}
                  onClick={() => handleSendMessage(prompt.title)}
                />
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.content}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                  onEdit={message.isUser ? (newContent) => handleEditMessage(message.id, newContent) : undefined}
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

          <ChatInput
            onSendMessage={handleSendMessage}
            onSendAudio={handleSendAudio}
            onFileUpload={handleFileUpload}
          />
        </main>
      </div>
    </div>
  );
};

export default Index;