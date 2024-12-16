import { useState, useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { ChatInput } from "@/components/ChatInput";
import { sendMessage, analyzeFile, transcribeAudio } from "@/services/api";
import { toast } from "sonner";

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatContainerProps {
  user: {
    name: string;
    email: string;
  } | null;
}

export const ChatContainer = ({ user }: ChatContainerProps) => {
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
    if (!user) {
      toast.error("Please sign up to send messages");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await sendMessage(content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to get AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleEditMessage = async (messageId: string, newContent: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, content: newContent } : msg
      )
    );

    // Regenerate AI response after edit
    setIsTyping(true);
    try {
      const response = await sendMessage(newContent);
      setMessages((prev) => {
        const editedMessageIndex = prev.findIndex((msg) => msg.id === messageId);
        if (editedMessageIndex !== -1 && editedMessageIndex < prev.length - 1) {
          const newMessages = [...prev];
          newMessages[editedMessageIndex + 1] = {
            id: Date.now().toString(),
            content: response,
            isUser: false,
            timestamp: new Date(),
          };
          return newMessages;
        }
        return prev;
      });
    } catch (error) {
      console.error("Failed to regenerate AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendAudio = async (blob: Blob) => {
    if (!user) {
      toast.error("Please sign up to send voice messages");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: "🎤 Voice message sent",
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const transcription = await transcribeAudio(blob);
      const response = await sendMessage(transcription);
      
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          content: `Transcription: ${transcription}`,
          isUser: true,
          timestamp: new Date(),
        },
        {
          id: (Date.now() + 1).toString(),
          content: response,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("Failed to process voice message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!user) {
      toast.error("Please sign up to upload files");
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: `📎 Analyzing: ${file.name}`,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const analysis = await analyzeFile(file);
      const aiMessage: Message = {
        id: Date.now().toString(),
        content: analysis,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to analyze file:", error);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
              onEdit={
                message.isUser
                  ? (newContent) => handleEditMessage(message.id, newContent)
                  : undefined
              }
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
  );
};