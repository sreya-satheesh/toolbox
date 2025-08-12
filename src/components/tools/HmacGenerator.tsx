'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type HmacAlgorithm = 'SHA-1' | 'SHA-256' | 'SHA-512';

async function generateHmac(algorithm: HmacAlgorithm, text: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const textData = encoder.encode(text);
  
  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: algorithm },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, textData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function HmacGenerator() {
  const [input, setInput] = useState('');
  const [secret, setSecret] = useState('');
  const [output, setOutput] = useState('');
  const [algorithm, setAlgorithm] = useState<HmacAlgorithm>('SHA-256');
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!input || !secret) {
        toast({
            variant: 'destructive',
            title: 'Input or Secret is empty',
            description: 'Please provide both text and a secret key to generate HMAC.',
        });
        return;
    }
    const hash = await generateHmac(algorithm, input, secret);
    setOutput(hash);
  };

  return (
    <ToolContainer toolId="hmac-generator">
      <div className="flex flex-col gap-4 flex-1">
        <div className="grid gap-2">
            <Label htmlFor="text-input">Text</Label>
            <Textarea
              id="text-input"
              placeholder="Enter text to sign..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="min-h-[150px] resize-y"
            />
        </div>
        <div className="grid gap-2">
            <Label htmlFor="secret-key">Secret Key</Label>
            <Input
              id="secret-key"
              placeholder="Enter your secret key"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
            />
        </div>
        <div className="grid gap-2">
            <Label>Generated HMAC</Label>
            <Input
              placeholder="Generated HMAC..."
              value={output}
              readOnly
              className="bg-muted/50 font-code"
            />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleGenerate}>Generate HMAC</Button>
        <Select value={algorithm} onValueChange={(value: HmacAlgorithm) => setAlgorithm(value)}>
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
