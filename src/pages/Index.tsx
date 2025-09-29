import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import LocationGuide from "@/components/LocationGuide";
import CameraMode from "@/components/CameraMode";
import AudioPlayer from "@/components/AudioPlayer";
import Community from "@/components/Community";
import Home from "@/components/Home"; // ✅ New Home page

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  // --- Tab change function with URL sync ---
  const changeTab = (tab) => {
    setActiveTab(tab);
    window.history.pushState({ tab }, "", `#${tab}`);
  };

  // --- Handle back/forward + refresh ---
  useEffect(() => {
    const onPopState = (e) => {
      if (e.state?.tab) setActiveTab(e.state.tab);
      else if (window.location.hash) setActiveTab(window.location.hash.replace("#", ""));
      else setActiveTab("home");
    };

    window.addEventListener("popstate", onPopState);

    if (window.location.hash) setActiveTab(window.location.hash.replace("#", ""));

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  // --- Render main content based on activeTab ---
  const renderContent = () => {
    switch (activeTab) {
      case "location":
        return <LocationGuide />;
      case "camera":
        return <CameraMode />;
      case "audio":
        return <AudioPlayer />;
      case "community":
        return <Community />;
      case "home":
      default:
        return <Home changeTab={changeTab} />; // ✅ using Home.jsx
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      {renderContent()}
      <Navigation activeTab={activeTab} setActiveTab={changeTab} />
    </div>
  );
};

export default Index;
