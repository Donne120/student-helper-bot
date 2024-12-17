import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatMessage } from "@/components/ChatMessage";
import { useMessageContext } from "@/contexts/MessageContext";

export const MessageList = () => {
  const { messages, isTyping, handleEditMessage } = useMessageContext();
  
  return (
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
              src="/lovable-uploads/a8505b92-320f-4416-ad66-216a21832f0b.png"
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
      </div>
    </ScrollArea>
  );
};