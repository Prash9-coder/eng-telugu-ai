import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, BookOpen, TrendingUp, Globe, Zap, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-2xl">🎓</div>
            <div>
              <h1 className="text-xl font-bold text-primary">TeluguEnglish AI</h1>
              <p className="text-xs text-muted-foreground">Voice Teacher</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">తెలుగు / EN</Button>
            <Badge variant="secondary" className="hidden sm:flex">
              <Award className="w-3 h-3 mr-1" />
              Beginner
            </Badge>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="outline" className="mb-4 animate-fade-in">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Voice Learning
          </Badge>
          <h2 className="text-4xl sm:text-6xl font-bold mb-6 animate-fade-in">
            Learn English with
            <span className="block mt-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Your AI Voice Teacher
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-4 max-w-2xl mx-auto animate-fade-in">
            Practice speaking English naturally with AI. Get instant feedback in Telugu.
          </p>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
            మీ AI టీచర్‌తో ఇంగ్లీష్ మాట్లాడటం నేర్చుకోండి. తెలుగులో తక్షణ సహాయం పొందండి.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-fade-in">
            <Link to="/voice-practice">
              <Button size="lg" className="gradient-hero text-white shadow-glow w-full sm:w-auto">
                <Mic className="mr-2 w-5 h-5" />
                Start Speaking Now
              </Button>
            </Link>
            <Link to="/assessment">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                <BookOpen className="mr-2 w-5 h-5" />
                Take Level Test
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto animate-fade-in">
            <Card className="p-4 border-primary/20 hover:border-primary/40 transition-colors">
              <div className="text-2xl font-bold text-primary">0</div>
              <div className="text-xs text-muted-foreground">Words Learned</div>
            </Card>
            <Card className="p-4 border-secondary/20 hover:border-secondary/40 transition-colors">
              <div className="text-2xl font-bold text-secondary">0</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </Card>
            <Card className="p-4 border-accent/20 hover:border-accent/40 transition-colors">
              <div className="text-2xl font-bold text-accent">0m</div>
              <div className="text-xs text-muted-foreground">Practice Time</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Why Learn with AI?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center mb-4">
                <Mic className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Voice-to-Voice Practice</h4>
              <p className="text-muted-foreground mb-2">
                Speak naturally and get instant AI responses with perfect pronunciation.
              </p>
              <p className="text-sm text-muted-foreground">
                మాట్లాడండి మరియు AI నుండి తక్షణ స్పందన పొందండి.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full gradient-success flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Bilingual Support</h4>
              <p className="text-muted-foreground mb-2">
                Every explanation in both English and Telugu for better understanding.
              </p>
              <p className="text-sm text-muted-foreground">
                ప్రతి వివరణ ఇంగ్లీష్ మరియు తెలుగులో అందుబాటులో ఉంటుంది.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Track Your Progress</h4>
              <p className="text-muted-foreground mb-2">
                See your improvement with detailed analytics and achievements.
              </p>
              <p className="text-sm text-muted-foreground">
                మీ పురోగతిని వివరణాత్మక విశ్లేషణతో చూడండి.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h3 className="text-3xl font-bold text-center mb-12">Start Your Journey</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <Link to="/voice-practice">
              <Card className="p-6 hover:shadow-glow hover:border-primary transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Mic className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Voice Practice</h4>
                    <p className="text-sm text-muted-foreground">Start speaking with AI teacher</p>
                  </div>
                </div>
              </Card>
            </Link>

            <Link to="/lessons">
              <Card className="p-6 hover:shadow-glow hover:border-secondary transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl gradient-success flex items-center justify-center group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-1">Today's Lesson</h4>
                    <p className="text-sm text-muted-foreground">Learn new vocabulary & grammar</p>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;