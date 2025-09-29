import { useRef, useEffect, useState, useCallback } from "react";
import { 
  Camera, Info, Volume2, Download, Aperture, CheckCircle, XCircle, 
  Play, Pause, Zap, SearchX, AlertTriangle, Heart, Mic, ZoomIn, Clock 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress"; 
import { Slider } from "@/components/ui/slider"; // Assuming Slider component exists
import manuscriptImage from "@/assets/manuscript.jpg";

// --- Mock Data ---
const MOCK_ARTIFACT = {
  id: Date.now(), // Unique ID for history
  name: "Ceremonial Thangka of the Lineage Gurus",
  period: "Early 20th Century (Karma Kagyu)",
  confidence: "94%",
  description:
    "This powerful Thangka, commissioned by the 16th Karmapa, is a central piece in Rumtek's main temple. It illustrates the primary lineage holders of the Karma Kagyu school of Tibetan Buddhism.",
  audioLength: "4:15",
  details: [
    "Depicts the lineage of the Karmapas",
    "Features rich silk appliqué and gold embroidery",
    "Consecrated by His Holiness the 16th Karmapa",
    "Permanent collection of the Rumtek Monastery",
  ],
};

// --- Custom Hook for Camera Stream & Permissions ---
const useCameraStream = () => {
  const [permissionStatus, setPermissionStatus] = useState("pending");
  const [stream, setStream] = useState(null);

  const handleGrant = useCallback(async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Prefer back camera
      });
      setStream(mediaStream);
      setPermissionStatus("granted");
    } catch (err) {
      console.error("Camera access denied:", err);
      setStream(null);
      setPermissionStatus("denied");
    }
  }, []);

  const handleDeny = useCallback(() => {
    setStream(null);
    setPermissionStatus("denied");
  }, []);

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  return { permissionStatus, stream, handleGrant, handleDeny, setPermissionStatus };
};

// --- Helper Component: Permission Request UI (Omitted for brevity, assumed unchanged) ---
const RequestPermission = ({ onGrant, onDeny }) => (
  // ... (Same as previous implementation)
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gradient-subtle">
    <Card className="max-w-sm w-full p-6 shadow-2xl border-2 border-heritage-gold">
      <Aperture className="h-12 w-12 text-heritage-burgundy mx-auto mb-4" />
      <CardTitle className="text-xl font-bold mb-3 text-heritage-burgundy">Camera Access Required</CardTitle>
      <p className="text-muted-foreground mb-6">
        To use the Artifact Recognition feature, please grant access to your device's camera.
      </p>
      <div className="space-y-3">
        <Button 
          onClick={onGrant}
          className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
        >
          <CheckCircle className="h-5 w-5 mr-2" />
          Grant Camera Access
        </Button>
        <Button 
          onClick={onDeny}
          variant="ghost"
          className="w-full text-red-600 hover:bg-red-50"
        >
          <XCircle className="h-5 w-5 mr-2" />
          No, Deny Access
        </Button>
      </div>
    </Card>
  </div>
);


