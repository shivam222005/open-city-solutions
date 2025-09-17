import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, MapPin, Bell, Shield, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import heroImage from "@/assets/civic-hero.jpg";

export default function Home() {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold text-foreground">MobileAse</h1>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/feed" className="text-muted-foreground hover:text-foreground transition-colors">
              See Reports
            </Link>
            <Link to="/admin" className="text-muted-foreground hover:text-foreground transition-colors">
              Admin
            </Link>
            {!user ? (
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            ) : (
              <div className="flex items-center space-x-4">
                <span className="text-muted-foreground">Welcome, {user.user_metadata?.display_name || user.email}</span>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 bg-black/20" />
        <img 
          src={heroImage} 
          alt="Citizens reporting civic issues in modern city" 
          className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
        />
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Report a Problem —{" "}
              <span className="text-accent-foreground">Make Your City Better</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              Report potholes, streetlights, sanitation, and corruption — with photos, location, and real-time tracking. Your voice helps local government act faster.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90 shadow-button font-semibold">
                <Link to="/report">
                  <Camera className="w-5 h-5 mr-2" />
                  Report an Issue
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                <Link to="/feed">
                  <MapPin className="w-5 h-5 mr-2" />
                  See Reports Near Me
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent civic reporting that gets results
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="shadow-card hover:shadow-civic transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Report with Photos</h3>
                <p className="text-muted-foreground">
                  Take a clear photo, add location automatically, and describe the issue in seconds.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-civic transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <Bell className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Track Progress</h3>
                <p className="text-muted-foreground">
                  Get real-time updates as your report moves from submitted to resolved.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-card hover:shadow-civic transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-4">See Results</h3>
                <p className="text-muted-foreground">
                  Transparent response times and department performance metrics.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">1,247</div>
              <p className="text-muted-foreground">Issues Reported</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">892</div>
              <p className="text-muted-foreground">Issues Resolved</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3.2</div>
              <p className="text-muted-foreground">Avg Days to Fix</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">94%</div>
              <p className="text-muted-foreground">Citizen Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corruption Reporting Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-card border-destructive/20 shadow-civic">
            <CardContent className="p-8 md:p-12 text-center">
              <Shield className="w-16 h-16 text-destructive mx-auto mb-6" />
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Report Corruption Safely
              </h2>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Anonymous reporting option available. Your identity is protected when reporting corruption, bribery, or misconduct.
              </p>
              <Button variant="destructive" size="lg" className="shadow-button">
                <Shield className="w-5 h-5 mr-2" />
                Report Corruption
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">MobileAse</span>
              </div>
              <p className="text-muted-foreground">
                Making cities better, one report at a time.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Citizens</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Report Issues</a></li>
                <li><a href="#" className="hover:text-foreground">Track Reports</a></li>
                <li><a href="#" className="hover:text-foreground">Community Feed</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">For Government</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Admin Portal</a></li>
                <li><a href="#" className="hover:text-foreground">Analytics</a></li>
                <li><a href="#" className="hover:text-foreground">API Access</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground">Contact Us</a></li>
                <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2025 MobileAse. Making civic engagement transparent and effective.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}