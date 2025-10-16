import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Volume2, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface VocabWord {
  id: string;
  english: string;
  telugu: string;
  pronunciation: string;
  part_of_speech: string;
  level: string;
  examples: string[];
  learned?: boolean;
  favorite?: boolean;
}

const Vocabulary = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "learned" | "favorites">("all");
  const [vocabulary, setVocabulary] = useState<VocabWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const fetchVocabulary = async () => {
    const { data, error } = await supabase
      .from('vocabulary')
      .select('*')
      .order('level', { ascending: true });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load vocabulary",
        variant: "destructive",
      });
    } else {
      const formatted = (data || []).map(item => ({
        ...item,
        examples: Array.isArray(item.examples) ? item.examples : 
                  typeof item.examples === 'string' ? JSON.parse(item.examples) : []
      }));
      setVocabulary(formatted);
    }
    setLoading(false);
  };

  const filteredWords = vocabulary.filter(word => {
    const matchesSearch = word.english.toLowerCase().includes(search.toLowerCase()) ||
                         word.telugu.includes(search);
    const matchesFilter = 
      filter === "all" ? true :
      filter === "learned" ? word.learned :
      filter === "favorites" ? word.favorite : true;
    
    return matchesSearch && matchesFilter;
  });

  const toggleFavorite = async (wordId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isFavorite = favorites.includes(wordId);
    
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav !== wordId));
      await supabase
        .from('user_vocabulary')
        .update({ favorite: false })
        .eq('user_id', user.id)
        .eq('vocabulary_id', wordId);
    } else {
      setFavorites([...favorites, wordId]);
      const { data: existing } = await supabase
        .from('user_vocabulary')
        .select('id')
        .eq('user_id', user.id)
        .eq('vocabulary_id', wordId)
        .maybeSingle();

      if (existing) {
        await supabase
          .from('user_vocabulary')
          .update({ favorite: true })
          .eq('user_id', user.id)
          .eq('vocabulary_id', wordId);
      } else {
        await supabase
          .from('user_vocabulary')
          .insert({ user_id: user.id, vocabulary_id: wordId, favorite: true });
      }
    }
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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
            Vocabulary
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Your Vocabulary</h1>
        <p className="text-muted-foreground mb-8 text-center">మీ పదజాలం</p>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search words... / పదాలను వెతకండి..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
              className={filter === "all" ? "gradient-hero text-white" : ""}
            >
              All Words
            </Button>
            <Button
              variant={filter === "learned" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("learned")}
              className={filter === "learned" ? "gradient-success text-white" : ""}
            >
              Learned
            </Button>
            <Button
              variant={filter === "favorites" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("favorites")}
              className={filter === "favorites" ? "gradient-accent text-white" : ""}
            >
              ❤️ Favorites
            </Button>
          </div>
        </div>

        {/* Vocabulary Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => (
            <Card key={word.id} className="p-5 hover:shadow-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className="space-y-1">
                  <Badge variant={word.learned ? "secondary" : "outline"} className="text-xs">
                    {word.level}
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-2 capitalize">
                    {word.part_of_speech}
                  </Badge>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0"
                  onClick={() => toggleFavorite(word.id)}
                >
                  <Heart className={`w-4 h-4 ${word.favorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <h3 className="text-xl font-bold mb-1">{word.english}</h3>
              <p className="text-sm text-muted-foreground mb-1">/{word.pronunciation}/</p>
              <p className="text-lg text-muted-foreground mb-3">{word.telugu}</p>

              <div className="space-y-2 mb-4">
                {Array.isArray(word.examples) && word.examples.slice(0, 1).map((example: string, i: number) => (
                  <p key={i} className="text-sm text-muted-foreground italic">
                    "{example}"
                  </p>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => playAudio(word.english)}
                className="w-full group-hover:gradient-hero group-hover:text-white transition-all"
              >
                <Volume2 className="w-4 h-4 mr-2" />
                Listen
              </Button>
            </Card>
          ))}
        </div>

        {filteredWords.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground mb-2">No words found</p>
            <p className="text-sm text-muted-foreground">పదాలు కనుగొనబడలేదు</p>
          </Card>
        )}

        {/* Summary */}
        <Card className="p-6 mt-8 text-center">
          <div className="text-sm text-muted-foreground mb-2">
            Showing {filteredWords.length} of {vocabulary.length} words
          </div>
          <div className="text-xs text-muted-foreground">
            {vocabulary.filter(w => w.learned).length} words learned • {vocabulary.filter(w => w.favorite).length} favorites
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Vocabulary;