// --- Helper Component: Recognition Result Card (Slightly modified to use artifact prop) ---
const RecognitionResultCard = ({ artifact, capturedImage, isAudioPlaying, audioProgress, toggleAudio }) => (
  <Card className="shadow-heritage">
    <CardHeader>
      <div className="flex items-start gap-4">
        <img 
          src={capturedImage || manuscriptImage} 
          alt="Recognized artifact"
          className="w-20 h-20 object-cover rounded-lg shadow-soft"
        />
        <div className="flex-1">
          <CardTitle className="text-heritage-burgundy">{artifact.name}</CardTitle>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-heritage-gold text-white">{artifact.period}</Badge>
            <Badge variant="outline" className="border-green-500 text-green-700">
              {artifact.confidence} match
            </Badge>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600">
          <Heart className="h-5 w-5" />
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground mb-4">{artifact.description}</p>
      
      {/* Audio Control with Progress Bar */}
      <div className="bg-heritage-parchment rounded-lg p-4 mb-4 border border-heritage-gold/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-heritage-gold rounded-full">
              <Volume2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-heritage-burgundy">Audio Guide</p>
              <p className="text-sm text-muted-foreground">Duration: {artifact.audioLength}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              className="bg-heritage-burgundy hover:bg-heritage-burgundy-light"
              onClick={toggleAudio}
            >
              {isAudioPlaying ? (
                <><Pause className="h-4 w-4 mr-1" /> Stop</>
              ) : (
                <><Play className="h-4 w-4 mr-1" /> Play</>
              )}
            </Button>
          </div>
        </div>
        <Progress value={audioProgress} className="h-1.5 bg-gray-200" indicatorClassName="bg-heritage-gold" />
      </div>

      {/* Details */}
      <div>
        <h4 className="font-semibold text-heritage-burgundy mb-2 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Historical Details
        </h4>
        <ul className="space-y-1">
          {artifact.details.map((detail, index) => (
            <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
              <span className="w-1 h-1 bg-heritage-gold rounded-full mt-2 flex-shrink-0"></span>
              {detail}
            </li>
          ))}
        </ul>
      </div>
    </CardContent>
  </Card>
);

// --- Helper Component: No Match Card (Omitted for brevity, assumed unchanged) ---
const NoMatchCard = ({ onRetry }) => (
  <Card className="shadow-soft border-l-4 border-red-500">
    <CardContent className="pt-6 flex flex-col items-center text-center">
      <SearchX className="h-8 w-8 text-red-500 mb-3" />
      <h3 className="text-lg font-semibold text-red-700 mb-2">No Artifact Recognized</h3>
      <p className="text-muted-foreground mb-4 text-sm">
        We couldn't find a match in our database. Please try moving closer, adjusting the lighting, or ensuring the artifact is centered in the frame.
      </p>
      <Button 
        onClick={onRetry} 
        variant="outline"
        className="text-heritage-burgundy border-heritage-burgundy hover:bg-heritage-parchment"
      >
        <Aperture className="h-4 w-4 mr-2" />
        Capture Again
      </Button>
    </CardContent>
  </Card>
);

