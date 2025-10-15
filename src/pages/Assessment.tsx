import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const questions = [
  {
    english: "Which sentence is correct?",
    telugu: "ఏ వాక్యం సరైనది?",
    options: [
      { text: "I am going to school.", telugu: "నేను స్కూల్‌కు వెళ్తున్నాను." },
      { text: "I is going to school.", telugu: "నేను స్కూల్‌కు వెళ్తున్నాను. (తప్పు)" },
      { text: "I going to school.", telugu: "నేను స్కూల్‌కు వెళ్తున్నాను. (తప్పు)" }
    ],
    correct: 0
  },
  {
    english: "What is the plural of 'child'?",
    telugu: "'child' యొక్క బహువచనం ఏమిటి?",
    options: [
      { text: "Childs", telugu: "చైల్డ్స్ (తప్పు)" },
      { text: "Children", telugu: "పిల్లలు" },
      { text: "Childes", telugu: "చైల్డెస్ (తప్పు)" }
    ],
    correct: 1
  },
  {
    english: "Choose the correct greeting:",
    telugu: "సరైన శుభాకాంక్షను ఎంచుకోండి:",
    options: [
      { text: "Good morning", telugu: "శుభోదయం" },
      { text: "Morning good", telugu: "తప్పు" },
      { text: "A good morning", telugu: "తప్పు" }
    ],
    correct: 0
  }
];

const Assessment = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, i) => {
      if (selectedAnswers[i] === q.correct) correct++;
    });
    return correct;
  };

  const getLevel = (score: number) => {
    const percentage = (score / questions.length) * 100;
    if (percentage >= 80) return { level: "Advanced", color: "gradient-success" };
    if (percentage >= 50) return { level: "Intermediate", color: "gradient-hero" };
    return { level: "Beginner", color: "gradient-accent" };
  };

  if (showResults) {
    const score = calculateScore();
    const { level, color } = getLevel(score);

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center animate-scale-in">
          <div className={`w-24 h-24 rounded-full ${color} mx-auto mb-6 flex items-center justify-center text-4xl font-bold text-white`}>
            {score}/{questions.length}
          </div>
          <h2 className="text-2xl font-bold mb-2">Assessment Complete!</h2>
          <p className="text-muted-foreground mb-4">మీ స్థాయి నిర్ధారణ పూర్తయింది!</p>
          
          <Badge className={`${color} text-white text-lg px-4 py-2 mb-6`}>
            Your Level: {level}
          </Badge>
          
          <p className="text-sm text-muted-foreground mb-6">
            Based on your performance, we've identified your English level. 
            Let's start your personalized learning journey!
          </p>
          
          <Button 
            className="w-full gradient-hero text-white"
            onClick={() => navigate("/")}
          >
            Start Learning
          </Button>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const question = questions[currentQuestion];

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
          <Badge variant="secondary">
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-2" />
          <p className="text-sm text-muted-foreground text-center">
            {Math.round(progress)}% Complete
          </p>
        </div>

        <Card className="p-6 sm:p-8 mb-6 animate-fade-in">
          <h3 className="text-xl font-semibold mb-2">{question.english}</h3>
          <p className="text-muted-foreground mb-6">{question.telugu}</p>

          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all hover:border-primary ${
                  selectedAnswers[currentQuestion] === index
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }`}
              >
                <div className="flex items-center gap-3">
                  {selectedAnswers[currentQuestion] === index ? (
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <div>
                    <p className="font-medium">{option.text}</p>
                    <p className="text-sm text-muted-foreground">{option.telugu}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={selectedAnswers[currentQuestion] === undefined}
            className="flex-1 gradient-hero text-white"
          >
            {currentQuestion === questions.length - 1 ? "Finish" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;