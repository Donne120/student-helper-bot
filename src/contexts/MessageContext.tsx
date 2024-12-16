import { createContext, useContext, useState, ReactNode } from "react";
import { Message, User } from "@/types/chat";
import { sendMessage, analyzeFile, transcribeAudio } from "@/services/api";
import { toast } from "sonner";

interface MessageContextType {
  messages: Message[];
  isTyping: boolean;
  handleSendMessage: (content: string) => Promise<void>;
  handleEditMessage: (messageId: string, newContent: string) => Promise<void>;
  handleSendAudio: (blob: Blob) => Promise<void>;
  handleFileUpload: (file: File) => Promise<void>;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your ALU Student Companion. How can I help you today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

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

  const value = {
    messages,
    isTyping,
    handleSendMessage,
    handleEditMessage,
    handleSendAudio,
    handleFileUpload,
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};