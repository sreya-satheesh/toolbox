'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

// Basic obfuscation function as a proof of concept
function obfuscateJs(code: string): string {
  try {
    // 1. Find all string literals (e.g., "hello" or 'world')
    const stringLiterals = code.match(/(["'])(?:(?=(\\?))\2.)*?\1/g) || [];
    const uniqueStrings = [...new Set(stringLiterals)];
    
    if (uniqueStrings.length === 0) return code;

    const stringMap: { [key: string]: string } = {};
    const hexArray: string[] = [];

    // 2. Create a mapping of original strings to hex variable names
    uniqueStrings.forEach((str, i) => {
      const hexName = `_0x${i.toString(16)}`;
      stringMap[str] = hexName;
      // Store the original string (without quotes) for the decoder array
      hexArray.push(str.slice(1, -1));
    });

    // 3. Create the decoder function and hex array
    const decoderName = `_0x${Math.random().toString(16).slice(2, 8)}`;
    const hexArrayName = `_0x${Math.random().toString(16).slice(2, 8)}`;

    const decoderSetup = `var ${hexArrayName} = ['${hexArray.map(s => s.replace(/'/g, "\\'")).join("','")}'];\nvar ${decoderName} = function(i) { return ${hexArrayName}[i]; };\n`;

    // 4. Replace all string literals in the original code with calls to the decoder
    let obfuscatedCode = code;
    for (const str of uniqueStrings) {
       const index = uniqueStrings.indexOf(str);
       // Use a regex to replace all occurrences of this string
       obfuscatedCode = obfuscatedCode.replace(new RegExp(str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), `${decoderName}(${index})`);
    }

    return decoderSetup + obfuscatedCode;
  } catch (error) {
    console.error("Obfuscation error:", error);
    return "// Obfuscation failed. Please check the console for details.";
  }
}


export default function JsObfuscator() {
  const [input, setInput] = useState('function greet() {\n  var message = "Hello, World!";\n  console.log(message);\n}');
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleObfuscate = () => {
    if (!input) {
      toast({
        variant: 'destructive',
        title: 'Input is empty',
        description: 'Please enter some JavaScript to obfuscate.',
      });
      return;
    }
    const obfuscated = obfuscateJs(input);
    setOutput(obfuscated);
    toast({
      title: 'JavaScript Obfuscated',
      description: 'Strings have been encoded to make the code harder to read.',
    });
  };

  return (
    <ToolContainer toolId="js-obfuscator">
      <div className="grid md:grid-cols-2 gap-4 flex-1">
        <Textarea
          placeholder="Paste your JavaScript code here to obfuscate..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="h-full min-h-[300px] resize-none font-code"
        />
        <Textarea
          placeholder="Obfuscated code will appear here..."
          value={output}
          readOnly
          className="h-full min-h-[300px] resize-none font-code bg-muted/50"
        />
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleObfuscate} className="bg-accent hover:bg-accent/90">Obfuscate JS</Button>
      </div>
    </ToolContainer>
  );
}
