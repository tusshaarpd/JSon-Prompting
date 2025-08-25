import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Download, Sparkles, Settings, RefreshCw, Check } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { mockConversions } from '../utils/mockData';

const PromptConverter = () => {
  const [textPrompt, setTextPrompt] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');
  const [useOwnKey, setUseOwnKey] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const { toast } = useToast();

  const handleConvert = async () => {
    if (!textPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a text prompt to convert.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Simulate API call with mock data
    setTimeout(() => {
      const mockResult = mockConversions.find(item => 
        item.textPrompt.toLowerCase().includes(textPrompt.toLowerCase().split(' ')[0])
      ) || mockConversions[0];
      
      setJsonOutput(JSON.stringify(mockResult.jsonOutput, null, 2));
      setIsLoading(false);
      
      toast({
        title: "Success",
        description: "Prompt converted to JSON successfully!",
      });
    }, 1500);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "JSON copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const downloadJson = () => {
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted-prompt.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Downloaded!",
      description: "JSON file downloaded successfully.",
    });
  };

  const examplePrompts = [
    "Summarize this research paper in 5 bullet points",
    "Generate a creative story about a robot learning to paint",
    "Analyze customer feedback and extract key insights",
    "Create a social media post for a new product launch"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Emergent Prompt
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Transform your natural language prompts into structured JSON schemas with intelligent parsing and beautiful formatting.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-6">
          {/* Input Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Settings className="h-5 w-5" />
                Text Prompt Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Enter your prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter your natural language prompt here..."
                  value={textPrompt}
                  onChange={(e) => setTextPrompt(e.target.value)}
                  rows={8}
                  className="resize-none border-2 border-gray-200 focus:border-indigo-500 transition-colors"
                />
              </div>
              
              {/* Example Prompts */}
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Quick Examples:</Label>
                <div className="flex flex-wrap gap-2">
                  {examplePrompts.map((example, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors text-xs"
                      onClick={() => setTextPrompt(example)}
                    >
                      {example.length > 30 ? example.substring(0, 30) + '...' : example}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button 
                onClick={handleConvert}
                disabled={isLoading || !textPrompt.trim()}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Converting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Convert to JSON
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-gray-800">
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  JSON Output
                </div>
                {jsonOutput && (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={copyToClipboard}
                      className="hover:bg-green-50 hover:border-green-300 transition-colors"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={downloadJson}
                      className="hover:bg-blue-50 hover:border-blue-300 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {jsonOutput ? (
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm border-2 border-gray-200 max-h-80 font-mono">
                  <code className="text-gray-800">{jsonOutput}</code>
                </pre>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center border-2 border-dashed border-gray-300">
                  <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Your JSON output will appear here after conversion.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Configuration Section */}
        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Settings className="h-5 w-5" />
              Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="model" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="model">Model Settings</TabsTrigger>
                <TabsTrigger value="api">API Configuration</TabsTrigger>
              </TabsList>
              
              <TabsContent value="model" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="model-select">Select LLM Model</Label>
                  <Select value={selectedModel} onValueChange={setSelectedModel}>
                    <SelectTrigger className="border-2 border-gray-200 focus:border-indigo-500">
                      <SelectValue placeholder="Choose a model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gpt-4">GPT-4 (OpenAI)</SelectItem>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo (OpenAI)</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus (Anthropic)</SelectItem>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet (Anthropic)</SelectItem>
                      <SelectItem value="gemini-pro">Gemini Pro (Google)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500">
                    Currently using Emergent LLM Key for seamless access across all models.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="api" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="use-own-key"
                      checked={useOwnKey}
                      onChange={(e) => setUseOwnKey(e.target.checked)}
                      className="rounded border-gray-300"
                    />
                    <Label htmlFor="use-own-key" className="text-sm">
                      Use my own API key instead of Emergent LLM Key
                    </Label>
                  </div>
                  
                  {useOwnKey && (
                    <div className="space-y-2">
                      <Label htmlFor="api-key">API Key</Label>
                      <Input
                        id="api-key"
                        type="password"
                        placeholder="Enter your API key..."
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="border-2 border-gray-200 focus:border-indigo-500"
                      />
                      <p className="text-xs text-gray-500">
                        Your API key will be used securely and not stored permanently.
                      </p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Missing Code component import
const Code = ({ className, ...props }) => (
  <svg
    className={className}
    fill="none"
    height="24"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="2"
    viewBox="0 0 24 24"
    width="24"
    {...props}
  >
    <polyline points="16,18 22,12 16,6" />
    <polyline points="8,6 2,12 8,18" />
  </svg>
);

export default PromptConverter;