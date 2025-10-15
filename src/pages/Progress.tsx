import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, TrendingUp, Award, Calendar, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const Progress = () => {
  const stats = {
    wordsLearned: 42,
    streak: 7,
    practiceTime: 125, // minutes
    lessonsCompleted: 5
  };

  const weeklyData = [
    { day: "Mon", words: 5, time: 15 },
    { day: "Tue", words: 8, time: 20 },
    { day: "Wed", words: 6, time: 18 },
    { day: "Thu", words: 10, time: 25 },
    { day: "Fri", words: 7, time: 22 },
    { day: "Sat", words: 4, time: 15 },
    { day: "Sun", words: 2, time: 10 }
  ];

  const maxWords = Math.max(...weeklyData.map(d => d.words));

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <header className="sticky top-0 z-50 backdrop-blur-glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary" className="gradient-accent text-white">
            <TrendingUp className="w-3 h-3 mr-1" />
            Your Progress
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Learning Journey</h1>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.wordsLearned}</div>
                <div className="text-sm text-muted-foreground">Words Learned</div>
                <div className="text-xs text-muted-foreground">నేర్చుకున్న పదాలు</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-secondary/20 hover:border-secondary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-success flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.streak}</div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="text-xs text-muted-foreground">రోజుల శ్రేణి</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-accent/20 hover:border-accent/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-accent flex items-center justify-center">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.practiceTime}m</div>
                <div className="text-sm text-muted-foreground">Practice Time</div>
                <div className="text-xs text-muted-foreground">ప్రాక్టీస్ సమయం</div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-primary/20 hover:border-primary/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full gradient-hero flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.lessonsCompleted}</div>
                <div className="text-sm text-muted-foreground">Lessons Done</div>
                <div className="text-xs text-muted-foreground">పాఠాలు పూర్తయ్యాయి</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Chart */}
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">This Week's Activity</h2>
          <div className="flex items-end justify-between gap-2 h-48">
            {weeklyData.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center justify-end flex-1">
                  <div className="text-xs font-medium mb-1">{day.words}</div>
                  <div
                    className="w-full gradient-hero rounded-t transition-all hover:opacity-80"
                    style={{
                      height: `${(day.words / maxWords) * 100}%`,
                      minHeight: day.words > 0 ? '20px' : '0'
                    }}
                  ></div>
                </div>
                <div className="text-xs text-muted-foreground font-medium">{day.day}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-muted-foreground text-center">
            Words learned per day | రోజుకు నేర్చుకున్న పదాలు
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Achievements</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                <Award className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <div className="font-semibold">First Week!</div>
                <div className="text-sm text-muted-foreground">Completed 7-day streak</div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="font-semibold">Quick Learner</div>
                <div className="text-sm text-muted-foreground">Learned 40+ words</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Motivational Card */}
        <Card className="p-6 mt-8 gradient-hero text-white text-center">
          <h3 className="text-xl font-semibold mb-2">Keep Going! 🚀</h3>
          <p className="mb-2 opacity-90">
            You're doing great! Practice daily to maintain your streak.
          </p>
          <p className="text-sm opacity-90">
            మీరు బాగా చేస్తున్నారు! మీ శ్రేణిని కొనసాగించడానికి ప్రతిరోజు ప్రాక్టీస్ చేయండి.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Progress;