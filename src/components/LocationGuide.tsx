import { useState, useRef } from "react";
import { 
  MapPin, 
  Navigation as NavigationIcon, 
  Clock, 
  Download, 
  Loader2, 
  Play, 
  Pause, 
  Headphones 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const LocationGuide = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  const [currentAudioId, setCurrentAudioId] = useState(null); 
  const [languageSelection, setLanguageSelection] = useState({}); // track selected language per site

  const audioRef = useRef(null);

  const currentSiteId = "rumtek-monastery-main";

  const nearbySites = [
    {
      id: "rumtek-monastery-main",
      name: "Rumtek Monastery",
      distance: "50m",
      type: "Active Site",
      description: "Historic Rumtek Monastery with rich Buddhist heritage.",
      audioAvailable: true,
      downloaded: false,
      coords: { lat: 43.467, lng: 11.042 },
      audioPaths: {
        en: "/RUMTEK-ENGLISH.mp3",
        hi: "/RUMTEK-HINDI.mp3",
        jp: "/RUMTEK-JAPANESE.mp3"
      }
    },
    {
      id: "ancient-bell-tower",
      name: "Ancient Bell Tower",
      distance: "120m",
      type: "Monument",
      description: "12th century bell tower with panoramic views.",
      audioAvailable: true,
      downloaded: true,
      coords: { lat: 43.468, lng: 11.044 },
      audioPaths: {
        en: "/audio/BELL-ENGLISH.mp3",
        hi: "/audio/BELL-HINDI.mp3"
      }
    },
    {
      id: "monastery-gardens",
      name: "Monastery Gardens",
      distance: "200m",
      type: "Garden",
      description: "Restored medieval herb garden with medicinal plants.",
      audioAvailable: true,
      downloaded: false,
      coords: { lat: 43.469, lng: 11.045 },
      audioPaths: {
        en: "/audio/GARDEN-ENGLISH.mp3",
        hi: "/audio/GARDEN-HINDI.mp3"
      }
    },
  ];

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // metres
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
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

  const toggleAudio = (site) => {
    const lang = languageSelection[site.id] || "en";
    const audioSrc = site.audioPaths[lang];
    if (!audioSrc) return;

    if (currentAudioId === site.id) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setCurrentAudioId(null);
    } else {
      audioRef.current.src = audioSrc;
      audioRef.current.play();
      setCurrentAudioId(site.id);
    }
  };

  const handleLanguageChange = (siteId, lang) => {
    setLanguageSelection({ ...languageSelection, [siteId]: lang });
    const site = nearbySites.find((s) => s.id === siteId);
    if (currentAudioId === siteId && site.audioPaths[lang]) {
      audioRef.current.src = site.audioPaths[lang];
      audioRef.current.play();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      <audio ref={audioRef} />
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
                GPS Active - {nearbySites.length} sites nearby
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

      {/* Nearby Sites */}
      {hasPermission && (
        <div className="px-4 space-y-4 mt-4">
          <h2 className="text-xl font-semibold text-heritage-burgundy mb-4">Nearby Heritage Sites</h2>

          {nearbySites.map((site, index) => {
            const isPlaying = currentAudioId === site.id;

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
                    <div className="flex flex-col items-end gap-2">
                      {site.audioAvailable && (
                        <div className="p-1 bg-heritage-gold/20 rounded flex items-center gap-1">
                          <Clock className="h-4 w-4 text-heritage-gold" />
                          <select
                            value={languageSelection[site.id] || "en"}
                            onChange={(e) => handleLanguageChange(site.id, e.target.value)}
                            className="text-sm bg-white rounded px-1 py-0.5 border border-gray-300"
                          >
                            <option value="en">English</option>
                            <option value="hi">Hindi</option>
                            <option value="jp">JAPANESE</option>
                          </select>
                        </div>
                      )}
                      <Button
                        size="sm"
                        className="bg-heritage-gold hover:bg-heritage-gold-light text-white"
                        onClick={() => toggleAudio(site)}
                      >
                        {isPlaying ? (
                          <><Pause className="h-4 w-4 mr-1" /> Stop Audio</>
                        ) : (
                          <><Play className="h-4 w-4 mr-1" /> Play Audio</>
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm mb-4">{site.description}</p>
                  <Button size="sm" className="bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white">
                    Navigate
                  </Button>
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
