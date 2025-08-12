
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

const CHAR_SETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

export default function RandomStringGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [output, setOutput] = useState('');
  const { toast } = useToast();

  const handleGenerate = () => {
    let charset = '';
    if (includeLowercase) charset += CHAR_SETS.lowercase;
    if (includeUppercase) charset += CHAR_SETS.uppercase;
    if (includeNumbers) charset += CHAR_SETS.numbers;
    if (includeSymbols) charset += CHAR_SETS.symbols;

    if (charset === '') {
      toast({
        variant: 'destructive',
        title: 'No character set selected',
        description: 'Please select at least one character set to generate the string.',
      });
      return;
    }
    
    if(length <= 0 || length > 1024) {
      toast({
        variant: 'destructive',
        title: 'Invalid Length',
        description: 'Please select a length between 1 and 1024.',
      });
      return;
    }

    let result = '';
    const randomValues = new Uint32Array(length);
    crypto.getRandomValues(randomValues);
    
    for (let i = 0; i < length; i++) {
      result += charset[randomValues[i] % charset.length];
    }
    
    setOutput(result);
  };
  
  useState(() => {
    handleGenerate();
  });

  return (
    <ToolContainer toolId="random-string-generator">
        <div className="flex flex-col gap-6">
            <div className="grid gap-2">
                <Label>Generated String</Label>
                <Input
                    placeholder="Your random string will appear here"
                    value={output}
                    readOnly
                    className="bg-muted/50 font-code"
                />
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
                <div className="grid gap-2">
                    <Label htmlFor="length">Length</Label>
                    <Input id="length" type="number" value={length} onChange={(e) => setLength(parseInt(e.target.value, 10))} min="1" max="1024" />
                </div>
                <div className="flex items-center space-x-2 pb-2">
                    <Checkbox id="uppercase" checked={includeUppercase} onCheckedChange={(c) => setIncludeUppercase(c as boolean)} />
                    <Label htmlFor="uppercase">Uppercase</Label>
                </div>
                <div className="flex items-center space-x-2 pb-2">
                    <Checkbox id="lowercase" checked={includeLowercase} onCheckedChange={(c) => setIncludeLowercase(c as boolean)} />
                    <Label htmlFor="lowercase">Lowercase</Label>
                </div>
                <div className="flex items-center space-x-2 pb-2">
                    <Checkbox id="numbers" checked={includeNumbers} onCheckedChange={(c) => setIncludeNumbers(c as boolean)} />
                    <Label htmlFor="numbers">Numbers</Label>
                </div>
                <div className="flex items-center space-x-2 pb-2">
                    <Checkbox id="symbols" checked={includeSymbols} onCheckedChange={(c) => setIncludeSymbols(c as boolean)} />
                    <Label htmlFor="symbols">Symbols</Label>
                </div>
            </div>
             <div className="flex flex-col sm:flex-row gap-4 items-center">
                <Button onClick={handleGenerate}>Generate String</Button>
            </div>
        </div>
    </ToolContainer>
  );
}
