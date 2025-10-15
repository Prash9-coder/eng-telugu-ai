import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const VoicePractice = () => {
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState([
    {
      type: "ai",
      english: "Hello! I'm your AI English teacher. Let's practice speaking today. Tell me about yourself!",
      telugu: "నమస్కారం! నేను మీ AI ఇంగ్లీష్ టీచర్. ఈరోజు మాట్లాడటం ప్రాక్టీస్ చేద్దాం. మీ గురించి చెప్పండి!"
    }
  ]);

  const toggleListening = () => {
    setIsListening(!isListening);
    
    if (!isListening) {
      // Simulate adding a user message after 2 seconds
      setTimeout(() => {
        setMessages(prev => [...prev, {
          type: "user",
          english: "My name is Ravi. I want to learn English.",
          telugu: ""
        }]);
        setIsListening(false);
        
        // AI response after 1 second
        setTimeout(() => {
          setMessages(prev => [...prev, {
            type: "ai",
            english: "Nice to meet you, Ravi! That's wonderful. What do you want to learn English for?",
            telugu: "మిమ్మల్ని కలవడం ఆనందంగా ఉంది, రవి! చాలా బాగుంది. మీరు ఇంగ్లీష్ ఎందుకు నేర్చుకోవాలనుకుంటున్నారు?"
          }]);
        }, 1000);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-glass border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          <Badge variant="secondary" className="gradient-hero text-white">
            <Sparkles className="w-3 h-3 mr-1" />
            Voice Practice
          </Badge>
          <Button variant="ghost" size="sm">
            <Volume2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Conversation Area */}
        <div className="mb-8 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
            >
              <Card className={`max-w-[80%] p-4 ${
                message.type === "user" 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-card"
              }`}>
                <p className="font-medium mb-2">{message.english}</p>
                {message.telugu && (
                  <p className="text-sm opacity-80 border-t pt-2 mt-2">
                    {message.telugu}
                  </p>
                )}
              </Card>
            </div>
          ))}
        </div>

        {/* Voice Control */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            {/* Pulse rings */}
            {isListening && (
              <>
                <div className="absolute inset-0 rounded-full gradient-hero animate-pulse-ring"></div>
                <div className="absolute inset-0 rounded-full gradient-hero animate-pulse-ring animation-delay-300"></div>
              </>
            )}
            
            {/* Microphone button */}
            <Button
              size="lg"
              onClick={toggleListening}
              className={`relative w-24 h-24 rounded-full ${
                isListening 
                  ? "gradient-accent shadow-glow" 
                  : "gradient-hero shadow-lg"
              } hover:scale-110 transition-transform`}
            >
              <Mic className="w-10 h-10 text-white" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold mb-1">
              {isListening ? "Listening..." : "Tap to speak"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isListening ? "మాట్లాడండి..." : "మాట్లాడటానికి టాప్ చేయండి"}
            </p>
          </div>

          {/* Audio visualization when listening */}
          {isListening && (
            <div className="flex items-center gap-1 h-12">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-wave"
                  style={{
                    animationDelay: `${i * 0.1}s`,
                    height: "100%"
                  }}
                ></div>
              ))}
            </div>
          )}

          {/* Tips */}
          <Card className="w-full p-4 bg-muted/50">
            <p className="text-sm text-center text-muted-foreground">
              💡 Speak clearly and naturally. The AI will help you improve your pronunciation and grammar.
            </p>
            <p className="text-xs text-center text-muted-foreground mt-2">
              స్పష్టంగా మరియు సహజంగా మాట్లాడండి. AI మీ ఉచ్ఛారణ మరియు వ్యాకరణాన్ని మెరుగుపరచడంలో సహాయపడుతుంది.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VoicePractice;