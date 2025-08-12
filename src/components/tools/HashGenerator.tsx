'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';

type HashAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

async function generateHash(algorithm: HashAlgorithm, text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest(algorithm, data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function HashGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState<HashAlgorithm>('SHA-256');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some text to generate a hash.',
        });
        return;
    }
    const hash = await generateHash(algorithm, input);
    setOutput(hash);
  };

  return (
    <ToolContainer toolId="hash-generator">
      <div className="flex flex-col gap-4 flex-1">
        <Textarea
          placeholder="Enter text to hash..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-[200px] resize-y"
        />
        <Input
          placeholder="Generated hash..."
          value={output}
          readOnly
          className="bg-muted/50 font-code"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleGenerate}>Generate Hash</Button>
        <Select value={algorithm} onValueChange={(value: HashAlgorithm) => setAlgorithm(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="SHA-1">SHA-1</SelectItem>
                <SelectItem value="SHA-256">SHA-256</SelectItem>
                <SelectItem value="SHA-512">SHA-512</SelectItem>
            </SelectContent>
        </Select>
      </div>
    </ToolContainer>
  );
}
