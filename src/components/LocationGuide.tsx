import { useState } from "react";
import { MapPin, Navigation as NavigationIcon, Clock, Download, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LocationGuide = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false); // initially not loading
  const [permissionDenied, setPermissionDenied] = useState(false);

  const [hasPermission, setHasPermission] = useState(false); // new state

  const nearbyStars = [
    {
      name: "St. Benedict's Monastery",
      distance: "50m",
      type: "Active Site",
      description: "Founded in 1147, this Benedictine monastery features remarkable Romanesque architecture.",
      audioAvailable: true,
      downloaded: false,
      coords: { lat: 43.467, lng: 11.042 },
    },
    {
      name: "Ancient Bell Tower",
      distance: "120m",
      type: "Monument",
      description: "12th century bell tower with original bronze bells and panoramic valley views.",
      audioAvailable: true,
      downloaded: true,
      coords: { lat: 43.468, lng: 11.044 },
    },
    {
      name: "Monastery Gardens",
      distance: "200m",
      type: "Garden",
      description: "Restored medieval herb garden with medicinal and culinary plants used by monks.",
      audioAvailable: true,
      downloaded: false,
      coords: { lat: 43.469, lng: 11.045 },
    },
  ];

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) ** 2 +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // in metres
  };

  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionDenied(true);
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setHasPermission(true);
        setLoading(false);
      },
      () => {
        setPermissionDenied(true);
        setLoading(false);
      }
    );
  };

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
            {loading ? (
              <p className="flex items-center gap-2 text-primary-foreground/80">
                <Loader2 className="h-4 w-4 animate-spin" /> Detecting your location...
              </p>
            ) : permissionDenied ? (
              <p className="text-red-200">Permission denied. Please enable GPS.</p>
            ) : !hasPermission ? (
              <p className="text-primary-foreground/80">Please grant location access to see nearby sites.</p>
            ) : (
              <p className="text-primary-foreground/80">
                GPS Active - {nearbyStars.length} sites nearby
              </p>
            )}
          </div>
        </div>

        {!hasPermission && !loading && !permissionDenied && (
          <Button onClick={requestLocation} className="bg-heritage-gold text-white">
            Grant Location Access
          </Button>
        )}

        {hasPermission && location && (
          <div className="flex items-center gap-2 text-sm text-primary-foreground/90 mt-4">
            <NavigationIcon className="h-4 w-4" />
            <span>
              Current location: {location.lat.toFixed(3)}, {location.lng.toFixed(3)}
            </span>
          </div>
        )}
      </div>

      {/* Current Site Alert */}
      {hasPermission && location && (
        <div className="mx-4 -mt-4 mb-6">
          <Card className="border-heritage-gold bg-heritage-cream shadow-gold">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-heritage-gold rounded-full">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-heritage-burgundy">
                    You're at St. Benedict's Monastery!
                  </h3>
                  <p className="text-sm text-muted-foreground">Audio guide available now</p>
                </div>
                <Button size="sm" className="bg-heritage-gold hover:bg-heritage-gold-light text-white">
                  Start Audio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nearby Sites */}
      {hasPermission && (
        <div className="px-4 space-y-4">
          <h2 className="text-xl font-semibold text-heritage-burgundy mb-4">Nearby Heritage Sites</h2>

          {nearbyStars.map((site, index) => {
            let distanceDisplay = site.distance;
            if (location) {
              const dist = getDistance(location.lat, location.lng, site.coords.lat, site.coords.lng);
              distanceDisplay = dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)} km`;
            }

            return (
              <Card key={index} className="shadow-soft hover:shadow-heritage transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-heritage-burgundy">{site.name}</CardTitle>
                      <div className="flex items-center gap-3 mt-1">
                        <Badge variant="secondary" className="bg-heritage-stone-light text-heritage-burgundy">
                          {distanceDisplay}
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
                    <Button size="sm" className="bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white">
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
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LocationGuide;
