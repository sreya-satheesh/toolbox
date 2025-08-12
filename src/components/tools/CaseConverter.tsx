'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CaseConverter() {
  const [input, setInput] = useState('');

  const toSentenceCase = () => {
    setInput(prev => 
      prev.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase())
    );
  };
  
  const toTitleCase = () => {
    setInput(prev =>
      prev.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase())
    );
  };

  return (
    <ToolContainer toolId="case-converter">
      <div className="flex-1">
        <Textarea
          placeholder="Enter your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setInput(prev => prev.toUpperCase())}>UPPERCASE</Button>
        <Button onClick={() => setInput(prev => prev.toLowerCase())}>lowercase</Button>
        <Button onClick={toTitleCase}>Title Case</Button>
        <Button onClick={toSentenceCase}>Sentence case</Button>
      </div>
    </ToolContainer>
  );
}
