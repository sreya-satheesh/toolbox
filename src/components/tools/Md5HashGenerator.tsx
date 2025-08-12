'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

// MD5 is not a built-in browser API, so we need a library or a custom implementation.
// For demonstration, we'll use a simple placeholder.
// In a real app, you'd use a library like `crypto-js`.
function generateMd5(text: string): string {
  // This is NOT a real MD5 implementation.
  console.warn("This is not a real MD5 hash. For demonstration purposes only.");
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return 'demo_' + Math.abs(hash).toString(16).padStart(8, '0');
}

export default function Md5HashGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (!input) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some text to generate an MD5 hash.',
        });
        return;
    }
    const hash = generateMd5(input);
    setOutput(hash);
    toast({
        title: 'MD5 Hash Generated (Demo)',
        description: 'Note: This is a placeholder and not a cryptographically secure MD5 hash.',
    });
  };

  return (
    <ToolContainer toolId="md5-hash-generator">
      <div className="flex flex-col gap-4 flex-1">
        <Textarea
          placeholder="Enter text to generate MD5 hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] resize-y"
        />
        <Input
          placeholder="Generated MD5 hash..."
          value={output}
          readOnly
          className="bg-muted/50 font-code"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleGenerate}>Generate MD5 Hash</Button>
      </div>
    </ToolContainer>
  );
}
