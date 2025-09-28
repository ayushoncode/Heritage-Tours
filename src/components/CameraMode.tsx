import { useRef, useEffect, useState } from "react";
import { Camera, Scan, Info, Volume2, Download, Aperture, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import manuscriptImage from "@/assets/manuscript.jpg";

// --- Permission Request UI ---
const RequestPermission = ({ onGrant, onDeny }) => {
  return (
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
        <p className="text-xs text-muted-foreground/70 mt-4">
          Your privacy is respected. The image is only used for artifact identification.
        </p>
      </Card>
    </div>
  );
};

// --- Main Camera Component ---
const CameraMode = () => {
  const [permissionStatus, setPermissionStatus] = useState("pending");
  const [isRecognized, setIsRecognized] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const recognizedArtifact = {
    name: "Illuminated Book of Hours",
    period: "14th Century",
    confidence: "94%",
    description:
      "This exquisite Book of Hours was created circa 1380 in the monastery's scriptorium. The gold leaf illuminations depict scenes from the life of St. Benedict, patron saint of Europe.",
    audioLength: "3:45",
    details: [
      "Created by Brother Marcus of Padua",
      "Contains 156 pages of vellum",
      "Gold leaf and lapis lazuli pigments",
      "Originally belonged to a noble patron",
    ],
  };

  // --- Permission handlers ---
  const handleGrant = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setPermissionStatus("granted");
    } catch (err) {
      console.error("Camera access denied:", err);
      setPermissionStatus("denied");
    }
  };

  const handleDeny = () => {
    setPermissionStatus("denied");
  };

  // --- Capture snapshot ---
  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0);

    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageData);

    // Simulate AI recognition
    setIsCapturing(true);
    setIsRecognized(false);
    setTimeout(() => {
      setIsCapturing(false);
      setIsRecognized(true);
    }, 1500);
  };

  // --- Conditional Rendering ---
  if (permissionStatus === "pending") {
    return <RequestPermission onGrant={handleGrant} onDeny={handleDeny} />;
  }

  if (permissionStatus === "denied") {
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
      {/* Header */}
      <div className="bg-gradient-heritage text-primary-foreground p-6 shadow-heritage">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <Camera className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Camera Recognition</h1>
            <p className="text-primary-foreground/80">Point at any artifact to learn more</p>
          </div>
        </div>
      </div>

      {/* Camera View */}
      <div className="p-4">
        <Card className="mb-6 overflow-hidden shadow-soft">
          <div className="relative bg-black h-64 flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline className="w-full h-64 object-cover rounded-lg" />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute inset-4 border-2 border-dashed border-heritage-gold rounded-lg"></div>
          </div>
          <div className="p-4 text-center">
            <Button 
              onClick={handleCapture}
              disabled={isCapturing}
              className="bg-heritage-gold hover:bg-heritage-gold-light text-white shadow-gold px-8"
              size="lg"
            >
              {isCapturing ? (
                <>
                  <Aperture className="h-5 w-5 mr-2 animate-ping-slow" />
                  Processing...
                </>
              ) : (
                <>
                  <Camera className="h-5 w-5 mr-2" />
                  Capture Image
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Recognition Result */}
        {isRecognized && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-heritage-burgundy">Last Recognition</h2>
            
            <Card className="shadow-heritage">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <img 
                    src={capturedImage || manuscriptImage} 
                    alt="Recognized artifact"
                    className="w-20 h-20 object-cover rounded-lg shadow-soft"
                  />
                  <div className="flex-1">
                    <CardTitle className="text-heritage-burgundy">{recognizedArtifact.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-heritage-gold text-white">{recognizedArtifact.period}</Badge>
                      <Badge variant="outline" className="border-green-500 text-green-700">
                        {recognizedArtifact.confidence} match
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{recognizedArtifact.description}</p>
                
                {/* Audio Control */}
                <div className="bg-heritage-parchment rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-heritage-gold rounded-full">
                        <Volume2 className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-heritage-burgundy">Audio Guide Ready</p>
                        <p className="text-sm text-muted-foreground">Duration: {recognizedArtifact.audioLength}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button size="sm" className="bg-heritage-burgundy hover:bg-heritage-burgundy-light">
                        Play
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div>
                  <h4 className="font-semibold text-heritage-burgundy mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Historical Details
                  </h4>
                  <ul className="space-y-1">
                    {recognizedArtifact.details.map((detail, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="w-1 h-1 bg-heritage-gold rounded-full mt-2 flex-shrink-0"></span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraMode;
