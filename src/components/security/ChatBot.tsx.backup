import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Download, Sparkles, TrendingUp, Shield, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  hasCode?: boolean;
  codeLanguage?: string;
}

const predefinedResponses: Record<string, string> = {
  hello: "Hello! I'm your AI Cybersecurity Assistant. I can help you with threat analysis, security recommendations, and system monitoring. How can I assist you today?",
  help: "I can help you with:\n• Analyzing security threats\n• Explaining attack types (DDoS, Malware, Phishing, etc.)\n• Providing security recommendations\n• Monitoring system status\n• Generating threat reports\n\nWhat would you like to know?",
  ddos: "A DDoS (Distributed Denial of Service) attack overwhelms a target system with traffic from multiple sources, making it unavailable to legitimate users. Our system detects DDoS attacks by monitoring traffic patterns and can automatically trigger mitigation protocols.",
  malware: "Malware is malicious software designed to harm or exploit systems. Our AI models analyze file behavior, network traffic, and system changes to detect malware in real-time. We use machine learning to identify both known and zero-day malware threats.",
  phishing: "Phishing attacks use deceptive emails or websites to steal sensitive information. Our system analyzes email patterns, URLs, and content to identify phishing attempts. We recommend enabling multi-factor authentication and security awareness training.",
  ransomware: "Ransomware encrypts your data and demands payment for decryption. Our system monitors for suspicious file encryption activities and unusual network behavior. Regular backups and network segmentation are key prevention strategies.",
  threat: "Our system currently monitors multiple threat types including DDoS attacks, malware, phishing, ransomware, and APT attacks. We use AI/ML models to detect anomalies and predict potential threats before they cause damage.",
  status: "System Status: All monitoring systems are operational. We're currently tracking threats across 12 global regions with real-time analysis. ML models are performing at 94.2% accuracy. No critical alerts at this time.",
  report: "You can generate threat reports from the Threat Reports page. Reports include detailed analysis of detected threats, severity levels, affected systems, and recommended actions. Reports can be downloaded in PDF format.",
  ml: "Our ML models use supervised learning algorithms including Random Forest, Neural Networks, and SVM to detect threats. Models are trained on historical attack data and continuously updated with new threat patterns. Current model accuracy is 94.2%.",
  network: "Network monitoring includes VPN connections, WiFi traffic analysis, and protocol inspection. We track bandwidth usage, connection patterns, and detect anomalies in real-time. You can view detailed network metrics on the Network Dashboard.",
  default: "I understand you're asking about cybersecurity. Could you be more specific? You can ask me about:\n• Threat types (DDoS, malware, phishing, ransomware)\n• System status and monitoring\n• ML models and detection\n• Security recommendations\n• Report generation",
};

const getResponse = (userMessage: string): string => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return predefinedResponses.hello;
  }
  if (message.includes('help') || message.includes('what can you do')) {
    return predefinedResponses.help;
  }
  if (message.includes('ddos')) {
    return predefinedResponses.ddos;
  }
  if (message.includes('malware') || message.includes('virus')) {
    return predefinedResponses.malware;
  }
  if (message.includes('phishing') || message.includes('email')) {
    return predefinedResponses.phishing;
  }
  if (message.includes('ransomware')) {
    return predefinedResponses.ransomware;
  }
  if (message.includes('threat') || message.includes('attack')) {
    return predefinedResponses.threat;
  }
  if (message.includes('status') || message.includes('how is') || message.includes('system')) {
    return predefinedResponses.status;
  }
  if (message.includes('report')) {
    return predefinedResponses.report;
  }
  if (message.includes('ml') || message.includes('machine learning') || message.includes('model')) {
    return predefinedResponses.ml;
  }
  if (message.includes('network') || message.includes('vpn') || message.includes('wifi')) {
    return predefinedResponses.network;
  }
  
  return predefinedResponses.default;
};

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Cybersecurity Assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getResponse(inputValue),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              AI Security Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Bot className="h-4 w-4 text-primary" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-lg px-4 py-2 text-sm',
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-foreground'
                      )}
                    >
                      <div className="whitespace-pre-wrap break-words">{message.text}</div>
                      <div
                        className={cn(
                          'text-xs mt-1',
                          message.sender === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary flex items-center justify-center">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about cybersecurity..."
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Try asking: "What threats are you monitoring?" or "Help"
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
