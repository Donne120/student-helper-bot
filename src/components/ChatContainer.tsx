import { useRef, useEffect } from "react";
import { MessageList } from "@/components/chat/MessageList";
import { ChatInput } from "@/components/ChatInput";
import { MessageProvider } from "@/contexts/MessageContext";
import { User } from "@/types/chat";

interface ChatContainerProps {
  user: User | null;
}

export const ChatContainer = ({ user }: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  return (
    <MessageProvider user={user}>
      <main className="flex-1 flex flex-col overflow-hidden">
        <MessageList />
        <div ref={messagesEndRef} />
        <ChatInput />
      </main>
    </MessageProvider>
  );
};