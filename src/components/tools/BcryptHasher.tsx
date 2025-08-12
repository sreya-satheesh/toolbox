
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import * as bcrypt from 'bcryptjs';
import { useRateLimiter } from '@/hooks/use-rate-limiter';

export default function BcryptHasher() {
  const [password, setPassword] = useState('');
  const [saltRounds, setSaltRounds] = useState(10);
  const [hashedPassword, setHashedPassword] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const { toast } = useToast();
  
  const { isLimited, check: checkRateLimit } = useRateLimiter({ maxCalls: 5, timeWindow: 10000 }); // 5 calls per 10 seconds

  const handleHash = () => {
    if (isLimited) {
        toast({
            variant: 'destructive',
            title: 'Rate Limit Exceeded',
            description: 'You are doing that too fast. Please wait a moment.',
        });
        return;
    }

    if (!checkRateLimit()) {
        toast({
            variant: 'destructive',
            title: 'Rate Limit Exceeded',
            description: 'You are doing that too fast. Please wait a moment.',
        });
        return;
    }

    if (!password) {
      toast({
        variant: 'destructive',
        title: 'Password is empty',
        description: 'Please enter a password to hash.',
      });
      return;
    }
    setIsHashing(true);
    // Use setTimeout to avoid blocking the main thread for too long
    setTimeout(() => {
        try {
            const salt = bcrypt.genSaltSync(saltRounds);
            const hash = bcrypt.hashSync(password, salt);
            setHashedPassword(hash);
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Hashing Error',
                description: error.message || 'An unknown error occurred during hashing.',
            });
        } finally {
            setIsHashing(false);
        }
    }, 50);
  };

  return (
    <ToolContainer toolId="bcrypt-hasher">
      <div className="flex flex-col gap-4">
        <div className="grid gap-2">
            <Label htmlFor="password-input">Password to Hash</Label>
            <Input
                id="password-input"
                type="text"
                placeholder="Enter your password here"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        <div className="grid gap-2">
            <Label htmlFor="salt-rounds">Salt Rounds (Cost Factor): {saltRounds}</Label>
            <Slider
                id="salt-rounds"
                min={4}
                max={15}
                step={1}
                value={[saltRounds]}
                onValueChange={(value) => setSaltRounds(value[0])}
            />
            <p className="text-xs text-muted-foreground">
                Higher values are more secure but slower. 10-12 is a good balance.
            </p>
        </div>

        <Button onClick={handleHash} disabled={isHashing || isLimited} className="w-full sm:w-auto">
            {isHashing ? 'Hashing...' : isLimited ? 'Rate Limited' : 'Generate Bcrypt Hash'}
        </Button>

        {hashedPassword && (
          <div className="grid gap-2">
              <Label>Generated Hash</Label>
              <Textarea
                  placeholder="Your bcrypt hash will appear here"
                  value={hashedPassword}
                  readOnly
                  className="bg-muted/50 font-code min-h-[150px] resize-y"
              />
          </div>
        )}
      </div>
    </ToolContainer>
  );
}
