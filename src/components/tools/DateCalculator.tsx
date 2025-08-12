
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, add, sub } from 'date-fns';

type Operation = 'add' | 'subtract';
type Unit = 'days' | 'weeks' | 'months' | 'years';

export default function DateCalculator() {
  const [startDate, setStartDate] = useState(new Date());
  const [operation, setOperation] = useState<Operation>('add');
  const [amount, setAmount] = useState(1);
  const [unit, setUnit] = useState<Unit>('days');
  const [resultDate, setResultDate] = useState<Date | null>(null);

  const handleCalculate = () => {
    let newDate;
    const options = { [unit]: amount };

    if (operation === 'add') {
      newDate = add(startDate, options);
    } else {
      newDate = sub(startDate, options);
    }
    setResultDate(newDate);
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    // Check if the date is valid before updating state
    if (!isNaN(date.getTime())) {
      setStartDate(date);
    }
  };

  return (
    <ToolContainer toolId="date-calculator">
      <div className="flex flex-col items-center gap-6">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-6 items-stretch">
            <Card>
                <CardHeader>
                    <CardTitle>Calculation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex flex-col justify-between h-full">
                    <div>
                        <div className="grid gap-1.5">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Input
                            id="start-date"
                            type="date"
                            value={format(startDate, 'yyyy-MM-dd')}
                            onChange={handleStartDateChange}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 mt-4">
                          <Select value={operation} onValueChange={(v: Operation) => setOperation(v)}>
                            <SelectTrigger className="flex-1 min-w-[100px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="add">Add</SelectItem>
                              <SelectItem value="subtract">Subtract</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min="0"
                            className="w-full sm:w-24"
                          />
                          <Select value={unit} onValueChange={(v: Unit) => setUnit(v)}>
                             <SelectTrigger className="flex-1 min-w-[100px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="days">Days</SelectItem>
                              <SelectItem value="weeks">Weeks</SelectItem>
                              <SelectItem value="months">Months</SelectItem>
                              <SelectItem value="years">Years</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                    </div>
                     <Button onClick={handleCalculate} className="w-full mt-4">Calculate</Button>
                </CardContent>
            </Card>

            <Card className="text-center flex flex-col justify-center bg-muted/50">
                 <CardHeader>
                    <CardTitle>Result</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    {resultDate ? (
                        <p className="text-4xl font-bold">{format(resultDate, 'PPP')}</p>
                    ) : (
                        <p className="text-2xl text-muted-foreground">Calculate to see result</p>
                    )}
                </CardContent>
            </Card>
        </div>
      </div>
    </ToolContainer>
  );
}
