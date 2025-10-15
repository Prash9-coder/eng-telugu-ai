import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Volume2, BookOpen, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const lesson = {
  title: "Daily Greetings and Introductions",
  titleTelugu: "రోజువారీ శుభాకాంక్షలు మరియు పరిచయాలు",
  level: "Beginner",
  vocabulary: [
    {
      english: "Hello",
      telugu: "హలో / నమస్కారం",
      pronunciation: "heh-LOH",
      example: "Hello! How are you?",
      exampleTelugu: "హలో! ఎలా ఉన్నారు?"
    },
    {
      english: "Good morning",
      telugu: "శుభోదయం",
      pronunciation: "good MOR-ning",
      example: "Good morning! Have a nice day.",
      exampleTelugu: "శుభోదయం! మంచి రోజు కలగాలి."
    },
    {
      english: "Thank you",
      telugu: "ధన్యవాదాలు",
      pronunciation: "THANK yoo",
      example: "Thank you for your help!",
      exampleTelugu: "మీ సహాయానికి ధన్యవాదాలు!"
    },
    {
      english: "Please",
      telugu: "దయచేసి",
      pronunciation: "PLEEZ",
      example: "Please help me.",
      exampleTelugu: "దయచేసి నాకు సహాయం చేయండి."
    }
  ]
};

const Lessons = () => {
  const [flipped, setFlipped] = useState<number | null>(null);

  const handleFlip = (index: number) => {
    setFlipped(flipped === index ? null : index);
  };

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
            Lesson
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Lesson Header */}
        <div className="mb-8 text-center">
          <Badge className="mb-4">{lesson.level}</Badge>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">{lesson.title}</h1>
          <p className="text-xl text-muted-foreground">{lesson.titleTelugu}</p>
        </div>

        {/* Grammar Section */}
        <Card className="p-6 mb-8 border-primary/20">
          <div className="flex items-start gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-xl font-semibold mb-2">Grammar Tip</h2>
              <p className="text-muted-foreground mb-2">
                When greeting someone in English, we use "Hello" for any time of day, but time-specific greetings like "Good morning" (before noon), "Good afternoon" (noon to evening), and "Good evening" (after sunset) are more formal.
              </p>
              <p className="text-sm text-muted-foreground">
                ఇంగ్లీష్‌లో ఎవరినైనా పలకరించేటప్పుడు, మేము రోజులో ఎప్పుడైనా "Hello" ఉపయోగిస్తాము, కానీ "Good morning", "Good afternoon", మరియు "Good evening" వంటి సమయ-నిర్దిష్ట శుభాకాంక్షలు మరింత అధికారికంగా ఉంటాయి.
              </p>
            </div>
          </div>
        </Card>

        {/* Vocabulary Cards */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Vocabulary</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {lesson.vocabulary.map((word, index) => (
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