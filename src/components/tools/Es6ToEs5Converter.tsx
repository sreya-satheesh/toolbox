'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Basic transpilation for common ES6 features. This is a simplified educational example.
function transpileEs6ToEs5(code: string): string {
  if (!code) return '';
  try {
    let transpiledCode = code;

    // Convert const and let to var
    transpiledCode = transpiledCode.replace(/\b(const|let)\b/g, 'var');

    // Convert basic arrow functions
    // Case 1: (a, b) => { ... }
    // Case 2: a => { ... }
    // Case 3: a => a + 1
    // Case 4: (a, b) => a + b
    transpiledCode = transpiledCode.replace(/([^\(]|^)(\w+)\s*=>\s*({?.*)}?/g, "function($2) $3")
    transpiledCode = transpiledCode.replace(/(\(.*\))\s*=>\s*({?.*)}?/g, "function$1 $2")
    
    // Convert template literals
    transpiledCode = transpiledCode.replace(/`([^`]*)`/g, (match, content) => {
      const parts = content.split(/\$\{(.*?)\}/g);
      const strings = parts.filter((_, i) => i % 2 === 0).map(s => `'${s.replace(/'/g, "\\'")}'`);
      const expressions = parts.filter((_, i) => i % 2 !== 0);
      
      if (expressions.length === 0) {
        return strings[0] || "''";
      }

      let result = [];
      for (let i = 0; i < strings.length; i++) {
        if(strings[i] !== "''") result.push(strings[i]);
        if (expressions[i]) result.push(expressions[i]);
      }
      return result.join(' + ');
    });


    return transpiledCode;
  } catch (error) {
    console.error("Transpilation Error:", error);
    return "// Failed to transpile. See console for details.";
  }
}


export default function Es6ToEs5Converter() {
  const [input, setInput] = useState('const greet = (name) => `Hello, ${name}!`;');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleConvert = () => {
     if (!input) {
      toast({
        variant: 'destructive',
        title: 'Input is empty',
        description: 'Please enter some ES6+ JavaScript to convert.',
      });
      return;
    }
    const transpiled = transpileEs6ToEs5(input);
    setOutput(transpiled);
    toast({
      title: 'Transpiled to ES5',
      description: 'Note: This is a basic transpiler for demonstration.',
    });
  };

  return (
    <ToolContainer toolId="es6-to-es5-converter">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your ES6+ JavaScript code here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="ES5 code will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
       <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleConvert}>Convert to ES5</Button>
      </div>
    </ToolContainer>
  );
}
