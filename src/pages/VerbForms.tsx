import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, BookOpen, Sparkles, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VerbForm {
  id: string;
  date: string;
  base_form: string;
  base_form_telugu: string;
  present_simple: string;
  present_continuous: string;
  past_simple: string;
  past_continuous: string;
  future_simple: string;
  present_perfect: string;
  level: string;
  category: string;
  example_sentence: string;
  example_sentence_telugu: string;
}

const VerbForms = () => {
  const [verbs, setVerbs] = useState<VerbForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchVerbs();
  }, []);

  const fetchVerbs = async () => {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from("verb_forms")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load verb forms",
        variant: "destructive",
      });
    } else {
      setVerbs((data || []) as unknown as VerbForm[]);
    }
    setLoading(false);
  };

  const generateVerbs = async () => {
    setGenerating(true);
    
    const { data, error } = await supabase.functions.invoke("generate-verb-forms", {
      body: { level: "beginner", count: 20 }
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to generate verb forms",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success!",
        description: `Generated ${data.count} verb forms`,
      });
      fetchVerbs();
    }
    setGenerating(false);
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
            Verb Forms
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Verb Forms</h1>
            <p className="text-muted-foreground">రోజువారీ క్రియా రూపాలు</p>
          </div>
          {verbs.length > 0 && (
            <Button onClick={generateVerbs} disabled={generating} variant="outline">
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate More
                </>
              )}
            </Button>
          )}
        </div>

        {verbs.length === 0 ? (
          <Card className="p-12 text-center">
            <Sparkles className="w-16 h-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Generate Today's Verb Forms</h2>
            <p className="text-muted-foreground mb-6">
              AI will generate 20+ essential verb forms for practice
            </p>
            <Button onClick={generateVerbs} disabled={generating} size="lg">
              {generating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate 20 Verbs
                </>
              )}
            </Button>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {verbs.map((verb) => (
              <Card key={verb.id} className="p-5 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">
                      {verb.category}
                    </Badge>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => playAudio(verb.base_form)}
                  >
                    <Volume2 className="w-4 h-4" />
                  </Button>
                </div>

                <h3 className="text-2xl font-bold mb-1">{verb.base_form}</h3>
                <p className="text-lg text-muted-foreground mb-4">{verb.base_form_telugu}</p>

                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-semibold">Present Simple:</span>
                    <p className="text-muted-foreground">{verb.present_simple}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Present Continuous:</span>
                    <p className="text-muted-foreground">{verb.present_continuous}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Past Simple:</span>
                    <p className="text-muted-foreground">{verb.past_simple}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Past Continuous:</span>
                    <p className="text-muted-foreground">{verb.past_continuous}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Future:</span>
                    <p className="text-muted-foreground">{verb.future_simple}</p>
                  </div>
                  <div>
                    <span className="font-semibold">Present Perfect:</span>
                    <p className="text-muted-foreground">{verb.present_perfect}</p>
                  </div>
                </div>

                {verb.example_sentence && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm font-medium mb-1">{verb.example_sentence}</p>
                    <p className="text-xs text-muted-foreground">{verb.example_sentence_telugu}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {verbs.length > 0 && (
          <Card className="p-6 mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Showing {verbs.length} verbs for today
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default VerbForms;