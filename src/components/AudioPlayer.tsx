import { Play, Pause, SkipBack, SkipForward, Volume2, Download, Clock, Languages } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";

const AudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(145); // 2:25 in seconds
  const [duration] = useState(480); // 8:00 in seconds

  const tours = [
    {
      title: "Complete Heritage Tour",
      duration: "45 mins",
      sites: 8,
      description: "Full immersive experience covering all major sites and their historical significance",
      downloaded: true,
      currentlyPlaying: true,
    },
    {
      title: "Quick Discovery Tour", 
      duration: "15 mins",
      sites: 4,
      description: "Essential highlights perfect for visitors with limited time",
      downloaded: true,
      currentlyPlaying: false,
    },
    {
      title: "Architectural Masterpieces",
      duration: "30 mins", 
      sites: 6,
      description: "Deep dive into the monastery's architectural evolution and building techniques",
      downloaded: false,
      currentlyPlaying: false,
    },
  ];

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = (currentTime / duration) * 100;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      {/* Header */}
      <div className="bg-gradient-heritage text-primary-foreground p-6 shadow-heritage">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <Volume2 className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Audio Guides</h1>
            <p className="text-primary-foreground/80">Immersive heritage storytelling</p>
          </div>
        </div>
      </div>

      {/* Current Player */}
      <div className="p-4">
        <Card className="mb-6 shadow-heritage">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-heritage-burgundy">Complete Heritage Tour</CardTitle>
                <p className="text-sm text-muted-foreground">St. Benedict's Monastery - Chapter 3</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Languages className="h-4 w-4" />
                </Button>
                <Badge className="bg-heritage-gold text-white">English</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="mb-4">
              <Progress value={progressPercentage} className="mb-2" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <Button variant="ghost" size="sm">
                <SkipBack className="h-5 w-5" />
              </Button>
              <Button 
                size="lg"
                className="bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white rounded-full w-16 h-16"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
              </Button>
              <Button variant="ghost" size="sm">
                <SkipForward className="h-5 w-5" />
              </Button>
            </div>

            {/* Current Chapter Info */}
            <div className="bg-heritage-parchment rounded-lg p-4 text-center">
              <p className="font-medium text-heritage-burgundy">The Great Refectory</p>
              <p className="text-sm text-muted-foreground">Where monks gathered for communal meals and reflection</p>
            </div>
          </CardContent>
        </Card>

        {/* Available Tours */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-heritage-burgundy">Available Tours</h2>
          
          {tours.map((tour, index) => (
            <Card key={index} className={`shadow-soft ${tour.currentlyPlaying ? 'ring-2 ring-heritage-gold' : ''}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg text-heritage-burgundy">{tour.title}</CardTitle>
                    <div className="flex items-center gap-3 mt-2">
                      <Badge variant="secondary" className="bg-heritage-stone-light">
                        <Clock className="h-3 w-3 mr-1" />
                        {tour.duration}
                      </Badge>
                      <Badge variant="outline" className="border-heritage-gold text-heritage-burgundy">
                        {tour.sites} sites
                      </Badge>
                      {tour.currentlyPlaying && (
                        <Badge className="bg-heritage-gold text-white">Playing</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {tour.downloaded ? (
                      <div className="p-1 bg-green-100 rounded">
                        <Download className="h-4 w-4 text-green-600" />
                      </div>
                    ) : (
                      <Button variant="ghost" size="sm" className="p-1 h-auto">
                        <Download className="h-4 w-4 text-heritage-burgundy" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">{tour.description}</p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    className={tour.currentlyPlaying 
                      ? "bg-heritage-gold hover:bg-heritage-gold-light text-white" 
                      : "bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white"
                    }
                  >
                    {tour.currentlyPlaying ? 'Continue' : 'Start Tour'}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="border-heritage-stone text-heritage-burgundy hover:bg-heritage-parchment"
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;