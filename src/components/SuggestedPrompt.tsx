import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface SuggestedPromptProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  onClick: () => void;
}

export const SuggestedPrompt = ({
  title,
  description,
  icon: Icon,
  onClick,
}: SuggestedPromptProps) => {
  return (
    <Card
      className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {Icon && <Icon className="w-5 h-5 text-primary" />}
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Card>
  );
};