'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export default function WordCounter() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => {
    const trimmedInput = input.trim();
    const words = trimmedInput ? trimmedInput.split(/\s+/).filter(Boolean) : [];
    const characters = input.length;
    const lines = input ? input.split(/\r\n|\r|\n/).length : 0;
    return {
      words: words.length,
      characters,
      lines,
    };
  }, [input]);

  return (
    <ToolContainer toolId="word-counter">
      <div className="flex flex-col md:flex-row gap-4 flex-1">
        <Textarea
          placeholder="Enter your text here to count words, characters, and lines..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 h-full min-h-[300px] resize-y"
        />
        <div className="w-full md:w-64">
          <Card>
            <CardContent className="p-4 space-y-3">
              <h3 className="font-semibold text-lg">Statistics</h3>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Words</span>
                <span className="font-bold text-lg">{stats.words}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Characters</span>
                <span className="font-bold text-lg">{stats.characters}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Lines</span>
                <span className="font-bold text-lg">{stats.lines}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
