import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface DailySentence {
  id: string;
  english: string;
  telugu: string;
  level: string;
  category: string;
}

const DailySentences = () => {
  const [sentences, setSentences] = useState<DailySentence[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSentences = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('daily_sentences')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load daily sentences",
        variant: "destructive",
      });
    } else {
      setSentences(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSentences();
  }, []);

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
            Daily Practice
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Daily Sentences</h1>
            <p className="text-muted-foreground">రోజువారీ వాక్యాలు</p>
          </div>
          <Button onClick={fetchSentences} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <div className="space-y-4">
            {sentences.map((sentence) => (
              <Card key={sentence.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <Badge variant="outline" className="capitalize">
                    {sentence.category?.replace('_', ' ')}
                  </Badge>
                  <Badge variant="secondary">{sentence.level}</Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-lg font-medium mb-1">{sentence.english}</p>
                    <p className="text-muted-foreground">{sentence.telugu}</p>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => playAudio(sentence.english)}
                    className="w-full hover:gradient-hero hover:text-white transition-all"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    Listen & Repeat
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailySentences;
