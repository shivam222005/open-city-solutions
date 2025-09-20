import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MapPin, Clock, ArrowLeft, Filter, Plus, MoreHorizontal, Bookmark } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
import samplePothole from "@/assets/sample-pothole.jpg";
import sampleStreetlight from "@/assets/sample-streetlight.jpg";
import sampleSanitation from "@/assets/sample-sanitation.jpg";
import sampleWater from "@/assets/sample-water.jpg";

type ReportWithProfile = Database['public']['Tables']['reports']['Row'] & {
  profiles: any;
  likes?: number;
  comments?: number;
  userHasLiked?: boolean;
};

// Sample data for Instagram-style feed
const sampleReports: ReportWithProfile[] = [
  {
    id: "sample-1",
    title: "Major Pothole on Main Street",
    description: "Deep pothole causing damage to vehicles. Has been here for weeks and getting worse with recent rain.",
    category: "pothole",
    priority: "high",
    status: "submitted",
    location_address: "Main Street, Downtown",
    latitude: null,
    longitude: null,
    is_anonymous: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: null,
    user_id: "user-1",
    assignee_id: null,
    department: null,
    internal_notes: null,
    media_urls: [samplePothole],
    profiles: { display_name: "Sarah Johnson" },
    likes: 24,
    comments: 8,
    userHasLiked: false
  },
  {
    id: "sample-2", 
    title: "Broken Streetlight - Safety Concern",
    description: "Streetlight has been out for over a week, making this area very dark and unsafe at night.",
    category: "streetlight",
    priority: "high",
    status: "acknowledged",
    location_address: "Oak Avenue & 5th Street",
    latitude: null,
    longitude: null,
    is_anonymous: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: null,
    user_id: "user-2",
    assignee_id: null,
    department: "Public Works",
    internal_notes: null,
    media_urls: [sampleStreetlight],
    profiles: { display_name: "Mike Chen" },
    likes: 31,
    comments: 12,
    userHasLiked: true
  },
  {
    id: "sample-3",
    title: "Trash Overflow at Park Entrance", 
    description: "Garbage bins are overflowing and trash is scattered around the park entrance. Very unsanitary.",
    category: "sanitation",
    priority: "medium",
    status: "in_progress",
    location_address: "Central Park Main Entrance",
    latitude: null,
    longitude: null,
    is_anonymous: false,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: null,
    user_id: "user-3",
    assignee_id: null,
    department: "Sanitation",
    internal_notes: null,
    media_urls: [sampleSanitation],
    profiles: { display_name: "Lisa Park" },
    likes: 18,
    comments: 5,
    userHasLiked: false
  },
  {
    id: "sample-4",
    title: "Water Pipe Leak on Elm Street",
    description: "Large water leak from underground pipe. Water is flooding the sidewalk and street.",
    category: "water",
    priority: "high",
    status: "resolved",
    location_address: "Elm Street near Bus Stop",
    latitude: null,
    longitude: null,
    is_anonymous: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    resolved_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    user_id: "user-4",
    assignee_id: null,
    department: "Water Department",
    internal_notes: null,
    media_urls: [sampleWater],
    profiles: { display_name: "David Wilson" },
    likes: 42,
    comments: 15,
    userHasLiked: true
  }
];

const statusConfig = {
  submitted: { label: "Submitted", color: "bg-status-submitted", textColor: "text-yellow-800" },
  acknowledged: { label: "Acknowledged", color: "bg-status-acknowledged", textColor: "text-blue-800" },
  in_progress: { label: "In Progress", color: "bg-status-progress", textColor: "text-purple-800" },
  resolved: { label: "Resolved", color: "bg-status-resolved", textColor: "text-green-800" },
  closed: { label: "Closed", color: "bg-muted", textColor: "text-muted-foreground" }
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
  const [reports, setReports] = useState<ReportWithProfile[]>(sampleReports);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
    
    // Set up real-time subscription for new reports
    const channel = supabase
      .channel('schema-db-changes')  
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reports'
        },
        () => {
          // Refresh reports when changes occur
          fetchReports();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reports')
        .select(`
          *,
          profiles!left (
            display_name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Merge real data with sample data for demo
      const realReports = (data as any || []).map((report: any) => ({
        ...report,
        likes: Math.floor(Math.random() * 50),
        comments: Math.floor(Math.random() * 20),
        userHasLiked: Math.random() > 0.5
      }));
      
      setReports([...sampleReports, ...realReports]);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    return `${Math.floor(diffInHours / 24)} days ago`;
  };

  const getUserDisplayName = (report: ReportWithProfile) => {
    if (report.is_anonymous) return "Anonymous";
    return report.profiles?.display_name || "Unknown User";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg animate-pulse mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }
  
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
              <Badge variant="secondary">{reports.length} posts</Badge>
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
          {reports.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No reports yet.</p>
                <Button asChild>
                  <Link to="/report">Submit the First Report</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            reports.map((report) => (
              <Card key={report.id} className="shadow-card hover:shadow-civic transition-all duration-300 overflow-hidden">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-4 pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-9 h-9">
                          <AvatarFallback className={report.is_anonymous ? "bg-muted" : "bg-primary text-primary-foreground"}>
                            {report.is_anonymous ? "?" : getUserDisplayName(report).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="font-semibold text-sm">{getUserDisplayName(report)}</p>
                            <Badge 
                              className={`${statusConfig[report.status as keyof typeof statusConfig].color} ${statusConfig[report.status as keyof typeof statusConfig].textColor} border-0 text-xs px-1.5 py-0`}
                            >
                              {statusConfig[report.status as keyof typeof statusConfig].label}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span>{report.location_address}</span>
                            <span>•</span>
                            <span>{getTimeAgo(report.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Media - Instagram style */}
                  {report.media_urls && report.media_urls.length > 0 && (
                    <div className="aspect-square bg-muted relative">
                      <img 
                        src={report.media_urls[0]} 
                        alt={report.title}
                        className="w-full h-full object-cover"
                      />
                      {report.media_urls.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          +{report.media_urls.length - 1}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className={`p-0 h-auto ${report.userHasLiked ? 'text-red-500' : 'text-muted-foreground hover:text-red-500'}`}
                        >
                          <Heart className={`w-6 h-6 ${report.userHasLiked ? 'fill-current' : ''}`} />
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary">
                          <MessageCircle className="w-6 h-6" />
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary">
                          <Share className="w-6 h-6" />
                        </Button>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="p-0 h-auto text-muted-foreground hover:text-primary">
                        <Bookmark className="w-6 h-6" />
                      </Button>
                    </div>

                    {/* Like count */}
                    {report.likes && report.likes > 0 && (
                      <p className="font-semibold text-sm mb-2">{report.likes} likes</p>
                    )}

                    {/* Content */}
                    <div className="space-y-1">
                      <div className="flex items-start space-x-2">
                        <span className="text-sm">{categoryEmojis[report.category as keyof typeof categoryEmojis]}</span>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-semibold mr-2">{getUserDisplayName(report)}</span>
                            <span>{report.title}</span>
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{report.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Comments preview */}
                    {report.comments && report.comments > 0 && (
                      <Button variant="ghost" className="p-0 h-auto text-muted-foreground hover:text-primary text-sm mt-2">
                        View all {report.comments} comments
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}

        {/* Load More */}
        {reports.length > 0 && (
          <div className="text-center py-8">
            <Button variant="outline" className="px-8" onClick={fetchReports}>
              Refresh Reports
            </Button>
          </div>
        )}
        </div>
      </div>
    </div>
  );
}