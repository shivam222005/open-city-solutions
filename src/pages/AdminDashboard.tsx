import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Filter, 
  Search, 
  Download, 
  Bell, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Clock,
  AlertCircle,
  MapPin,
  Calendar,
  User,
  MessageSquare
} from "lucide-react";
import { useState } from "react";

// Mock data for admin dashboard
const mockReports = [
  {
    id: "R-001234",
    title: "Large pothole on 5th Street",
    category: "Road/Infrastructure",
    status: "submitted",
    priority: "high",
    submittedAt: "2025-09-16 14:30",
    location: "5th Street, Downtown",
    department: "Public Works",
    assignee: null,
    description: "Huge pothole near the market that's getting worse with rain."
  },
  {
    id: "R-001235", 
    title: "Broken streetlight creating safety hazard",
    category: "Electrical/Lighting",
    status: "acknowledged",
    priority: "medium",
    submittedAt: "2025-09-16 10:15",
    location: "Park Avenue & 3rd St",
    department: "Electrical Dept",
    assignee: "John Smith",
    description: "Streetlight has been out for over a week."
  },
  {
    id: "R-001236",
    title: "Overflowing garbage bins",
    category: "Sanitation",
    status: "in_progress", 
    priority: "medium",
    submittedAt: "2025-09-15 16:45",
    location: "Central Plaza",
    department: "Sanitation",
    assignee: "Maria Garcia",
    description: "Bins haven't been emptied in days."
  }
];

const statusConfig = {
  submitted: { label: "Submitted", color: "bg-status-submitted text-yellow-800", icon: Clock },
  acknowledged: { label: "Acknowledged", color: "bg-status-acknowledged text-blue-800", icon: Bell },
  in_progress: { label: "In Progress", color: "bg-status-progress text-purple-800", icon: TrendingUp },
  resolved: { label: "Resolved", color: "bg-status-resolved text-green-800", icon: CheckCircle }
};

export default function AdminDashboard() {
  const [selectedReport, setSelectedReport] = useState(mockReports[0]);
  const [filter, setFilter] = useState("all");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted-foreground">Municipal Issue Management System</p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="outline" size="sm">
                <TrendingUp className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reports</p>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-xs text-accent">+12% from last month</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                  <p className="text-2xl font-bold text-warning">23</p>
                  <p className="text-xs text-muted-foreground">Need assignment</p>
                </div>
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold text-primary">156</p>
                  <p className="text-xs text-muted-foreground">Being worked on</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                  <p className="text-2xl font-bold text-accent">3.2 days</p>
                  <p className="text-xs text-accent">-0.5 days from last month</p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Reports List */}
          <div className="lg:col-span-2">
            <Card className="shadow-civic">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Incoming Reports</CardTitle>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input placeholder="Search reports..." className="pl-10 w-64" />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                {/* Quick Filters */}
                <div className="flex space-x-2 pt-2">
                  <Button 
                    variant={filter === "all" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("all")}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filter === "urgent" ? "destructive" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("urgent")}
                  >
                    High Priority
                  </Button>
                  <Button 
                    variant={filter === "unassigned" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("unassigned")}
                  >
                    Unassigned
                  </Button>
                  <Button 
                    variant={filter === "today" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setFilter("today")}
                  >
                    Today
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="divide-y">
                  {mockReports.map((report) => {
                    const StatusIcon = statusConfig[report.status as keyof typeof statusConfig].icon;
                    return (
                      <div 
                        key={report.id}
                        className={`p-4 cursor-pointer hover:bg-secondary/50 transition-colors ${
                          selectedReport.id === report.id ? 'bg-primary/5 border-r-2 border-r-primary' : ''
                        }`}
                        onClick={() => setSelectedReport(report)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-sm font-mono text-muted-foreground">{report.id}</span>
                              {report.priority === "high" && (
                                <Badge variant="destructive" className="text-xs">High Priority</Badge>
                              )}
                              <Badge className={`text-xs ${statusConfig[report.status as keyof typeof statusConfig].color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {statusConfig[report.status as keyof typeof statusConfig].label}
                              </Badge>
                            </div>
                            
                            <h3 className="font-semibold text-sm mb-1">{report.title}</h3>
                            <p className="text-xs text-muted-foreground mb-2">{report.description}</p>
                            
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{report.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Calendar className="w-3 h-3" />
                                <span>{report.submittedAt}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="text-right text-xs">
                            <p className="text-muted-foreground mb-1">{report.department}</p>
                            {report.assignee && (
                              <p className="font-medium text-primary">{report.assignee}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Report Details */}
          <div>
            <Card className="shadow-civic">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Report Details</span>
                  <span className="text-sm font-mono text-muted-foreground">{selectedReport.id}</span>
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-2">{selectedReport.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedReport.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium">{selectedReport.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Priority:</span>
                      <Badge 
                        variant={selectedReport.priority === "high" ? "destructive" : "secondary"}
                        className="text-xs"
                      >
                        {selectedReport.priority}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="font-medium text-right">{selectedReport.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Submitted:</span>
                      <span className="font-medium">{selectedReport.submittedAt}</span>
                    </div>
                  </div>
                </div>

                {/* Assignment */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Assignment</h4>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Department</label>
                    <Select defaultValue={selectedReport.department}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Public Works">Public Works</SelectItem>
                        <SelectItem value="Electrical Dept">Electrical Department</SelectItem>
                        <SelectItem value="Sanitation">Sanitation</SelectItem>
                        <SelectItem value="Water Management">Water Management</SelectItem>
                        <SelectItem value="Traffic Control">Traffic Control</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Assign to</label>
                    <Select defaultValue={selectedReport.assignee || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select assignee" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="john">John Smith</SelectItem>
                        <SelectItem value="maria">Maria Garcia</SelectItem>
                        <SelectItem value="david">David Wilson</SelectItem>
                        <SelectItem value="sarah">Sarah Chen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Update Status</h4>
                  
                  <Select defaultValue={selectedReport.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Internal Note */}
                <div className="space-y-3">
                  <h4 className="font-semibold">Add Internal Note</h4>
                  <Textarea 
                    placeholder="Add notes for internal team coordination..."
                    className="min-h-[80px]"
                  />
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button className="flex-1 shadow-button">
                    Update Report
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Citizen
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}