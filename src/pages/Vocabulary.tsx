import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Volume2, Heart, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const vocabularyData = [
  {
    id: 1,
    english: "Hello",
    telugu: "హలో / నమస్కారం",
    level: "Beginner",
    learned: true,
    favorite: true,
    examples: ["Hello! How are you?", "Hello, nice to meet you."]
  },
  {
    id: 2,
    english: "Thank you",
    telugu: "ధన్యవాదాలు",
    level: "Beginner",
    learned: true,
    favorite: false,
    examples: ["Thank you for your help!", "Thank you very much."]
  },
  {
    id: 3,
    english: "Friend",
    telugu: "స్నేహితుడు",
    level: "Beginner",
    learned: true,
    favorite: true,
    examples: ["He is my friend.", "I have many friends."]
  },
  {
    id: 4,
    english: "Beautiful",
    telugu: "అందమైన",
    level: "Intermediate",
    learned: false,
    favorite: false,
    examples: ["What a beautiful day!", "She has a beautiful smile."]
  },
  {
    id: 5,
    english: "Important",
    telugu: "ముఖ్యమైన",
    level: "Intermediate",
    learned: false,
    favorite: false,
    examples: ["This is very important.", "Education is important."]
  },
  {
    id: 6,
    english: "Understand",
    telugu: "అర్థం చేసుకోవడం",
    level: "Beginner",
    learned: true,
    favorite: false,
    examples: ["I understand the lesson.", "Do you understand?"]
  }
];

const Vocabulary = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "learned" | "favorites">("all");

  const filteredWords = vocabularyData.filter(word => {
    const matchesSearch = word.english.toLowerCase().includes(search.toLowerCase()) ||
                         word.telugu.includes(search);
    const matchesFilter = 
      filter === "all" ? true :
      filter === "learned" ? word.learned :
      filter === "favorites" ? word.favorite : true;
    
    return matchesSearch && matchesFilter;
  });

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
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
                <Badge variant={word.learned ? "secondary" : "outline"} className="text-xs">
                  {word.level}
                </Badge>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className={`w-4 h-4 ${word.favorite ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
              </div>

              <h3 className="text-xl font-bold mb-1">{word.english}</h3>
              <p className="text-lg text-muted-foreground mb-3">{word.telugu}</p>

              <div className="space-y-2 mb-4">
                {word.examples.slice(0, 1).map((example, i) => (
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
            Showing {filteredWords.length} of {vocabularyData.length} words
          </div>
          <div className="text-xs text-muted-foreground">
            {vocabularyData.filter(w => w.learned).length} words learned • {vocabularyData.filter(w => w.favorite).length} favorites
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Vocabulary;