// --- Main Camera UI Component ---
const CameraMode = () => {
  const { permissionStatus, stream, handleGrant, handleDeny, setPermissionStatus } = useCameraStream();

  const [recognitionState, setRecognitionState] = useState("idle"); // "idle", "processing", "recognized", "no_match"
  const [capturedImage, setCapturedImage] = useState(null);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1); // New State: Zoom
  const [isListening, setIsListening] = useState(false); // New State: Voice Activation
  const [artifactHistory, setArtifactHistory] = useState([]); // New State: History

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // --- Attach stream to video and apply zoom/torch on change ---
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(console.error);

      // Apply Zoom to the video element for simulation (real hardware zoom is complex)
      videoRef.current.style.transform = `scale(${zoomLevel})`;
    }
  }, [stream, zoomLevel]);
  
  // --- Torch Control ---
  const toggleTorch = useCallback(() => {
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (track && 'torch' in track.getCapabilities()) {
      track.applyConstraints({
        advanced: [{ torch: !isTorchOn }]
      }).then(() => {
        setIsTorchOn(prev => !prev);
      }).catch(err => console.warn("Torch control failed (device/browser limitation):", err));
    } else {
      console.log("Torch capability not supported on this track.");
      setIsTorchOn(prev => !prev); // Fallback UI update
    }
  }, [stream, isTorchOn]);

  // --- Voice Activation Simulation ---
  useEffect(() => {
    let listeningTimer;
    if (isListening) {
      // Simulate listening for 3 seconds
      listeningTimer = setTimeout(() => {
        // Simulate a successful voice command like "Capture artifact"
        setIsListening(false);
        handleCapture(); 
        console.log("Voice command 'Capture Artifact' received.");
      }, 3000);
    }
    return () => clearTimeout(listeningTimer);
  }, [isListening]); // Dependency on handleCapture is implicitly handled by its stability

  // --- Audio Control & Progress Simulation (Unchanged) ---
  useEffect(() => {
    let timer;
    if (isAudioPlaying) {
      const totalDuration = 4150; 
      const startTime = Date.now();

      timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const newProgress = Math.min(100, (elapsed / totalDuration) * 100);
        setAudioProgress(newProgress);

        if (newProgress === 100) {
          clearInterval(timer);
          setIsAudioPlaying(false);
          setAudioProgress(0);
        }
      }, 100);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isAudioPlaying]);

  const toggleAudio = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      setAudioProgress(0);
    } else {
      setIsAudioPlaying(true);
    }
  };

  // --- Capture snapshot and Recognition Simulation ---
  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || recognitionState === "processing") return;

    // 1. Capture Image
    const context = canvasRef.current.getContext("2d");
    const video = videoRef.current;
    
    // Adjust canvas size for current zoom level to maintain visual consistency
    canvasRef.current.width = video.videoWidth;
    canvasRef.current.height = video.videoHeight;
    
    // Apply simulated crop/zoom effect on the canvas context before drawing
    const scale = zoomLevel;
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    
    context.clearRect(0, 0, width, height);
    context.save();
    context.translate(width / 2, height / 2);
    context.scale(scale, scale);
    context.translate(-width / 2, -height / 2);
    context.drawImage(video, 0, 0, width, height);
    context.restore();

    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageData);

    // 2. Start Processing State
    setRecognitionState("processing");
    setIsAudioPlaying(false);
    setAudioProgress(0);

    // 3. Simulate API Call/Processing Time
    setTimeout(() => {
      const isMatch = Math.random() > 0.1; // 90% chance of a match
      
      if (isMatch) {
        setRecognitionState("recognized");
        // Update History with the successful recognition
        const newArtifact = { 
          ...MOCK_ARTIFACT, 
          capturedImage, 
          capturedTime: new Date().toLocaleTimeString() 
        };
        setArtifactHistory(prev => [newArtifact, ...prev].slice(0, 5)); // Keep last 5
      } else {
        setRecognitionState("no_match");
      }
    }, 1800); // 1.8 seconds processing time
  }, [zoomLevel, recognitionState]);


  // --- Conditional Rendering for Permission Stages (Omitted for brevity, assumed unchanged) ---
  if (permissionStatus === "pending") {
    return <RequestPermission onGrant={handleGrant} onDeny={handleDeny} />;
  }

  if (permissionStatus === "denied") {
    // ... (Same as previous implementation)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-gradient-subtle">
        <XCircle className="h-12 w-12 text-red-600 mb-4" />
        <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
        <p className="text-muted-foreground mb-6">
          Camera access is required for artifact recognition. Please check your device settings or try again.
        </p>
        <Button 
          onClick={() => setPermissionStatus("pending")}
          className="bg-heritage-burgundy hover:bg-heritage-burgundy-light"
        >
          Request Access Again
        </Button>
      </div>
    );
  }

  // --- Main Camera UI ---
  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      {/* Header (Unchanged) */}
      <div className="bg-gradient-heritage text-primary-foreground p-6 shadow-heritage">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Artifact Identifier</h1>
            <p className="text-primary-foreground/80">Point at any artifact to learn more</p>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="p-4">
        <Card className="mb-6 overflow-hidden shadow-soft">
          <div className="relative bg-black h-80 flex items-center justify-center"> {/* Increased height */}
            {permissionStatus === "granted" && stream && (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-80 object-cover rounded-lg transition-transform duration-100" // Added transition
              />
            )}
            <canvas ref={canvasRef} className="hidden" />

            {/* Simulated Bounding Box / Focus Area */}
            <div className="absolute inset-4 border-2 border-dashed border-heritage-gold rounded-lg pointer-events-none">
              {recognitionState === "processing" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Aperture className="h-10 w-10 text-heritage-gold animate-spin-slow" />
                  <p className="absolute bottom-4 text-white/80 font-semibold">Analyzing...</p>
                </div>
              )}
            </div>
            
            {/* Top-Right Controls Overlay */}
            <div className="absolute top-2 right-2 flex gap-2">
              {/* Torch Button */}
              <Button 
                onClick={toggleTorch}
                variant="outline"
                size="icon"
                className={`transition-colors ${isTorchOn ? 'bg-yellow-400 text-black border-yellow-400' : 'bg-white/20 text-white hover:bg-white/40 border-white/40'}`}
              >
                <Zap className="h-4 w-4" />
              </Button>
              {/* Voice Activation Button */}
              <Button 
                onClick={() => setIsListening(prev => !prev)}
                variant="outline"
                size="icon"
                className={`transition-colors ${isListening ? 'bg-red-500 text-white border-red-500 animate-pulse-slow' : 'bg-white/20 text-white hover:bg-white/40 border-white/40'}`}
              >
                <Mic className="h-4 w-4" />
              </Button>
            </div>

            {/* Bottom-Right Zoom Slider */}
            <div className="absolute bottom-2 left-2 right-2 bg-black/50 p-2 rounded-full flex items-center gap-3 max-w-sm mx-auto">
              <ZoomIn className="h-4 w-4 text-white/80 flex-shrink-0" />
              <Slider 
                min={1} 
                max={4} 
                step={0.1} 
                value={[zoomLevel]} 
                onValueChange={([val]) => setZoomLevel(val)}
                className="flex-grow"
              />
              <span className="text-xs text-white/80 w-8 text-right">{zoomLevel.toFixed(1)}x</span>
            </div>
          </div>
          
          <div className="p-4 text-center">
            <Button 
              onClick={handleCapture}
              disabled={recognitionState === "processing" || isListening}
              className="bg-heritage-gold hover:bg-heritage-gold-light text-white shadow-gold px-8"
              size="lg"
            >
              {isListening ? (
                <>
                  <Mic className="h-5 w-5 mr-2 animate-bounce-slow" />
                  Listening...
                </>
              ) : recognitionState === "processing" ? (
                <>
                  <Aperture className="h-5 w-5 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Artifact
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Dynamic Recognition Results */}
        <h2 className="text-xl font-semibold text-heritage-burgundy mb-4">
          {recognitionState === "recognized" && "Artifact Details"}
          {recognitionState === "no_match" && "Failed Recognition"}
        </h2>
        
        {recognitionState === "recognized" && (
          <RecognitionResultCard 
            artifact={MOCK_ARTIFACT} 
            capturedImage={capturedImage} 
            isAudioPlaying={isAudioPlaying}
            audioProgress={audioProgress}
            toggleAudio={toggleAudio}
          />
        )}
        
        {recognitionState === "no_match" && (
          <NoMatchCard onRetry={handleCapture} />
        )}

        {/* --- NEW FEATURE: Artifact History --- */}
        {artifactHistory.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-heritage-burgundy mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Recognitions ({artifactHistory.length})
            </h2>
            <div className="space-y-3">
              {artifactHistory.map((artifact, index) => (
                <div key={artifact.id} className="flex items-center gap-4 bg-white p-3 rounded-lg shadow-sm border border-heritage-parchment transition-shadow hover:shadow-md">
                  <img 
                    src={artifact.capturedImage || manuscriptImage} 
                    alt={artifact.name}
                    className="w-12 h-12 object-cover rounded-md flex-shrink-0"
                  />
                  <div className="flex-grow">
                    <p className="font-medium text-sm text-heritage-burgundy truncate">{artifact.name}</p>
                    <p className="text-xs text-muted-foreground">{artifact.period}</p>
                  </div>
                  <Badge variant="secondary" className="text-xs flex-shrink-0">{artifact.capturedTime}</Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraMode;