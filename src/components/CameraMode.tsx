import { Camera, Scan, Info, Volume2, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import manuscriptImage from "@/assets/manuscript.jpg";

const CameraMode = () => {
  const recognizedArtifact = {
    name: "Illuminated Book of Hours",
    period: "14th Century",
    confidence: "94%",
    description: "This exquisite Book of Hours was created circa 1380 in the monastery's scriptorium. The gold leaf illuminations depict scenes from the life of St. Benedict, patron saint of Europe.",
    audioLength: "3:45",
    details: [
      "Created by Brother Marcus of Padua",
      "Contains 156 pages of vellum",
      "Gold leaf and lapis lazuli pigments",
      "Originally belonged to a noble patron"
    ]
  };

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

      {/* Camera Interface */}
      <div className="p-4">
        <Card className="mb-6 overflow-hidden shadow-soft">
          <div className="relative bg-gradient-to-br from-heritage-stone-light to-heritage-stone h-64 flex items-center justify-center">
            <div className="absolute inset-4 border-2 border-dashed border-heritage-gold rounded-lg"></div>
            <div className="text-center">
              <div className="p-4 bg-heritage-gold/20 rounded-full inline-block mb-3">
                <Scan className="h-8 w-8 text-heritage-gold animate-pulse" />
              </div>
              <p className="text-heritage-burgundy font-medium">Tap to capture or scan artifact</p>
              <p className="text-sm text-muted-foreground mt-1">AI will identify and provide information</p>
            </div>
          </div>
          <div className="p-4 text-center">
            <Button 
              className="bg-heritage-gold hover:bg-heritage-gold-light text-white shadow-gold px-8"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Capture Image
            </Button>
          </div>
        </Card>

        {/* Recognition Result */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-heritage-burgundy">Last Recognition</h2>
          
          <Card className="shadow-heritage">
            <CardHeader>
              <div className="flex items-start gap-4">
                <img 
                  src={manuscriptImage} 
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
      </div>
    </div>
  );
};

export default CameraMode;