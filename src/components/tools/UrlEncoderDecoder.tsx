'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';

export default function UrlEncoderDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isEncoding, setIsEncoding] = useState(true);
  const { toast } = useToast();

  const handleProcess = () => {
    try {
      if (isEncoding) {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Invalid Input',
        description: 'The input string is not a valid URI component.',
      });
      setOutput('');
    }
  };

  return (
    <ToolContainer toolId="url-encoder-decoder">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder={isEncoding ? 'Enter text to URL encode...' : 'Enter URL encoded text to decode...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none"
        />
        <Textarea
          placeholder="Output..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <Button onClick={handleProcess}>
          {isEncoding ? 'Encode URL' : 'Decode URL'}
        </Button>
        <div className="flex items-center space-x-2">
          <Label htmlFor="mode-switch">Decode</Label>
          <Switch
            id="mode-switch"
            checked={isEncoding}
            onCheckedChange={setIsEncoding}
            aria-label="Toggle between URL encoding and decoding"
          />
          <Label htmlFor="mode-switch">Encode</Label>
        </div>
      </div>
    </ToolContainer>
  );
}
