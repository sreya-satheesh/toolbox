'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function RegexTester() {
  const [pattern, setPattern] = useState('\\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}\\b');
  const [flags, setFlags] = useState('gi');
  const [testString, setTestString] = useState('Contact us at support@example.com or for sales, try sales@example.org.');
  const [error, setError] = useState<string | null>(null);

  const { matches, highlightedText } = useMemo(() => {
    if (!pattern) {
      setError(null);
      return { matches: [], highlightedText: testString };
    }

    try {
      const regex = new RegExp(pattern, flags);
      setError(null);
      
      const currentMatches = Array.from(testString.matchAll(regex));
      
      const textWithHighlights = testString.replace(regex, (match) => `<mark>${match}</mark>`);

      return { matches: currentMatches, highlightedText: textWithHighlights };
    } catch (e: any) {
      setError(e.message);
      return { matches: [], highlightedText: testString };
    }
  }, [pattern, flags, testString]);

  return (
    <ToolContainer toolId="regex-tester">
      <div className="flex flex-col gap-4 flex-1">
        <div className="grid sm:grid-cols-1 md:grid-cols-[1fr_auto] gap-2">
          <div className="grid gap-2">
            <Label htmlFor="regex-pattern">Regular Expression</Label>
            <Input
              id="regex-pattern"
              placeholder="Enter your pattern here"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="font-code"
            />
          </div>
           <div className="grid gap-2">
            <Label htmlFor="regex-flags">Flags</Label>
            <Input
              id="regex-flags"
              placeholder="e.g., gi"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="font-code w-full md:w-24"
            />
          </div>
        </div>

        <div className="grid gap-2">
            <Label htmlFor="test-string">Test String</Label>
            <Textarea
                id="test-string"
                placeholder="Enter the string to test your regex against"
                value={testString}
                onChange={(e) => setTestString(e.target.value)}
                className="h-48 resize-y font-code"
            />
        </div>
        
        {error && (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Invalid Regular Expression</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        <div className="grid gap-2">
            <Label>Result</Label>
            <div className="p-4 border rounded-md bg-muted/50 min-h-48">
                <p 
                    className="whitespace-pre-wrap font-code"
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                />
            </div>
        </div>

        <div className="grid gap-2">
            <Label>Matches ({matches.length})</Label>
             <div className="p-4 border rounded-md bg-muted/50">
                {matches.length > 0 ? (
                    <ul className="font-code text-sm space-y-2">
                        {matches.map((match, i) => (
                            <li key={i} className="border-b border-border pb-2">
                                <strong>Match {i + 1}:</strong> {match[0]}
                                {match.length > 1 && (
                                    <ul className="pl-4 mt-1 space-y-1 text-xs">
                                        {match.slice(1).map((group, j) => (
                                            <li key={j}>
                                                <strong>Group {j + 1}:</strong> {group || 'undefined'}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-sm">No matches found.</p>
                )}
             </div>
        </div>
      </div>
    </ToolContainer>
  );
}
