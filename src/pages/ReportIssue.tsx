import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Camera, MapPin, Mic, Upload, Shield, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { useReports } from "@/hooks/useReports";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type ReportCategory = Database['public']['Enums']['report_category'];
type ReportPriority = Database['public']['Enums']['report_priority'];

export default function ReportIssue() {
  const navigate = useNavigate();
  const { createReport } = useReports();
  const { toast } = useToast();
  
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [priority, setPriority] = useState<ReportPriority>("medium");
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [locationAddress, setLocationAddress] = useState("123 Main St, Downtown Area");
  const [submitting, setSubmitting] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);

  const uploadMediaFiles = async () => {
    if (mediaFiles.length === 0) return [];
    
    const uploadedUrls: string[] = [];
    
    for (const file of mediaFiles) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('report-media')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('report-media')
        .getPublicUrl(filePath);

      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Flexible validation - only require title OR category OR description (at least one field)
    if (!title.trim() && !category && !description.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide at least a title, category, or description",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Upload media files first
      const mediaUrls = await uploadMediaFiles();
      
      const reportData = {
        title: title.trim() || "Untitled Report",
        description: description.trim() || "No description provided",
        category: category || "other" as ReportCategory,
        priority,
        location_address: locationAddress,
        is_anonymous: isAnonymous,
        media_urls: mediaUrls.length > 0 ? mediaUrls : undefined
      };

      const { data, error } = await createReport(reportData);
      
      if (!error && data) {
        toast({
          title: "Success",
          description: "Report submitted successfully!",
        });
        navigate("/feed");
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    }
    
    setSubmitting(false);
  };

  const handleMediaUpload = async (type: 'photo' | 'video' | 'audio') => {
    const input = type === 'photo' ? photoInputRef.current : 
                  type === 'video' ? videoInputRef.current : audioInputRef.current;
    
    if (input) {
      input.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: string) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadingMedia(true);
    
    try {
      setMediaFiles(prev => [...prev, ...files]);
      toast({
        title: "Media Added",
        description: `${files.length} ${fileType} file(s) added successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add media files",
        variant: "destructive",
      });
    }
    
    setUploadingMedia(false);
    
    // Reset input
    e.target.value = '';
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const saveDraft = async () => {
    toast({
      title: "Draft Saved",
      description: "Your report has been saved as a draft",
    });
  };
  
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
            <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-3">
              <Label htmlFor="title" className="text-base font-semibold">Issue Title (Optional)</Label>
              <Input
                id="title"
                type="text"
                placeholder="Brief, clear title (e.g., 'Large pothole on 5th Street')"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Photo Upload */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Add Photo / Video / Voice</Label>
              <p className="text-sm text-muted-foreground">
                Add media files to support your report (optional).
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  className="h-24 flex-col space-y-2 hover:shadow-button transition-all"
                  onClick={() => handleMediaUpload('photo')}
                  disabled={uploadingMedia}
                >
                  <Camera className="w-6 h-6" />
                  <span className="text-sm">Take Photo</span>
                </Button>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="h-24 flex-col space-y-2 hover:shadow-button transition-all"
                  onClick={() => handleMediaUpload('video')}
                  disabled={uploadingMedia}
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-sm">Upload Video</span>
                </Button>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="h-24 flex-col space-y-2 hover:shadow-button transition-all"
                  onClick={() => handleMediaUpload('audio')}
                  disabled={uploadingMedia}
                >
                  <Mic className="w-6 h-6" />
                  <span className="text-sm">Voice Note</span>
                </Button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={(e) => handleFileChange(e, 'photo')}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                multiple
                className="hidden"
                onChange={(e) => handleFileChange(e, 'video')}
              />
              <input
                ref={audioInputRef}
                type="file"
                accept="audio/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileChange(e, 'audio')}
              />

              {/* Show uploaded files */}
              {mediaFiles.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Uploaded Files:</Label>
                  <div className="space-y-2">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded-md">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMediaFile(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="space-y-3">
              <Label className="text-base font-semibold">Location</Label>
              <div className="flex space-x-2">
                <Button type="button" variant="outline" className="flex-1 justify-start">
                  <MapPin className="w-4 h-4 mr-2 text-accent" />
                  Auto-detected Location
                </Button>
                <Button type="button" variant="ghost" size="sm">
                  Edit
                </Button>
              </div>
              <Input
                type="text"
                value={locationAddress}
                onChange={(e) => setLocationAddress(e.target.value)}
                placeholder="Enter location address"
                className="text-sm"
              />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <Label htmlFor="category" className="text-base font-semibold">Issue Category (Optional)</Label>
              <Select value={category} onValueChange={(value) => setCategory(value as ReportCategory)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category (will auto-detect from media)" />
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
              <Label htmlFor="description" className="text-base font-semibold">Describe the Problem (Optional)</Label>
              <p className="text-sm text-muted-foreground">
                Add description now or later after uploading media.
              </p>
              <Textarea 
                id="description"
                placeholder="Example: Large pothole on 5th lane near the market. It's been there for 2 weeks and getting worse with rain..."
                className="min-h-[120px]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
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
              <Button 
                type="submit" 
                className="flex-1 shadow-button" 
                size="lg"
                disabled={submitting}
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={saveDraft}>
                Save Draft
              </Button>
            </div>
            </form>

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