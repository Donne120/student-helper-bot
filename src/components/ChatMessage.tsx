import { useState } from "react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditMessage } from "./EditMessage";

interface ChatMessageProps {
  message: string;
  isUser: boolean;
  timestamp: Date;
  onEdit?: (newContent: string) => void;
}

export const ChatMessage = ({ message, isUser, timestamp, onEdit }: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = (newContent: string) => {
    onEdit?.(newContent);
    setIsEditing(false);
  };

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
          "p-3 max-w-[80%] relative group",
          isUser ? "bg-primary text-primary-foreground" : "bg-secondary"
        )}
      >
        {isEditing ? (
          <EditMessage
            content={message}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <>
            <p className="text-sm">{message}</p>
            <time className="text-xs opacity-70 mt-1 block">
              {timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </time>
            {isUser && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
      </Card>
    </div>
  );
};