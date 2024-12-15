import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatMessage = ({ message, isUser, timestamp }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "flex gap-3 message-appear",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <Avatar className="w-8 h-8">
        <img
          src={isUser ? "/placeholder.svg" : "/lovable-uploads/e416da77-8f14-4c29-99a1-e7af0cf8dccf.png"}
          alt={isUser ? "User" : "ALU_SC"}
          className="object-cover"
        />
      </Avatar>
      <Card
        className={cn(
          "p-3 max-w-[80%]",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        )}
      >
        <p className="text-sm">{message}</p>
        <time className="text-xs opacity-70 mt-1 block">
          {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </time>
      </Card>
    </div>
  );
};