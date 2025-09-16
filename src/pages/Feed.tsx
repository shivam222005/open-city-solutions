import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MapPin, Clock, ArrowLeft, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

// Mock data for demonstration
const mockReports = [
  {
    id: 1,
    user: { name: "Sarah Chen", avatar: null, isAnonymous: false },
    timeAgo: "2 hours ago",
    title: "Large pothole on 5th Street",
    description: "Huge pothole near the market that's getting worse with rain. Multiple cars have hit it today.",
    category: "pothole",
    location: "5th Street, Downtown",
    status: "acknowledged",
    priority: "high",
    likes: 24,
    comments: 8,
    media: [{ type: "image", url: "/api/placeholder/400/300" }]
  },
  {
    id: 2,
    user: { name: "Anonymous", avatar: null, isAnonymous: true },
    timeAgo: "4 hours ago", 
    title: "Broken streetlight creating safety hazard",
    description: "Streetlight has been out for over a week. Very dark at night, making it unsafe for pedestrians.",
    category: "streetlight",
    location: "Park Avenue & 3rd St",
    status: "in_progress",
    priority: "medium",
    likes: 15,
    comments: 3,
    media: [{ type: "image", url: "/api/placeholder/400/300" }]
  },
  {
    id: 3,
    user: { name: "Mike Rodriguez", avatar: null, isAnonymous: false },
    timeAgo: "1 day ago",
    title: "Overflowing garbage bins",
    description: "Bins haven't been emptied in days. Attracting rats and creating smell.",
    category: "sanitation", 
    location: "Central Plaza",
    status: "resolved",
    priority: "medium",
    likes: 31,
    comments: 12,
    media: [{ type: "image", url: "/api/placeholder/400/300" }]
  }
];

const statusConfig = {
  submitted: { label: "Submitted", color: "bg-status-submitted", textColor: "text-yellow-800" },
  acknowledged: { label: "Acknowledged", color: "bg-status-acknowledged", textColor: "text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-status-progress", textColor: "text-purple-800" },
  resolved: { label: "Resolved", color: "bg-status-resolved", textColor: "text-green-800" }
};

const categoryEmojis = {
  pothole: "🕳️",
  streetlight: "💡",
  sanitation: "🗑️",
  water: "💧",
  traffic: "🚦",
  safety: "⚠️",
  corruption: "🚨"
};

export default function Feed() {
  const [filter, setFilter] = useState("all");
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" asChild className="md:hidden">
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>
              <h1 className="text-xl font-bold text-foreground">Community Feed</h1>
              <Badge variant="secondary">1,247 reports</Badge>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button size="sm" asChild className="shadow-button">
                <Link to="/report">
                  <Plus className="w-4 h-4 mr-2" />
                  Report
                </Link>
              </Button>
            </div>
          </div>
          
          {/* Quick filters */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            <Button 
              variant={filter === "all" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Issues
            </Button>
            <Button 
              variant={filter === "today" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("today")}
            >
              Reported Today
            </Button>
            <Button 
              variant={filter === "urgent" ? "destructive" : "outline"} 
              size="sm"
              onClick={() => setFilter("urgent")}
            >
              High Priority
            </Button>
            <Button 
              variant={filter === "resolved" ? "default" : "outline"} 
              size="sm"
              onClick={() => setFilter("resolved")}
            >
              Recently Resolved
            </Button>
          </div>
        </div>
      </header>

      {/* Feed */}
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="space-y-6">
          {mockReports.map((report) => (
            <Card key={report.id} className="shadow-card hover:shadow-civic transition-all duration-300">
              <CardContent className="p-0">
                {/* Header */}
                <div className="p-4 pb-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={report.user.avatar} />
                        <AvatarFallback className={report.user.isAnonymous ? "bg-muted" : "bg-primary text-primary-foreground"}>
                          {report.user.isAnonymous ? "?" : report.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm">{report.user.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{report.timeAgo}</span>
                          {report.priority === "high" && (
                            <Badge variant="destructive" className="text-xs px-1.5 py-0">High Priority</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <Badge 
                      className={`${statusConfig[report.status as keyof typeof statusConfig].color} ${statusConfig[report.status as keyof typeof statusConfig].textColor} border-0`}
                    >
                      {statusConfig[report.status as keyof typeof statusConfig].label}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 py-3">
                  <div className="flex items-start space-x-2 mb-2">
                    <span className="text-lg">{categoryEmojis[report.category as keyof typeof categoryEmojis]}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{report.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-2">
                    <MapPin className="w-3 h-3" />
                    <span>{report.location}</span>
                  </div>
                </div>

                {/* Media */}
                {report.media.length > 0 && (
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    <img 
                      src={report.media[0].url} 
                      alt="Report media"
                      className="w-full h-full object-cover"
                    />
                    {report.media.length > 1 && (
                      <Badge className="absolute top-2 right-2 bg-black/50 text-white border-0">
                        +{report.media.length - 1} more
                      </Badge>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="p-4 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                        <Heart className="w-4 h-4 mr-1" />
                        <span className="text-sm">{report.likes}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        <span className="text-sm">{report.comments}</span>
                      </Button>
                      
                      <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                        <Share className="w-4 h-4 mr-1" />
                        <span className="text-sm">Share</span>
                      </Button>
                    </div>
                    
                    <Button variant="outline" size="sm">
                      Track
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center py-8">
          <Button variant="outline" className="px-8">
            Load More Reports
          </Button>
        </div>
      </div>
    </div>
  );
}