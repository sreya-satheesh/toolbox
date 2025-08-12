'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const LOREM_IPSUM_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

function generateLoremIpsum(paragraphs: number): string {
  if (paragraphs <= 0) return '';
  const paraArray = Array(paragraphs).fill(LOREM_IPSUM_TEXT);
  return paraArray.join('\n\n');
}

export default function LoremIpsumGenerator() {
  const [paragraphs, setParagraphs] = useState(3);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    if (paragraphs > 100) {
        toast({
            variant: 'destructive',
            title: 'Too many paragraphs',
            description: 'Please enter a number less than or equal to 100.',
        });
        return;
    }
    const text = generateLoremIpsum(paragraphs);
    setOutput(text);
  };
  
  useState(() => {
    setOutput(generateLoremIpsum(3));
  });

  return (
    <ToolContainer toolId="lorem-ipsum-generator">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className='flex items-center gap-2'>
                <Label htmlFor="paragraphs">Paragraphs:</Label>
                <Input
                    id="paragraphs"
                    type="number"
                    value={paragraphs}
                    onChange={(e) => setParagraphs(Number(e.target.value))}
                    className="w-24"
                    min="1"
                    max="100"
                />
            </div>
            <Button onClick={handleGenerate}>Generate Text</Button>
        </div>
        <Textarea
          placeholder="Generated Lorem Ipsum text will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[400px] resize-y bg-muted/50"
        />
      </div>
    </ToolContainer>
  );
}
