import { MapPin, Navigation as NavigationIcon, Clock, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import monasteryImage from "@/assets/monastery-cloister.jpg";

const LocationGuide = () => {
  const nearbyStars = [
    {
      name: "St. Benedict's Monastery",
      distance: "50m",
      type: "Active Site",
      description: "Founded in 1147, this Benedictine monastery features remarkable Romanesque architecture.",
      audioAvailable: true,
      downloaded: false,
    },
    {
      name: "Ancient Bell Tower",
      distance: "120m", 
      type: "Monument",
      description: "12th century bell tower with original bronze bells and panoramic valley views.",
      audioAvailable: true,
      downloaded: true,
    },
    {
      name: "Monastery Gardens",
      distance: "200m",
      type: "Garden",
      description: "Restored medieval herb garden with medicinal and culinary plants used by monks.",
      audioAvailable: true,
      downloaded: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      {/* Header */}
      <div className="bg-gradient-heritage text-primary-foreground p-6 shadow-heritage">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <MapPin className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Location Guide</h1>
            <p className="text-primary-foreground/80">GPS Active - 3 sites nearby</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-primary-foreground/90">
          <NavigationIcon className="h-4 w-4" />
          <span>Current location: Monastery Valley, Tuscany</span>
        </div>
      </div>

      {/* Current Site Alert */}
      <div className="mx-4 -mt-4 mb-6">
        <Card className="border-heritage-gold bg-heritage-cream shadow-gold">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-heritage-gold rounded-full">
                <MapPin className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-heritage-burgundy">You're at St. Benedict's Monastery!</h3>
                <p className="text-sm text-muted-foreground">Audio guide available now</p>
              </div>
              <Button size="sm" className="bg-heritage-gold hover:bg-heritage-gold-light text-white">
                Start Audio
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Nearby Sites */}
      <div className="px-4 space-y-4">
        <h2 className="text-xl font-semibold text-heritage-burgundy mb-4">Nearby Heritage Sites</h2>
        
        {nearbyStars.map((site, index) => (
          <Card key={index} className="shadow-soft hover:shadow-heritage transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg text-heritage-burgundy">{site.name}</CardTitle>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary" className="bg-heritage-stone-light text-heritage-burgundy">
                      {site.distance}
                    </Badge>
                    <Badge variant="outline" className="border-heritage-gold text-heritage-burgundy">
                      {site.type}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {site.audioAvailable && (
                    <div className="p-1 bg-heritage-gold/20 rounded">
                      <Clock className="h-4 w-4 text-heritage-gold" />
                    </div>
                  )}
                  {site.downloaded ? (
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
              <p className="text-muted-foreground text-sm mb-4">{site.description}</p>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white"
                >
                  Navigate
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-heritage-gold text-heritage-burgundy hover:bg-heritage-gold/10"
                >
                  Preview Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LocationGuide;