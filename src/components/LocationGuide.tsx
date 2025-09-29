import { useState, useRef, useEffect, useCallback } from "react";
import { 
  MapPin, 
  Navigation as NavigationIcon, 
  Clock, 
  Download, 
  Loader2, 
  Play, 
  Pause, 
  Headphones,
  CheckCircle,
  GanttChart, // Used for Monument
  Sprout, // Used for Garden
  Briefcase, // Used for Active Site (Work/Living)
  Globe, // For 'Navigate' button
  XCircle // For error state
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; // Assuming you have a Progress component

// --- Utility Functions ---
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

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

// --- Custom Icons Mapping ---
const SiteIconMap = {
  'Active Site': Briefcase,
  'Monument': GanttChart,
  'Garden': Sprout
};

// --- Location Guide Component ---
const LocationGuide = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  // New State for Audio Management
  const [audioState, setAudioState] = useState({
    isPlaying: false,
    currentAudioId: null,
    duration: 0,
    currentTime: 0,
    isLoading: false,
    error: null,
  });
  const [languageSelection, setLanguageSelection] = useState({});

  const audioRef = useRef(null);

  const nearbySites = [
    // Added estimated duration for UX
    {
      id: "rumtek-monastery-main",
      name: "Rumtek Monastery",
      distance: "50m",
      type: "Active Site",
      description: "Historic Rumtek Monastery, a major center of the Karma Kagyu lineage. Home to sacred relics and a thriving monastic community.",
      audioAvailable: true,
      downloaded: true,
      audioDuration: 185, // seconds
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
      description: "12th century bell tower with panoramic views. Used historically for timekeeping and warning.",
      audioAvailable: true,
      downloaded: false,
      audioDuration: 120, // seconds
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
      description: "Restored medieval herb garden with medicinal plants. A tranquil spot for reflection.",
      audioAvailable: true,
      downloaded: false,
      audioDuration: 95, // seconds
      coords: { lat: 43.469, lng: 11.045 },
      audioPaths: {
        en: "/audio/GARDEN-ENGLISH.mp3",
        hi: "/audio/GARDEN-HINDI.mp3"
      }
    },
  ];

  // --- Geolocation Logic ---
  const requestLocation = () => {
    if (!navigator.geolocation) {
      setPermissionDenied(true);
      return;
    }
    setLoading(true);
    // Added watchPosition for real-time distance updates (better UX)
    navigator.geolocation.watchPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy });
        setHasPermission(true);
        setLoading(false);
      },
      (error) => {
        // More detailed error message
        console.error("Geolocation Error:", error.code, error.message);
        setPermissionDenied(true);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // --- Audio Handlers (Enhanced) ---

  const setupAudioListeners = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => setAudioState(p => ({ ...p, isPlaying: true, error: null }));
    const onPause = () => setAudioState(p => ({ ...p, isPlaying: false }));
    const onTimeUpdate = () => setAudioState(p => ({ ...p, currentTime: audio.currentTime }));
    const onLoadedMetadata = () => setAudioState(p => ({ ...p, duration: audio.duration, isLoading: false, error: null }));
    const onEnded = () => setAudioState(p => ({ ...p, isPlaying: false, currentAudioId: null, currentTime: 0 }));
    const onWaiting = () => setAudioState(p => ({ ...p, isLoading: true }));
    const onPlaying = () => setAudioState(p => ({ ...p, isLoading: false }));
    const onError = (e) => {
      console.error("Audio Error:", e);
      setAudioState(p => ({ 
        ...p, 
        isLoading: false, 
        isPlaying: false, 
        error: "Failed to load audio. Check network or file path." 
      }));
    };

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('error', onError);
    };
  }, []);

  useEffect(() => {
    const cleanup = setupAudioListeners();
    return cleanup;
  }, [setupAudioListeners]);


  const toggleAudio = (site) => {
    const lang = languageSelection[site.id] || "en";
    const audioSrc = site.audioPaths[lang];
    if (!audioSrc) {
      setAudioState(p => ({ ...p, error: `No audio path found for ${lang}.` }));
      return;
    }

    if (audioState.currentAudioId === site.id) {
      // Pause or Stop
      if (audioState.isPlaying) {
        audioRef.current.pause();
        setAudioState(p => ({ ...p, isPlaying: false }));
      } else {
        // Resume
        audioRef.current.play();
        setAudioState(p => ({ ...p, isPlaying: true, isLoading: true }));
      }
    } else {
      // New track
      if (audioRef.current) {
        audioRef.current.pause(); // Pause any currently playing track
        audioRef.current.src = audioSrc;
        audioRef.current.load(); // Ensure new source is loaded
      }
      
      setAudioState(p => ({ 
        ...p, 
        currentAudioId: site.id, 
        isLoading: true, 
        isPlaying: false, 
        currentTime: 0, 
        error: null 
      }));

      // Play after state update and source set
      audioRef.current.play().catch(e => {
        console.error("Play failed:", e);
        setAudioState(p => ({ 
          ...p, 
          isLoading: false, 
          currentAudioId: null, 
          error: "Autoplay blocked or network issue." 
        }));
      });
    }
  };

  const handleLanguageChange = (siteId, lang) => {
    setLanguageSelection({ ...languageSelection, [siteId]: lang });
    const site = nearbySites.find((s) => s.id === siteId);
    
    // If the site is currently playing, switch the source and resume playback
    if (audioState.currentAudioId === siteId && site.audioPaths[lang]) {
      const audioSrc = site.audioPaths[lang];
      audioRef.current.src = audioSrc;
      audioRef.current.load();
      audioRef.current.play().catch(e => console.error("Language switch play failed:", e));
      setAudioState(p => ({ ...p, isLoading: true, error: null }));
    }
  };

  const handleDownload = (siteId) => {
    // Simulated download logic
    console.log(`Simulating download for site: ${siteId}`);
    // In a real app, you'd fetch the audio file and save it to local storage/IndexedDB
    
    // Temporary UI feedback (simulated)
    // You would typically use a dedicated state for download progress per item
    alert(`Downloading ${nearbySites.find(s => s.id === siteId)?.name}... (This is a simulation)`);
  };

  const generateNavigationUrl = (lat, lng) => {
    // Generates a Google Maps URL for navigation
    if (location) {
        return `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${lat},${lng}&travelmode=walking`;
    }
    // Fallback to just the destination if user location is unknown
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  };

  // --- Render Functions ---

  const renderAudioControls = (site) => {
    const isCurrentlyPlayingSite = audioState.currentAudioId === site.id;
    const isPlaying = isCurrentlyPlayingSite && audioState.isPlaying;
    const isLoading = isCurrentlyPlayingSite && audioState.isLoading;
    const error = isCurrentlyPlayingSite && audioState.error;
    const currentTime = isCurrentlyPlayingSite ? audioState.currentTime : 0;
    const duration = site.audioDuration; // Use the fixed duration from site data for display

    return (
      <div className="mt-2 pt-2 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          {site.audioAvailable && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-heritage-gold" />
              <select
                value={languageSelection[site.id] || "en"}
                onChange={(e) => handleLanguageChange(site.id, e.target.value)}
                className="text-xs bg-white rounded px-1 py-0.5 border border-gray-300 shadow-sm"
              >
                {Object.keys(site.audioPaths).map(langCode => (
                    <option key={langCode} value={langCode}>
                        {langCode === 'en' ? 'English' : langCode === 'hi' ? 'Hindi' : langCode}
                    </option>
                ))}
              </select>
              <Badge variant="outline" className="text-xs border-none text-muted-foreground">
                {formatTime(site.audioDuration)} Total
              </Badge>
            </div>
          )}

          <Button
            size="sm"
            className="bg-heritage-gold hover:bg-heritage-gold/80 text-white transition-colors h-8"
            onClick={() => toggleAudio(site)}
            disabled={isLoading || !site.audioAvailable}
          >
            {isLoading ? (
              <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Loading</>
            ) : isPlaying ? (
              <><Pause className="h-4 w-4 mr-1" /> Pause</>
            ) : (
              <><Play className="h-4 w-4 mr-1" /> Play Audio</>
            )}
          </Button>
        </div>

        {isCurrentlyPlayingSite && (
          <>
            <div className="flex items-center text-xs text-muted-foreground mb-1">
              <span>{formatTime(currentTime)}</span>
              <Progress 
                value={(currentTime / duration) * 100} 
                className="h-1 mx-2"
              /> 
              <span>{formatTime(duration)}</span>
            </div>
            {error && (
              <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
                <XCircle className="h-3 w-3" /> {error}
              </p>
            )}
          </>
        )}

        <div className="flex justify-end gap-2 mt-3">
            {/* Download Button */}
            <Button
                size="sm"
                variant="outline"
                className={`text-xs h-7 ${site.downloaded ? 'border-green-500 text-green-500' : 'border-gray-400 text-gray-700'}`}
                onClick={() => handleDownload(site.id)}
                disabled={site.downloaded}
            >
                {site.downloaded ? (
                    <><CheckCircle className="h-3 w-3 mr-1" /> Downloaded</>
                ) : (
                    <><Download className="h-3 w-3 mr-1" /> Download</>
                )}
            </Button>
            
            {/* Navigation Button */}
            <a 
                href={generateNavigationUrl(site.coords.lat, site.coords.lng)} 
                target="_blank" 
                rel="noopener noreferrer"
            >
                <Button 
                    size="sm" 
                    className="bg-heritage-burgundy hover:bg-heritage-burgundy/80 text-white text-xs h-7"
                >
                    <Globe className="h-3 w-3 mr-1" /> Navigate
                </Button>
            </a>
        </div>
      </div>
    );
  };

  const renderSiteCard = (site, index) => {
    let distanceDisplay = site.distance;
    if (location) {
      const dist = getDistance(location.lat, location.lng, site.coords.lat, site.coords.lng);
      distanceDisplay = dist < 1000 ? `${Math.round(dist)}m` : `${(dist / 1000).toFixed(1)} km`;
    }
    const SiteIcon = SiteIconMap[site.type] || MapPin;

    return (
      <Card key={index} className="shadow-lg hover:shadow-2xl transition-shadow border-t-4 border-heritage-gold">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl text-heritage-burgundy flex items-center gap-2">
                <SiteIcon className="h-5 w-5 text-heritage-gold" />
                {site.name}
              </CardTitle>
              <div className="flex items-center gap-3 mt-2">
                <Badge variant="default" className="bg-heritage-stone-light text-heritage-burgundy font-semibold">
                  <NavigationIcon className="h-3 w-3 mr-1" /> {distanceDisplay}
                </Badge>
                <Badge variant="outline" className="border-heritage-gold text-heritage-burgundy">
                  {site.type}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 text-sm mb-2">{site.description}</p>
          
          {/* Render enhanced Audio/Download/Navigation Controls */}
          {site.audioAvailable && renderAudioControls(site)}

        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 font-sans">
      <audio ref={audioRef} />

      {/* Header */}
      <div className="bg-gradient-to-r from-heritage-burgundy to-heritage-gold text-white p-6 shadow-xl sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-white/20 rounded-xl">
            <Headphones className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Heritage Audio Guide</h1>
            {loading ? (
              <p className="flex items-center gap-2 text-white/90 text-sm">
                <Loader2 className="h-4 w-4 animate-spin" /> Detecting your location...
              </p>
            ) : permissionDenied ? (
              <p className="text-red-200 font-medium text-sm">Location access denied. Please enable GPS in your browser settings.</p>
            ) : !hasPermission ? (
              <p className="text-white/90 text-sm">Grant location access to activate the guide.</p>
            ) : (
              <p className="text-white/90 text-sm font-medium">
                <CheckCircle className="h-4 w-4 inline mr-1" /> GPS Active - Showing {nearbySites.length} sites.
              </p>
            )}
          </div>
        </div>

        {!hasPermission && !loading && !permissionDenied && (
          <Button onClick={requestLocation} className="mt-2 bg-white text-heritage-burgundy hover:bg-gray-100 font-bold shadow-md">
            <MapPin className="h-4 w-4 mr-2" /> Activate Location Guide
          </Button>
        )}

        {hasPermission && location && (
          <div className="mt-4 p-3 bg-white/10 rounded-lg text-sm">
            <p className="flex items-center gap-2 text-white font-medium">
              <NavigationIcon className="h-4 w-4" />
              <span>Current Position: **Lat: {location.lat.toFixed(4)}, Lng: {location.lng.toFixed(4)}**</span>
            </p>
            <p className="text-xs text-white/80 mt-1">Accuracy: ~{Math.round(location.accuracy)} meters (Real-time updates)</p>
          </div>
        )}
      </div>

      {/* Nearby Sites List */}
      {hasPermission && (
        <div className="px-4 space-y-5 mt-6">
          <h2 className="text-2xl font-bold text-heritage-burgundy border-b-2 border-heritage-gold pb-2">
            Points of Interest
          </h2>

          {nearbySites.map((site, index) => renderSiteCard(site, index))}
          
        </div>
      )}
    </div>
  );
};

export default LocationGuide;