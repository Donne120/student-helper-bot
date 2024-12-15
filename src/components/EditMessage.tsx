import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";

interface EditMessageProps {
  content: string;
  onSave: (newContent: string) => void;
  onCancel: () => void;
}

export const EditMessage = ({ content, onSave, onCancel }: EditMessageProps) => {
  const [editedContent, setEditedContent] = useState(content);

  const handleSave = () => {
    if (editedContent.trim()) {
      onSave(editedContent);
    }
  };

  return (
    <div className="flex gap-2 items-center w-full">
      <Input
        value={editedContent}
        onChange={(e) => setEditedContent(e.target.value)}
        className="flex-1"
        autoFocus
      />
      <Button variant="ghost" size="icon" onClick={handleSave}>
        <Check className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={onCancel}>
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};