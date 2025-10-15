import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, Volume2, Sparkles, ArrowLeft, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useVoiceChat } from "@/hooks/useVoiceChat";
import { useEffect, useRef } from "react";

const VoicePractice = () => {
  const {
    messages,
    isListening,
    isProcessing,
    isSpeaking,
    startListening,
    stopListening,
    clearMessages,
  } = useVoiceChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
            AI Voice Practice
          </Badge>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={clearMessages}
            disabled={messages.length === 0}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Conversation Area */}
        <div className="mb-8 space-y-4 min-h-[400px] max-h-[500px] overflow-y-auto">
          {messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <Card className="p-8 text-center max-w-md">
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Ready to Practice!</h3>
                <p className="text-muted-foreground mb-1">
                  Click the microphone and start speaking in English
                </p>
                <p className="text-sm text-muted-foreground">
                  మైక్రోఫోన్ క్లిక్ చేసి ఇంగ్లీష్‌లో మాట్లాడండి
                </p>
              </Card>
            </div>
          )}
          
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
                <p className="whitespace-pre-wrap">{message.text}</p>
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
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
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing || isSpeaking}
              className={`relative w-24 h-24 rounded-full ${
                isListening 
                  ? "gradient-accent shadow-glow" 
                  : "gradient-hero shadow-lg"
              } hover:scale-110 transition-transform disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <Mic className="w-10 h-10 text-white" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-lg font-semibold mb-1">
              {isListening 
                ? "Listening..." 
                : isProcessing 
                ? "Processing..." 
                : isSpeaking 
                ? "Speaking..." 
                : "Tap to speak"}
            </p>
            <p className="text-sm text-muted-foreground">
              {isListening 
                ? "మాట్లాడండి..." 
                : isProcessing 
                ? "ప్రాసెస్ చేస్తోంది..." 
                : isSpeaking 
                ? "మాట్లాడుతోంది..." 
                : "మాట్లాడటానికి టాప్ చేయండి"}
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