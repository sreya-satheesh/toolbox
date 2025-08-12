
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Terminal, ShieldAlert } from 'lucide-react';

function tryParseJson(str: string) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch (e) {
    return 'Invalid JSON';
  }
}

export default function JwtDecoder() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState('');

  const handleTokenChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newToken = e.target.value;
    setToken(newToken);
    setError('');
    setHeader('');
    setPayload('');

    if (!newToken) {
      return;
    }

    try {
      const parts = newToken.split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT: A JWT must have 3 parts separated by dots.');
        return;
      }
      const [headerPart, payloadPart] = parts;
      setHeader(tryParseJson(atob(headerPart.replace(/_/g, '/').replace(/-/g, '+'))));
      setPayload(tryParseJson(atob(payloadPart.replace(/_/g, '/').replace(/-/g, '+'))));
    } catch (err) {
      setError('Invalid JWT: Could not decode token. Check if it is a valid Base64Url encoded string.');
    }
  };
  
  // Trigger initial decode
  useState(() => {
    handleTokenChange({ target: { value: token } } as React.ChangeEvent<HTMLTextAreaElement>);
  });

  return (
    <ToolContainer toolId="jwt-decoder">
      <div className="flex flex-col gap-4 flex-1">
        <div className="grid lg:grid-cols-2 gap-4">
          <div className="flex flex-col gap-4">
            <label className="font-medium" htmlFor="jwt-input">Encoded JWT</label>
            <Textarea
              id="jwt-input"
              placeholder="Paste your JWT here..."
              value={token}
              onChange={handleTokenChange}
              className="h-full min-h-[200px] resize-y font-code"
            />
          </div>
          <div className="flex flex-col gap-4">
            <label className="font-medium">Decoded</label>
            <div className="space-y-4">
              <pre className="p-4 rounded-md bg-muted/50 text-sm overflow-auto">
                <h4 className="font-semibold text-primary mb-2">Header</h4>
                <code className="font-code">{header}</code>
              </pre>
              <pre className="p-4 rounded-md bg-muted/50 text-sm overflow-auto">
                 <h4 className="font-semibold text-primary mb-2">Payload</h4>
                <code className="font-code">{payload}</code>
              </pre>
            </div>
          </div>
        </div>
        {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        <Alert variant="destructive">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Security Warning</AlertTitle>
            <AlertDescription>
                This tool only decodes the JWT. It does not verify the signature against the secret key. A decoded token should never be trusted without signature verification.
            </AlertDescription>
        </Alert>
      </div>
    </ToolContainer>
  );
}
