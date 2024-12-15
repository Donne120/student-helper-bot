import { useState, useEffect } from "react";
import { SignupForm } from "@/components/SignupForm";
import { UserProfile } from "@/components/UserProfile";
import { SuggestedPrompt } from "@/components/SuggestedPrompt";
import { ChatContainer } from "@/components/ChatContainer";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Book, Clock, History, Lightbulb, BookOpen, Calculator } from "lucide-react";
import { toast } from "sonner";
import { checkHealth } from "@/services/api";

interface User {
  email: string;
  name: string;
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
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkBackendHealth = async () => {
      const isHealthy = await checkHealth();
      if (!isHealthy) {
        toast.error("Unable to connect to AI service. Some features may be limited.");
      }
    };

    checkBackendHealth();
  }, []);

  const handleSignup = async (data: { email: string; name: string }) => {
    setUser(data);
    toast.success(`Welcome, ${data.name}!`);
  };

  const handleClearChat = () => {
    window.location.reload();
    toast.success("Chat cleared successfully");
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <img
          src="/lovable-uploads/e416da77-8f14-4c29-99a1-e7af0cf8dccf.png"
          alt="ALU Logo"
          className="h-12 mb-8"
        />
        <h1 className="text-2xl font-semibold mb-8">
          Welcome to ALU Student Companion
        </h1>
        <SignupForm onSignup={handleSignup} />
      </div>
    );
  }

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
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClearChat}
          className="text-muted-foreground hover:text-foreground"
          title="Clear chat"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r hidden md:block">
          <UserProfile user={user} />
          <div className="p-4">
            <h2 className="font-semibold mb-4">Suggested Prompts</h2>
            <div className="space-y-2">
              {suggestedPrompts.map((prompt) => (
                <SuggestedPrompt
                  key={prompt.title}
                  title={prompt.title}
                  description={prompt.description}
                  icon={prompt.icon}
                  onClick={() => {
                    const chatContainer = document.querySelector(
                      "main"
                    ) as HTMLElement;
                    const input = chatContainer?.querySelector(
                      "input"
                    ) as HTMLInputElement;
                    if (input) {
                      input.value = prompt.title;
                      input.focus();
                    }
                  }}
                />
              ))}
            </div>
          </div>
        </aside>

        <ChatContainer user={user} />
      </div>
    </div>
  );
};

export default Index;