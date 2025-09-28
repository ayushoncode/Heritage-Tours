import { MapPin, Camera, Headphones, Users, Settings, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navigation = ({ activeTab, setActiveTab }: { activeTab: string; setActiveTab: (tab: string) => void }) => {
  const navItems = [
    { id: "location", icon: MapPin, label: "Location" },
    { id: "camera", icon: Camera, label: "Camera" },
    { id: "audio", icon: Headphones, label: "Audio" },
    { id: "community", icon: Users, label: "Community" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-heritage-stone-light">
      <div className="flex justify-around items-center py-2 px-4 max-w-md mx-auto">
        {navItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col gap-1 h-auto py-2 px-3 ${
              activeTab === item.id 
                ? "bg-gradient-heritage text-primary-foreground shadow-heritage" 
                : "text-heritage-burgundy hover:bg-heritage-parchment"
            }`}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col gap-1 h-auto py-2 px-3 text-heritage-burgundy hover:bg-heritage-parchment"
        >
          <Settings className="h-5 w-5" />
          <span className="text-xs font-medium">Settings</span>
        </Button>
      </div>
    </div>
  );
};

export default Navigation;