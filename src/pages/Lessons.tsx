import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, BookOpen, Sparkles, Loader2, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string;
  duration_minutes: number;
  completed: boolean;
  content: {
    titleTelugu: string;
    vocabulary: Array<{
      english: string;
      telugu: string;
      pronunciation: string;
      example: string;
      exampleTelugu: string;
    }>;
    grammar_tip: {
      english: string;
      telugu: string;
    };
  };
}

const Lessons = () => {
  const [flipped, setFlipped] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchLessons();
  }, []);

  const fetchLessons = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq("user_id", user.id)
      .order("order_index", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load lessons",
        variant: "destructive",
      });
    } else {
      setLessons((data || []) as unknown as Lesson[]);
      if (data && data.length > 0) {
        setSelectedLesson(data[0] as unknown as Lesson);
      }
    }
    setLoading(false);
  };

  const generateLessons = async () => {
    setGenerating(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const { data, error } = await supabase.functions.invoke("generate-lessons", {
      body: { level: "beginner", count: 10 },
      headers: session?.access_token ? {
        Authorization: `Bearer ${session.access_token}`
      } : undefined
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to generate lessons",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: `Generated ${data.lessons.length} new lessons`,
      });
      fetchLessons();
    }
    setGenerating(false);
  };

  const markComplete = async (lessonId: string) => {
    const { error } = await supabase
      .from("lessons")
      .update({ completed: true })
      .eq("id", lessonId);

    if (!error) {
      fetchLessons();
      toast({
        title: "Lesson completed!",
        description: "Great progress on your learning journey!",
      });
    }
  };

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    utterance.rate = 0.85;
    utterance.pitch = 1.1;
    
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(voice => 
      voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
    );
    if (femaleVoice) utterance.voice = femaleVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

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
          <Badge variant="secondary" className="gradient-success text-white">
            <BookOpen className="w-3 h-3 mr-1" />
            Lessons
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {lessons.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Generate Your Lessons</h2>
            <p className="text-muted-foreground mb-6">
              AI will create personalized lessons just for you
            </p>
            <Button onClick={generateLessons} disabled={generating} size="lg">
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate 10 Lessons
                </>
              )}
            </Button>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lessons List */}
            <div className="lg:col-span-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Your Lessons</h2>
                <Button onClick={generateLessons} disabled={generating} size="sm" variant="outline">
                  {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                </Button>
              </div>
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <Card
                    key={lesson.id}
                    className={`p-4 cursor-pointer transition-all ${
                      selectedLesson?.id === lesson.id ? "border-primary bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedLesson(lesson)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-muted-foreground">#{index + 1}</span>
                          {lesson.completed && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                        </div>
                        <h3 className="font-semibold text-sm line-clamp-2">{lesson.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{lesson.duration_minutes} min</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Lesson Content */}
            {selectedLesson && (
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <Badge>{selectedLesson.level}</Badge>
                    {!selectedLesson.completed && (
                      <Button onClick={() => markComplete(selectedLesson.id)} size="sm">
                        Mark Complete
                      </Button>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold mb-2">{selectedLesson.title}</h1>
                  <p className="text-xl text-muted-foreground mb-2">{selectedLesson.content.titleTelugu}</p>
                  <p className="text-muted-foreground">{selectedLesson.description}</p>
                </div>

                {/* Grammar Section */}
                <Card className="p-6 mb-8 border-primary/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h2 className="text-xl font-semibold mb-2">Grammar Tip</h2>
                      <p className="text-muted-foreground mb-2">
                        {selectedLesson.content.grammar_tip.english}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedLesson.content.grammar_tip.telugu}
                      </p>
                    </div>
                  </div>
                </Card>

                {/* Vocabulary Cards */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Vocabulary</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {selectedLesson.content.vocabulary.map((word, index) => (
                      <div
                        key={index}
                        className="perspective-1000 cursor-pointer"
                        onClick={() => handleFlip(index)}
                      >
                        <Card className={`relative h-48 transition-all duration-500 transform-style-3d ${
                          flipped === index ? "rotate-y-180" : ""
                        } hover:shadow-lg`}>
                          {/* Front */}
                          <div className={`absolute inset-0 p-6 backface-hidden ${
                            flipped === index ? "invisible" : "visible"
                          }`}>
                            <div className="flex flex-col h-full justify-between">
                              <div>
                                <h3 className="text-2xl font-bold mb-2">{word.english}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{word.pronunciation}</p>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  playAudio(word.english);
                                }}
                                className="w-fit"
                              >
                                <Volume2 className="w-4 h-4 mr-2" />
                                Listen
                              </Button>
                            </div>
                          </div>

                          {/* Back */}
                          <div className={`absolute inset-0 p-6 rotate-y-180 backface-hidden ${
                            flipped === index ? "visible" : "invisible"
                          }`}>
                            <div className="flex flex-col h-full">
                              <h3 className="text-xl font-bold mb-2 text-secondary">{word.telugu}</h3>
                              <div className="flex-1">
                                <p className="text-sm mb-2 font-medium">{word.example}</p>
                                <p className="text-xs text-muted-foreground">{word.exampleTelugu}</p>
                              </div>
                              <p className="text-xs text-muted-foreground">Tap to flip back</p>
                            </div>
                          </div>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Section */}
                <Card className="p-6 gradient-hero text-white">
                  <h3 className="text-xl font-semibold mb-2">Ready to Practice?</h3>
                  <p className="mb-4 opacity-90">
                    Use these words in a conversation with your AI teacher!
                  </p>
                  <p className="text-sm mb-4 opacity-90">
                    మీ AI టీచర్‌తో సంభాషణలో ఈ పదాలను ఉపయోగించండి!
                  </p>
                  <Link to="/voice-practice">
                    <Button variant="secondary" className="w-full sm:w-auto">
                      Start Voice Practice
                    </Button>
                  </Link>
                </Card>
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default Lessons;