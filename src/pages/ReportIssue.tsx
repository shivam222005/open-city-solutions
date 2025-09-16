import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Camera, MapPin, Mic, Upload, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function ReportIssue() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [priority, setPriority] = useState("medium");
  
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold text-foreground">New Report</h1>
          </div>
          <Badge variant="secondary">Auto-save enabled</Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-civic">
          <CardHeader>
            <CardTitle className="text-2xl">Report a Civic Issue</CardTitle>
            <p className="text-muted-foreground">
              Take a clear photo, describe the problem, and we'll route it to the right department.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Add Photo / Video / Voice</Label>
              <p className="text-sm text-muted-foreground">
                Take a clear photo — show the whole area.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button variant="outline" className="h-24 flex-col space-y-2 hover:shadow-button transition-all">
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Take Photo</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col space-y-2 hover:shadow-button transition-all">
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Upload Video</span>
                </Button>
                
                <Button variant="outline" className="h-24 flex-col space-y-2 hover:shadow-button transition-all">
                  <Mic className="w-6 h-6" />
                  <span className="text-sm">Voice Note (60s)</span>
                </Button>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Location</Label>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex-1 justify-start">
                  <MapPin className="w-4 h-4 mr-2 text-accent" />
                  Auto-detected Location
                </Button>
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                📍 123 Main St, Downtown Area
              </p>
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-semibold">Issue Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pothole">🕳️ Pothole / Road Damage</SelectItem>
                  <SelectItem value="streetlight">💡 Streetlight / Electrical</SelectItem>
                  <SelectItem value="sanitation">🗑️ Sanitation / Waste</SelectItem>
                  <SelectItem value="water">💧 Water / Drainage</SelectItem>
                  <SelectItem value="traffic">🚦 Traffic / Parking</SelectItem>
                  <SelectItem value="safety">⚠️ Safety / Security</SelectItem>
                  <SelectItem value="corruption">🚨 Corruption / Misconduct</SelectItem>
                  <SelectItem value="other">📝 Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <Label htmlFor="description" className="text-base font-semibold">Describe the Problem</Label>
              <p className="text-sm text-muted-foreground">
                Add a short description: what, where, when.
              </p>
              <Textarea 
                id="description"
                placeholder="Example: Large pothole on 5th lane near the market. It's been there for 2 weeks and getting worse with rain..."
                className="min-h-[120px]"
              />
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Priority Level</Label>
              <p className="text-sm text-muted-foreground">
                If this is dangerous or urgent, mark 'High Priority'.
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant={priority === "low" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setPriority("low")}
                >
                  Low
                </Button>
                <Button 
                  variant={priority === "medium" ? "default" : "outline"} 
                  size="sm"
                  onClick={() => setPriority("medium")}
                >
                  Medium
                </Button>
                <Button 
                  variant={priority === "high" ? "destructive" : "outline"} 
                  size="sm"
                  onClick={() => setPriority("high")}
                >
                  High Priority
                </Button>
              </div>
            </div>

            {/* Anonymous Toggle */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <Label htmlFor="anonymous" className="font-semibold">Submit Anonymously</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Your identity will be protected. Recommended for corruption reports.
                </p>
              </div>
              <Switch 
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={setIsAnonymous}
              />
            </div>

            {/* Auto-routing Info */}
            <div className="bg-secondary/50 p-4 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs text-primary-foreground font-bold">AI</span>
                </div>
                <div>
                  <p className="font-semibold text-sm">Auto-Routed Department</p>
                  <p className="text-sm text-muted-foreground">
                    Based on your category and location, this will be sent to: <strong>Public Works Department</strong>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Expected response time: 24-48 hours
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-3 pt-4">
              <Button className="flex-1 shadow-button" size="lg">
                Submit Report
              </Button>
              <Button variant="outline" size="lg">
                Save Draft
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to our community guidelines. 
              False reports may result in account suspension.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}