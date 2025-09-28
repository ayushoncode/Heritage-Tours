import { useState } from "react";
import { MapPin, Camera, Headphones, Users, Globe, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import LocationGuide from "@/components/LocationGuide";
import CameraMode from "@/components/CameraMode";
import AudioPlayer from "@/components/AudioPlayer";
import Community from "@/components/Community";
import monasteryHeroImage from "@/assets/monastery-hero.jpg";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  if (activeTab === "location") return <LocationGuide />;
  if (activeTab === "camera") return <CameraMode />;
  if (activeTab === "audio") return <AudioPlayer />;
  if (activeTab === "community") return <Community />;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
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
            
            <h1 className="text-4xl font-bold text-white mb-4">
              Heritage Guide
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Discover the stories hidden in ancient monasteries and heritage sites with AI-powered audio guides
            </p>
            
            <div className="space-y-4">
              <Button 
                size="lg" 
                className="w-full bg-heritage-gold hover:bg-heritage-gold-light text-white shadow-gold text-lg py-6"
                onClick={() => setActiveTab("location")}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Start Exploring
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setActiveTab("camera")}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Artifact
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  onClick={() => setActiveTab("audio")}
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
            <Card className="shadow-soft hover:shadow-heritage transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-heritage rounded-full">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-heritage-burgundy">Location-Based Discovery</CardTitle>
                    <p className="text-sm text-muted-foreground">Automatic audio guides when you arrive</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-heritage transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-heritage rounded-full">
                    <Camera className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-heritage-burgundy">AI Recognition</CardTitle>
                    <p className="text-sm text-muted-foreground">Point your camera at any artifact</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-heritage transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-heritage rounded-full">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-heritage-burgundy">Offline Ready</CardTitle>
                    <p className="text-sm text-muted-foreground">Download content for remote areas</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card className="shadow-soft hover:shadow-heritage transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-heritage rounded-full">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-heritage-burgundy">Community Sharing</CardTitle>
                    <p className="text-sm text-muted-foreground">Share discoveries with travelers</p>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Button 
              className="bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white"
              onClick={() => setActiveTab("location")}
            >
              Begin Your Journey
            </Button>
          </div>
        </div>
      </div>

      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export default Index;
