import { useState, useEffect } from "react";
import { MapPin, Camera, Headphones, Users, Globe, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import LocationGuide from "@/components/LocationGuide";
import CameraMode from "@/components/CameraMode";
import AudioPlayer from "@/components/AudioPlayer";
import Community from "@/components/Community";
import monasteryHeroImage from "@/assets/monastery-hero.jpg";

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
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="relative h-screen overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${monasteryHeroImage})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-heritage-burgundy/70 via-heritage-burgundy/50 to-heritage-burgundy/80"></div>
              </div>

              <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 text-center">
                <div className="max-w-md mx-auto">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-full inline-block mb-6">
                    <Globe className="h-8 w-8 text-white" />
                  </div>

                  <h1 className="text-4xl font-bold text-white mb-4">Heritage Guide</h1>
                  <p className="text-xl text-white/90 mb-8 leading-relaxed">
                    Discover the stories hidden in ancient monasteries and heritage sites with AI-powered audio guides
                  </p>

                  <div className="space-y-4">
                    <Button
                      size="lg"
                      className="w-full bg-heritage-gold hover:bg-heritage-gold-light text-white shadow-gold text-lg py-6"
                      onClick={() => changeTab("location")}
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Start Exploring
                    </Button>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                        onClick={() => changeTab("camera")}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Scan Artifact
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                        onClick={() => changeTab("audio")}
                      >
                        <Headphones className="h-4 w-4 mr-2" />
                        Audio Tours
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="absolute bottom-8 left-6 right-6">
                <div className="flex justify-center gap-4 text-white/80">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-sm">Heritage Sites</div>
                  </div>
                  <div className="w-px bg-white/30 mx-2"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">25+</div>
                    <div className="text-sm">Languages</div>
                  </div>
                  <div className="w-px bg-white/30 mx-2"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm">Audio Guides</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Overview */}
            <div className="px-6 py-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-2xl font-bold text-heritage-burgundy text-center mb-8">
                  Explore Heritage Like Never Before
                </h2>

                <div className="space-y-6">
                  {[
                    { icon: <MapPin className="h-6 w-6 text-white" />, title: "Location-Based Discovery", desc: "Automatic audio guides when you arrive" },
                    { icon: <Camera className="h-6 w-6 text-white" />, title: "AI Recognition", desc: "Point your camera at any artifact" },
                    { icon: <Download className="h-6 w-6 text-white" />, title: "Offline Ready", desc: "Download content for remote areas" },
                    { icon: <Users className="h-6 w-6 text-white" />, title: "Community Sharing", desc: "Share discoveries with travelers" },
                  ].map((f, i) => (
                    <Card key={i} className="shadow-soft hover:shadow-heritage transition-shadow">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-heritage rounded-full">{f.icon}</div>
                          <div>
                            <CardTitle className="text-heritage-burgundy">{f.title}</CardTitle>
                            <p className="text-sm text-muted-foreground">{f.desc}</p>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button
                    className="bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white"
                    onClick={() => changeTab("location")}
                  >
                    Begin Your Journey
                  </Button>
                </div>
              </div>
            </div>
          </>
        );
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
