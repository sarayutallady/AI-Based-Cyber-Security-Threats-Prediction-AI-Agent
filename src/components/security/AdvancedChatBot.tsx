import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Bot, User, Download, Sparkles, TrendingUp, Shield, Activity, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'normal' | 'analysis' | 'alert';
}

const suggestedQuestions = [
  { icon: Shield, text: 'Analyze current threats', category: 'analysis' },
  { icon: TrendingUp, text: 'Show system metrics', category: 'status' },
  { icon: Activity, text: 'ML model performance', category: 'ml' },
  { icon: AlertTriangle, text: 'Critical alerts', category: 'alerts' },
];

const predefinedResponses: Record<string, { text: string; type?: 'normal' | 'analysis' | 'alert' }> = {
  hello: {
    text: "👋 Hello! I'm your **Advanced AI Cybersecurity Assistant**.\n\nI can help you with:\n🛡️ Real-time threat analysis\n📊 System performance metrics\n🤖 ML model insights\n⚡ Quick actions and commands\n\nTry asking me anything or use the suggested questions below!",
    type: 'normal'
  },
  analyze: {
    text: "🔍 **Threat Analysis Report**\n\n**Current Status:**\n• Active Threats: 12 locations\n• Critical: 3 (New York, Moscow, Dubai)\n• High Priority: 6 locations\n• Total Incidents (24h): 9,684\n\n**Top Threats:**\n1. DDoS Attacks - 1,247 incidents\n2. APT Attacks - 1,523 incidents\n3. Zero-Day Exploits - 1,089 incidents\n\n**Recommendation:** Immediate attention required for critical zones. Enable enhanced monitoring for high-priority regions.",
    type: 'analysis'
  },
  metrics: {
    text: "📊 **System Performance Metrics**\n\n**Detection System:**\n• Accuracy: 94.2%\n• Response Time: 1.2s avg\n• False Positive Rate: 3.1%\n\n**ML Models:**\n• Random Forest: 96.1% accuracy\n• Neural Network: 93.8% accuracy\n• SVM: 92.5% accuracy\n\n**Network Status:**\n• Bandwidth: 2.4 Gbps\n• Active Connections: 1,247\n• VPN Status: Connected\n\n✅ All systems operational",
    type: 'analysis'
  },
  alerts: {
    text: "🚨 **Critical Alerts**\n\n**URGENT - 3 Critical Threats Detected:**\n\n1. **New York, USA**\n   Type: DDoS Attack\n   Severity: CRITICAL\n   Incidents: 1,247\n   Action: Mitigation protocols activated\n\n2. **Moscow, Russia**\n   Type: APT Attack\n   Severity: CRITICAL\n   Incidents: 1,523\n   Action: Enhanced monitoring enabled\n\n3. **Dubai, UAE**\n   Type: Zero-Day Exploit\n   Severity: CRITICAL\n   Incidents: 1,089\n   Action: Security team notified\n\n⚠️ Immediate response recommended",
    type: 'alert'
  },
  ddos: {
    text: "🌐 **DDoS Attack Analysis**\n\nA Distributed Denial of Service (DDoS) attack overwhelms systems with traffic from multiple sources.\n\n**Detection Methods:**\n• Traffic pattern analysis\n• Anomaly detection algorithms\n• Real-time bandwidth monitoring\n\n**Current Status:**\n• Active DDoS: New York (1,247 incidents)\n• Mitigation: Auto-scaling enabled\n• Protection: Rate limiting active\n\n**Recommendation:** Monitor traffic patterns and enable CDN protection.",
    type: 'analysis'
  },
  malware: {
    text: "🦠 **Malware Threat Intelligence**\n\nMalware is malicious software designed to harm or exploit systems.\n\n**Detection Capabilities:**\n• Behavioral analysis\n• Signature-based detection\n• Machine learning classification\n• Sandbox execution\n\n**Current Detections:**\n• London: 892 malware samples\n• Classification: Trojans, Worms, Spyware\n• Quarantine: 98.5% success rate\n\n**Protection Status:** ✅ Active",
    type: 'analysis'
  },
  ml: {
    text: "🤖 **Machine Learning Models**\n\n**Active Models:**\n\n1. **Random Forest Classifier**\n   • Accuracy: 96.1%\n   • Training: 50,000 samples\n   • Features: 127 parameters\n\n2. **Deep Neural Network**\n   • Accuracy: 93.8%\n   • Layers: 8 hidden layers\n   • Neurons: 2,048 total\n\n3. **Support Vector Machine**\n   • Accuracy: 92.5%\n   • Kernel: RBF\n   • Optimization: Grid search\n\n**Performance:** All models performing above 92% accuracy threshold.",
    type: 'analysis'
  },
  help: {
    text: "💡 **Available Commands**\n\n**Analysis:**\n• 'analyze threats' - Current threat analysis\n• 'show metrics' - System performance\n• 'ml performance' - Model statistics\n\n**Threats:**\n• 'ddos' - DDoS attack info\n• 'malware' - Malware analysis\n• 'phishing' - Phishing detection\n• 'ransomware' - Ransomware info\n\n**System:**\n• 'status' - System health\n• 'alerts' - Critical alerts\n• 'network' - Network status\n• 'export' - Download chat history\n\nTry the suggested questions below for quick access!",
    type: 'normal'
  },
  default: {
    text: "I understand you're asking about cybersecurity. Here are some things I can help with:\n\n🔍 **Quick Actions:**\n• Analyze current threats\n• Check system status\n• View ML model performance\n• Review critical alerts\n\nTry clicking one of the suggested questions below, or ask me something specific!",
    type: 'normal'
  },
};

