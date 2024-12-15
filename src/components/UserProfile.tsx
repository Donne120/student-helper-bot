import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export const UserProfile = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <img src="/placeholder.svg" alt="User" className="object-cover" />
        </Avatar>
        <div className="text-left">
          <h3 className="font-semibold">ALU Student</h3>
          <p className="text-sm text-muted-foreground">Online</p>
        </div>
      </div>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </div>
  );
};