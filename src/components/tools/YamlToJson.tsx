'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import YAML from 'yaml';

export default function YamlToJson() {
  const [input, setInput] = useState(
`people:
  - name: Alice
    age: 30
    city: New York
  - name: Bob
    age: 25
    city: Los Angeles`
  );
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
    if (!input.trim()) {
        toast({
            variant: 'destructive',
            title: 'Input is empty',
            description: 'Please enter some YAML data to convert.',
        });
        return;
    }
    
    try {
        const jsonObj = YAML.parse(input);
        setOutput(JSON.stringify(jsonObj, null, 2));
    } catch(error: any) {
        toast({
            variant: 'destructive',
            title: 'Invalid YAML',
            description: error.message || 'The provided string could not be parsed as YAML.',
        });
        setOutput('');
    }
  };

  useState(() => {
    handleConvert();
  });

  return (
    <ToolContainer toolId="yaml-to-json">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your YAML data here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="JSON output will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex items-center">
        <Button onClick={handleConvert}>Convert to JSON</Button>
      </div>
    </ToolContainer>
  );
}
