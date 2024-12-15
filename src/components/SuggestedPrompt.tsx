import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface SuggestedPromptProps {
  title: string;
  description: string;
  onClick: () => void;
}

export const SuggestedPrompt = ({
  title,
  description,
  onClick,
}: SuggestedPromptProps) => {
  return (
    <Card
      className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
};