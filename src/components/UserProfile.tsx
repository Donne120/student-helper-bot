import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface UserProfileProps {
  user: {
    name: string;
    email: string;
  };
}

export const UserProfile = ({ user }: UserProfileProps) => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <img src="/placeholder.svg" alt={user.name} className="object-cover" />
        </Avatar>
        <div className="text-left">
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};