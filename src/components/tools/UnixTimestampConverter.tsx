
'use client';

import { useState, useEffect } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { format, fromUnixTime } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

export default function UnixTimestampConverter() {
  const [timestamp, setTimestamp] = useState('');
  const [dateTime, setDateTime] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setCurrentTimestamp();
  }, []);

  useEffect(() => {
    if (timestamp) {
      handleTimestampChange(timestamp);
    }
  }, [timestamp]);

  const setCurrentTimestamp = () => {
    const nowInSeconds = Math.floor(Date.now() / 1000).toString();
    setTimestamp(nowInSeconds);
  };

  const handleTimestampChange = (ts: string) => {
    setTimestamp(ts);
    if (!ts || !/^\d+$/.test(ts)) {
      setDateTime('');
      return;
    }

    try {
      const tsNumber = parseInt(ts, 10);
      // If ts is likely in milliseconds, convert to seconds for fromUnixTime
      const date = fromUnixTime(tsNumber > 10000000000 ? tsNumber / 1000 : tsNumber);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      setDateTime(format(date, "yyyy-MM-dd'T'HH:mm:ss"));
    } catch (error) {
        setDateTime('Invalid Timestamp');
    }
  };

  const handleDateTimeChange = (dt: string) => {
    setDateTime(dt);
    if (!dt) {
      setTimestamp('');
      return;
    }
    
    try {
      const date = new Date(dt);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      const ts = Math.floor(date.getTime() / 1000);
      setTimestamp(ts.toString());
    } catch (error) {
        setTimestamp('Invalid Date');
    }
  };

  const getHumanReadableDate = () => {
    if (!dateTime || dateTime === 'Invalid Timestamp') return { local: 'N/A', utc: 'N/A' };
    try {
      const date = new Date(dateTime);
      return {
        local: format(date, 'PPP ppp'),
        utc: new Date(date.getTime() + date.getTimezoneOffset() * 60000).toUTCString(),
      };
    } catch (e) {
      return { local: 'Invalid Date', utc: 'Invalid Date' };
    }
  };

  const humanReadable = getHumanReadableDate();

  return (
    <ToolContainer toolId="unix-timestamp-converter">
      <div className="flex flex-col gap-6 items-center">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-4 space-y-2">
              <Label htmlFor="timestamp">Unix Timestamp (seconds)</Label>
              <Input
                id="timestamp"
                value={timestamp}
                onChange={(e) => handleTimestampChange(e.target.value)}
                placeholder="e.g., 1672531200"
              />
              <Button variant="outline" size="sm" onClick={setCurrentTimestamp} className="w-full">
                Use Current Timestamp
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 space-y-2">
              <Label htmlFor="datetime">Date & Time</Label>
              <Input
                id="datetime"
                type="datetime-local"
                step="1"
                value={dateTime}
                onChange={(e) => handleDateTimeChange(e.target.value)}
              />
            </CardContent>
          </Card>
        </div>
        <Card className="w-full max-w-4xl">
            <CardContent className="p-4 space-y-2">
                 <h3 className="font-semibold">Human-Readable Date</h3>
                 <div className="space-y-1 text-sm">
                    <p><strong className="w-24 inline-block">Your Timezone:</strong> {humanReadable.local}</p>
                    <p><strong className="w-24 inline-block">UTC/GMT:</strong> {humanReadable.utc}</p>
                 </div>
            </CardContent>
        </Card>
      </div>
    </ToolContainer>
  );
}
