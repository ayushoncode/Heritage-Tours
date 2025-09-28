import React from "react";
import { MapPin, Camera, Headphones, Users } from "lucide-react";

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { name: "location", icon: <MapPin />, label: "Explore" },
    { name: "camera", icon: <Camera />, label: "Scan" },
    { name: "audio", icon: <Headphones />, label: "Audio" },
    { name: "community", icon: <Users />, label: "Community" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm flex justify-around py-3 z-50">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`
              flex flex-col items-center justify-center space-y-1 px-4 py-2 rounded-lg transition-colors
              ${isActive ? "bg-heritage-gold text-white" : "text-white hover:bg-white/20"}
            `}
          >
            {React.cloneElement(tab.icon, {
              className: `h-5 w-5 ${isActive ? "text-white" : "text-white/80"}`,
            })}
            <span className={`text-xs ${isActive ? "text-white font-semibold" : "text-white/80"}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;

