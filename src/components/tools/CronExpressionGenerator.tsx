
'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const createRange = (size: number, startAt = 0) => [...Array(size).keys()].map(i => i + startAt);

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function CronExpressionGenerator() {
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  
  const { toast } = useToast();

  const cronExpression = useMemo(() => {
    return `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`;
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  const humanReadable = useMemo(() => {
    if (cronExpression === '* * * * *') return 'Every minute';

    let parts = [];
    // Time
    if (hour !== '*' && minute !== '*') {
      parts.push(`at ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
    } else if (hour === '*' && minute !== '*') {
      parts.push(`at minute ${minute}`);
    } else if (hour !== '*' && minute === '*') {
      parts.push(`every minute of hour ${hour}`);
    } else {
      parts.push('Every minute');
    }

    // Date
    if (dayOfMonth !== '*' && month !== '*') {
      parts.push(`on day ${dayOfMonth} of ${MONTHS[parseInt(month)-1]}`);
    } else if (dayOfMonth !== '*' && month === '*') {
      parts.push(`on day ${dayOfMonth}`);
    } else if (dayOfMonth === '*' && month !== '*') {
      parts.push(`in ${MONTHS[parseInt(month)-1]}`);
    }

    // Day of week
    if (dayOfWeek !== '*') {
      parts.push(`and on ${DAYS_OF_WEEK[parseInt(dayOfWeek)]}`);
    }
    
    return parts.join(' ');
  }, [cronExpression]);

  const handleCopy = () => {
    navigator.clipboard.writeText(cronExpression);
    toast({ title: 'Copied!', description: 'Cron expression copied to clipboard.' });
  };

  const createSelect = (label: string, value: string, setValue: (v: string) => void, options: (string | number)[], placeholder: string, names?: string[]) => (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger><SelectValue placeholder={placeholder} /></SelectTrigger>
        <SelectContent>
          <SelectItem value="*">{placeholder}</SelectItem>
          {options.map((opt, i) => <SelectItem key={opt} value={String(opt)}>{names ? `${opt} - ${names[i]}` : String(opt).padStart(2, '0')}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <ToolContainer toolId="cron-expression-generator">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generated Expression</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-2 items-center p-4 bg-muted/50 rounded-lg">
                <code className="font-mono text-lg flex-1">{cronExpression}</code>
                <Button onClick={handleCopy}>Copy</Button>
            </div>
            <p className="mt-2 text-muted-foreground text-sm">{humanReadable}</p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4">
          {createSelect('Minute', minute, setMinute, createRange(60), 'Every Minute')}
          {createSelect('Hour', hour, setHour, createRange(24), 'Every Hour')}
          {createSelect('Day of Month', dayOfMonth, setDayOfMonth, createRange(31, 1), 'Every Day')}
          {createSelect('Month', month, setMonth, createRange(12, 1), 'Every Month', MONTHS)}
          {createSelect('Day of Week', dayOfWeek, setDayOfWeek, createRange(7), 'Every Day of Week', DAYS_OF_WEEK)}
        </div>

        <Card>
            <CardContent className="p-4 text-sm text-muted-foreground">
                <p>The cron expression is made of five fields: minute, hour, day of month, month, and day of week.</p>
            </CardContent>
        </Card>
      </div>
    </ToolContainer>
  );
}
