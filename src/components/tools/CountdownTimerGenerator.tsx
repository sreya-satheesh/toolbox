
'use client';

import { useState, useEffect } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function CountdownTimerGenerator() {
  const [targetDate, setTargetDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 16);
  });
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !targetDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const target = new Date(targetDate);
      const difference = target.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        clearInterval(interval);
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((difference / 1000 / 60) % 60);
      const seconds = Math.floor((difference / 1000) % 60);
      setTimeLeft({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, isClient]);

  const handleSetTargetDate = () => {
    if (!targetDate) {
        toast({
            variant: 'destructive',
            title: 'Invalid Date',
            description: 'Please select a valid date and time.',
        });
        return;
    }
    const target = new Date(targetDate);
    if (target.getTime() <= new Date().getTime()) {
        toast({
            variant: 'destructive',
            title: 'Date in the past',
            description: 'Please select a future date and time.',
        });
        return;
    }
  }

  return (
    <ToolContainer toolId="countdown-timer-generator">
      <div className="flex flex-col items-center gap-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Set Target Date & Time</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-end gap-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="datetime">Target Date</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {isClient && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center w-full max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">{String(timeLeft.days).padStart(2, '0')}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Days</p></CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Hours</p></CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Minutes</p></CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-4xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</CardTitle>
                    </CardHeader>
                    <CardContent><p className="text-muted-foreground">Seconds</p></CardContent>
                </Card>
            </div>
        )}

      </div>
    </ToolContainer>
  );
}
