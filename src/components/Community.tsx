import { Heart, MessageCircle, Share, Camera, Star, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const Community = () => {
  const posts = [
    {
      id: 1,
      user: { name: "Maria Santos", avatar: "MS", location: "Portugal" },
      timeAgo: "2 hours ago",
      location: "St. Benedict's Monastery",
      image: "/placeholder.svg",
      caption: "The morning light through the cloister windows was absolutely magical. The audio guide helped me understand the significance of each architectural detail.",
      likes: 24,
      comments: 7,
      rating: 5,
    },
    {
      id: 2,
      user: { name: "James Chen", avatar: "JC", location: "Singapore" },
      timeAgo: "1 day ago", 
      location: "Ancient Bell Tower",
      image: "/placeholder.svg",
      caption: "Climbed the 147 steps to the top - worth every step! The panoramic view and the sound of the original bronze bells was incredible.",
      likes: 18,
      comments: 4,
      rating: 5,
    },
    {
      id: 3,
      user: { name: "Sophie Laurent", avatar: "SL", location: "France" },
      timeAgo: "3 days ago",
      location: "Monastery Gardens",
      image: "/placeholder.svg", 
      caption: "Found peace among the medicinal herbs. The app's plant identification feature taught me so much about medieval monastery life.",
      likes: 31,
      comments: 12,
      rating: 4,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20">
      {/* Header */}
      <div className="bg-gradient-heritage text-primary-foreground p-6 shadow-heritage">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-white/20 rounded-full">
            <MessageCircle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Community</h1>
            <p className="text-primary-foreground/80">Share your heritage discoveries</p>
          </div>
        </div>
      </div>

      {/* Share Your Experience */}
      <div className="p-4">
        <Card className="mb-6 shadow-soft">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-heritage-gold text-white">YU</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-heritage-burgundy">Share your experience</p>
                <p className="text-sm text-muted-foreground">Tell others about your visit</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 border-heritage-gold text-heritage-burgundy hover:bg-heritage-gold/10">
                <Camera className="h-4 w-4 mr-2" />
                Add Photo
              </Button>
              <Button className="flex-1 bg-heritage-burgundy hover:bg-heritage-burgundy-light text-white">
                <MessageCircle className="h-4 w-4 mr-2" />
                Write Review
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Community Posts */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-heritage-burgundy">Recent Experiences</h2>
          
          {posts.map((post) => (
            <Card key={post.id} className="shadow-soft">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-heritage-gold text-white">{post.user.avatar}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-heritage-burgundy">{post.user.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{post.user.location}</span>
                          <span>•</span>
                          <span>{post.timeAgo}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: post.rating }).map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-heritage-gold text-heritage-gold" />
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 mt-2">
                      <MapPin className="h-3 w-3 text-heritage-gold" />
                      <Badge variant="outline" className="border-heritage-gold text-heritage-burgundy text-xs">
                        {post.location}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Image placeholder */}
                <div className="w-full h-48 bg-gradient-stone rounded-lg mb-4 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-heritage-stone" />
                </div>
                
                <p className="text-muted-foreground mb-4">{post.caption}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-heritage-burgundy hover:text-heritage-burgundy-light">
                      <Heart className="h-5 w-5 mr-1" />
                      {post.likes}
                    </Button>
                    <Button variant="ghost" size="sm" className="p-0 h-auto text-heritage-burgundy hover:text-heritage-burgundy-light">
                      <MessageCircle className="h-5 w-5 mr-1" />
                      {post.comments}
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="p-0 h-auto text-heritage-burgundy hover:text-heritage-burgundy-light">
                    <Share className="h-5 w-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-6">
          <Button variant="outline" className="border-heritage-stone text-heritage-burgundy hover:bg-heritage-parchment">
            Load More Stories
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Community;