const getResponse = (userMessage: string): { text: string; type?: 'normal' | 'analysis' | 'alert' } => {
  const message = userMessage.toLowerCase().trim();
  
  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return predefinedResponses.hello;
  }
  if (message.includes('analyze') || message.includes('analysis') || message.includes('current threat')) {
    return predefinedResponses.analyze;
  }
  if (message.includes('metric') || message.includes('performance') || message.includes('show system')) {
    return predefinedResponses.metrics;
  }
  if (message.includes('alert') || message.includes('critical') || message.includes('urgent')) {
    return predefinedResponses.alerts;
  }
  if (message.includes('ddos')) {
    return predefinedResponses.ddos;
  }
  if (message.includes('malware') || message.includes('virus')) {
    return predefinedResponses.malware;
  }
  if (message.includes('ml') || message.includes('machine learning') || message.includes('model')) {
    return predefinedResponses.ml;
  }
  if (message.includes('help') || message.includes('command')) {
    return predefinedResponses.help;
  }
  
  return predefinedResponses.default;
};

export default function AdvancedChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "👋 Hello! I'm your **Advanced AI Cybersecurity Assistant**. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'normal',
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
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
  }, [messages, isTyping]);

  // Handle ESC key to close chatbot
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen]);

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date(),
      type: 'normal',
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      const response = getResponse(textToSend);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        type: response.type || 'normal',
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestedQuestion = (question: string) => {
    handleSendMessage(question);
  };

  const handleExportChat = () => {
    const chatHistory = messages
      .map((msg) => `[${msg.timestamp.toLocaleString()}] ${msg.sender === 'user' ? 'You' : 'AI Assistant'}: ${msg.text}`)
      .join('\n\n');
    
    const blob = new Blob([chatHistory], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-history-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Chat history exported successfully!');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (text: string) => {
    // Simple markdown-like rendering
    const parts = text.split(/(\*\*.*?\*\*|\n)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part === '\n') {
        return <br key={index} />;
      }
      return <span key={index}>{part}</span>;
    });
  };

  return (
    <>
      {/* Floating Chat Button with Pulse Animation */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50">
          <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-20" />
          <Button
            onClick={() => setIsOpen(true)}
            className="relative h-16 w-16 rounded-full shadow-2xl hover:shadow-primary/50 transition-all hover:scale-110"
            size="icon"
          >
            <MessageCircle className="h-7 w-7" />
            <Sparkles className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-pulse" />
          </Button>
        </div>
      )}

      {/* Advanced Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-[420px] h-[680px] shadow-2xl z-50 flex flex-col bg-card/95 backdrop-blur-xl border-2 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <div className="relative">
                <Bot className="h-5 w-5 text-primary" />
                <div className="absolute -bottom-0.5 -right-0.5 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
              <span>AI Security Assistant</span>
              <Badge variant="secondary" className="text-xs">Advanced</Badge>
            </CardTitle>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleExportChat}
                className="h-8 w-8 hover:bg-primary/10"
                title="Export chat history"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                title="Close chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
            <ScrollArea ref={scrollAreaRef} className="h-[400px] p-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
                      message.sender === 'user' ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {message.sender === 'bot' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        'max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-md',
                        message.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : message.type === 'analysis'
                            ? 'bg-blue-500/10 text-foreground border border-blue-500/20'
                            : message.type === 'alert'
                              ? 'bg-destructive/10 text-foreground border border-destructive/20'
                              : 'bg-muted text-foreground'
                      )}
                    >
                      <div className="whitespace-pre-wrap break-words leading-relaxed">
                        {renderMessage(message.text)}
                      </div>
                      <div
                        className={cn(
                          'text-xs mt-2 flex items-center gap-1',
                          message.sender === 'user'
                            ? 'text-primary-foreground/70'
                            : 'text-muted-foreground'
                        )}
                      >
                        {message.type === 'analysis' && <TrendingUp className="h-3 w-3" />}
                        {message.type === 'alert' && <AlertTriangle className="h-3 w-3" />}
                        {message.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </div>
                    {message.sender === 'user' && (
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
                        <User className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                ))}
                
                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex gap-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center shadow-lg">
                      <Bot className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="bg-muted rounded-2xl px-4 py-3 shadow-md">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="h-2 w-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Suggested Questions */}
            <div className="px-4 py-3 border-t border-border/50 bg-muted/30">
              <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Quick Actions:
              </div>
              <div className="grid grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question.text)}
                    className="justify-start text-xs h-auto py-2 hover:bg-primary/10 hover:border-primary/50 transition-all"
                  >
                    <question.icon className="h-3 w-3 mr-1.5 flex-shrink-0" />
                    <span className="truncate">{question.text}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border/50 bg-background/50">
              <div className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about threats, status, or type 'help'..."
                  className="flex-1 bg-background"
                  disabled={isTyping}
                />
                <Button 
                  onClick={() => handleSendMessage()} 
                  size="icon"
                  disabled={isTyping || !inputValue.trim()}
                  className="shadow-lg hover:shadow-primary/50 transition-all"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
