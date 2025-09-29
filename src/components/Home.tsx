import { useState, useEffect } from "react";
import { MapPin, Camera, Headphones, Users, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

// Animated Counter Component
const AnimatedCounter = ({ target, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = target / (duration / 50); // 50ms interval
    const interval = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 50);

    return () => clearInterval(interval);
  }, [target, duration]);

  return <span>{count}+</span>;
};

const Home = ({ changeTab }) => {
  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen overflow-hidden font-inter">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/image copy.png')" }} // space removed from filename
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#5E2B28]/50 via-[#5E2B28]/30 to-[#5E2B28]/50"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center items-center h-full px-6 text-center">
          <div className="max-w-xl mx-auto">
            <div className="p-3 bg-white/20 backdrop-blur-md rounded-full inline-block mb-6">
              <img
                src="/image.png"
                alt="Logo"
                className="h-8 w-8 object-contain"
              />
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-wide">
              Heritage Guide
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed">
              Discover the stories hidden in ancient monasteries and heritage sites with AI-powered audio guides
            </p>

            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-[#D4AF37] to-[#F3D17A] text-white font-semibold shadow-lg py-5 text-lg hover:scale-105 transition-transform"
                onClick={() => changeTab("location")}
              >
                <MapPin className="h-5 w-5 mr-2" />
                Start Exploring
              </Button>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-white/30 text-black hover:bg-white/10 backdrop-blur-md py-3"
                  onClick={() => changeTab("camera")}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Scan Artifact
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-white/30 text-black hover:bg-white/10 backdrop-blur-md py-3"
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
        <div className="absolute bottom-20 left-6 right-6">
          <div className="flex justify-center gap-8 text-white/80 font-semibold">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                <AnimatedCounter target={150} />
              </div>
              <div className="text-sm md:text-base">Heritage Sites</div>
            </div>
            <div className="w-px bg-white/30 mx-2"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                <AnimatedCounter target={25} />
              </div>
              <div className="text-sm md:text-base">Languages</div>
            </div>
            <div className="w-px bg-white/30 mx-2"></div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">
                <AnimatedCounter target={500} />
              </div>
              <div className="text-sm md:text-base">Audio Guides</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="px-6 py-12 bg-[#F9F5F0]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#5E2B28] text-center mb-12">
            Explore Heritage Like Never Before
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            {[
              { icon: <MapPin className="h-6 w-6 text-[#D4AF37]" />, title: "Location-Based Discovery", desc: "Automatic audio guides when you arrive" },
              { icon: <Camera className="h-6 w-6 text-[#D4AF37]" />, title: "AI Recognition", desc: "Point your camera at any artifact" },
              { icon: <Download className="h-6 w-6 text-[#D4AF37]" />, title: "Offline Ready", desc: "Download content for remote areas" },
              { icon: <Users className="h-6 w-6 text-[#D4AF37]" />, title: "Community Sharing", desc: "Share discoveries with travelers" },
            ].map((f, i) => (
              <Card key={i} className="shadow-md hover:shadow-lg transition-shadow rounded-xl">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-[#5E2B28]/20 rounded-full">{f.icon}</div>
                    <div>
                      <CardTitle className="text-[#5E2B28] font-semibold">{f.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              className="bg-gradient-to-r from-[#5E2B28] to-[#8B3E2F] hover:from-[#8B3E2F] hover:to-[#A25B4F] text-white font-semibold py-4 px-10 rounded-lg shadow-lg"
              onClick={() => changeTab("location")}
            >
              Begin Your Journey
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

