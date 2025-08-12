
'use client';

import { useState, useEffect } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { format, toZonedTime } from 'date-fns-tz';

export default function TimezoneConverter() {
  const [timezones, setTimezones] = useState<string[]>([]);
  const [fromTz, setFromTz] = useState('');
  const [toTz, setToTz] = useState('');
  const [dateTime, setDateTime] = useState('');
  const [convertedDateTime, setConvertedDateTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Intl.supportedValuesOf is only available client-side
    const supportedTimezones = Intl.supportedValuesOf('timeZone');
    setTimezones(supportedTimezones);
    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setFromTz(userTz);
    // A common default target timezone
    setToTz(userTz === 'America/New_York' ? 'Europe/London' : 'America/New_York');
    setDateTime(new Date().toISOString().slice(0, 16));
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
        handleConvert();
    }
  }, [dateTime, fromTz, toTz, isClient]);

  const handleConvert = () => {
    if (!dateTime || !fromTz || !toTz) return;
    
    try {
        const date = new Date(dateTime);
        const zonedTime = toZonedTime(date, toTz);
        const formatted = format(zonedTime, "yyyy-MM-dd'T'HH:mm", { timeZone: toTz });
        setConvertedDateTime(formatted);
    } catch(e) {
        console.error("Timezone conversion error", e)
        setConvertedDateTime('Invalid Date');
    }
  };

  const renderSelect = (label: string, value: string, setValue: (v: string) => void) => (
    <div className="grid gap-1.5">
        <Label>{label}</Label>
        <Select value={value} onValueChange={setValue}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select timezone..." />
            </SelectTrigger>
            <SelectContent className="max-h-60">
                {timezones.map(tz => <SelectItem key={tz} value={tz}>{tz.replace(/_/g, ' ')}</SelectItem>)}
            </SelectContent>
        </Select>
    </div>
  );

  return (
    <ToolContainer toolId="timezone-converter">
      <div className="grid md:grid-cols-2 gap-6 items-start">
        <Card>
            <CardContent className="p-4 space-y-4">
                <div className="grid gap-1.5">
                    <Label htmlFor="datetime-input">Date & Time</Label>
                    <Input
                        id="datetime-input"
                        type="datetime-local"
                        value={dateTime}
                        onChange={(e) => setDateTime(e.target.value)}
                    />
                </div>
                {isClient && renderSelect('From Timezone', fromTz, setFromTz)}
            </CardContent>
        </Card>
        
        <Card>
            <CardContent className="p-4 space-y-4">
                 <div className="grid gap-1.5">
                    <Label htmlFor="converted-datetime">Converted Date & Time</Label>
                    <Input
                        id="converted-datetime"
                        type="datetime-local"
                        value={convertedDateTime}
                        readOnly
                        className="bg-muted/50"
                    />
                </div>
                {isClient && renderSelect('To Timezone', toTz, setToTz)}
            </CardContent>
        </Card>
      </div>
    </ToolContainer>
  );
}
