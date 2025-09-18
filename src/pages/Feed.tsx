import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, MapPin, Clock, ArrowLeft, Filter, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useReports } from "@/hooks/useReports";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type ReportWithProfile = Database['public']['Tables']['reports']['Row'] & {
  user_display_name: string | null;
};

// Remove the mock data - we no longer need it

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
  const [reports, setReports] = useState<ReportWithProfile[]>([]);
  const [loading, setLoading] = useState(true);

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
        .from('reports_with_profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setReports(data || []);
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
    return report.user_display_name || "Unknown User";
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
              <Badge variant="secondary">{reports.length} reports</Badge>
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
              <Card key={report.id} className="shadow-card hover:shadow-civic transition-all duration-300">
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="p-4 pb-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className={report.is_anonymous ? "bg-muted" : "bg-primary text-primary-foreground"}>
                            {report.is_anonymous ? "?" : getUserDisplayName(report).charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-sm">{getUserDisplayName(report)}</p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            <span>{getTimeAgo(report.created_at)}</span>
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
                      <span>{report.location_address}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-4 pt-3 border-t">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive">
                          <Heart className="w-4 h-4 mr-1" />
                          <span className="text-sm">0</span>
                        </Button>
                        
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span className="text-sm">0</span>
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