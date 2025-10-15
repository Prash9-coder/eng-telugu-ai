import { useState, useCallback, useRef } from 'react';
import { toast } from '@/hooks/use-toast';

interface Message {
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

export const useVoiceChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const recognitionRef = useRef<any>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const sendToAI = useCallback(async (userText: string) => {
    setIsProcessing(true);
    
    const userMessage: Message = {
      type: 'user',
      text: userText,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      abortControllerRef.current = new AbortController();
      
      const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.type === 'user' ? 'user' : 'assistant',
            content: m.text,
          })),
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get AI response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let aiResponseText = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              aiResponseText += content;
              
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.type === 'ai') {
                  return prev.map((m, i) => 
                    i === prev.length - 1 ? { ...m, text: aiResponseText } : m
                  );
                }
                return [...prev, {
                  type: 'ai',
                  text: aiResponseText,
                  timestamp: new Date(),
                }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      if (aiResponseText) {
        const englishPart = aiResponseText.match(/\*\*English:\*\*\s*([^\*]+)/)?.[1]?.trim();
        if (englishPart) {
          speak(englishPart);
        } else {
          speak(aiResponseText);
        }
      }

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('AI error:', error);
        toast({
          title: 'Error',
          description: 'Failed to get AI response. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsProcessing(false);
    }
  }, [messages, speak]);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: 'Not Supported',
        description: 'Speech recognition is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = 'en-IN';

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      sendToAI(transcript);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error !== 'aborted' && event.error !== 'no-speech') {
        toast({
          title: 'Error',
          description: 'Failed to recognize speech. Please try again.',
          variant: 'destructive',
        });
      }
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.start();
  }, [sendToAI]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    messages,
    isListening,
    isProcessing,
    isSpeaking,
    startListening,
    stopListening,
    clearMessages,
  };
};
