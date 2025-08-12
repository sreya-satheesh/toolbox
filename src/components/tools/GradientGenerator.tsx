
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Trash, Copy } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

type ColorStop = { id: number; color: string; position: number };

export default function GradientGenerator() {
  const [colors, setColors] = useState<ColorStop[]>([
    { id: 1, color: '#29abe2', position: 0 },
    { id: 2, color: '#ff9933', position: 100 },
  ]);
  const [angle, setAngle] = useState(90);
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const { toast } = useToast();

  const sortedColors = [...colors].sort((a, b) => a.position - b.position);

  const gradientCss = type === 'linear'
    ? `linear-gradient(${angle}deg, ${sortedColors.map(c => `${c.color} ${c.position}%`).join(', ')})`
    : `radial-gradient(circle, ${sortedColors.map(c => `${c.color} ${c.position}%`).join(', ')})`;

  const addColor = () => {
    if (colors.length >= 3) {
      toast({
        variant: 'destructive',
        title: 'Color limit reached',
        description: 'You can add a maximum of 3 colors.',
      });
      return;
    }
    const newId = colors.length > 0 ? Math.max(...colors.map(c => c.id)) + 1 : 1;
    const newColors = [...colors, { id: newId, color: '#ffffff', position: 50 }];
    setColors(newColors.sort((a, b) => a.position - b.position));
  };
  
  const removeColor = (id: number) => {
    if (colors.length <= 2) {
      toast({ variant: 'destructive', title: 'Cannot remove color', description: 'A gradient must have at least two colors.' });
      return;
    }
    setColors(colors.filter(c => c.id !== id));
  };
  
  const updateColor = (id: number, field: 'color' | 'position', value: string | number) => {
    setColors(colors.map(c => c.id === id ? { ...c, [field]: value } : c));
  };
  
  const handleCopy = () => {
    const cssToCopy = `background: ${gradientCss};`;
    navigator.clipboard.writeText(cssToCopy);
    toast({
        title: 'CSS Copied!',
        description: 'The gradient CSS has been copied to your clipboard.',
    });
  }

  return (
    <ToolContainer toolId="gradient-generator">
      <div className="grid md:grid-cols-2 gap-8 flex-1">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="p-4">
              <div className="grid gap-4">
                <div className="flex justify-between items-center">
                  <Label>Type</Label>
                  <Select value={type} onValueChange={(v: 'linear' | 'radial') => setType(v)}>
                    <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="linear">Linear</SelectItem>
                      <SelectItem value="radial">Radial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {type === 'linear' && (
                  <div className="flex justify-between items-center">
                    <Label htmlFor="angle">Angle</Label>
                    <div className="flex items-center gap-2">
                      <Input id="angle" type="range" min="0" max="360" value={angle} onChange={e => setAngle(Number(e.target.value))} className="w-48"/>
                      <span>{angle}°</span>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 space-y-4">
              <Label>Colors</Label>
              {colors.map(c => (
                <div key={c.id} className="flex items-center gap-2">
                  <input type="color" value={c.color} onChange={e => updateColor(c.id, 'color', e.target.value)} className="w-10 h-10 p-0 border-none bg-transparent"/>
                  <Input type="text" value={c.color} onChange={e => updateColor(c.id, 'color', e.target.value)} className="w-24 font-code"/>
                  <Input type="number" value={c.position} onChange={e => updateColor(c.id, 'position', Number(e.target.value))} className="w-20" min="0" max="100"/>
                  <span className="text-muted-foreground">%</span>
                  <Button variant="ghost" size="icon" onClick={() => removeColor(c.id)}><Trash /></Button>
                </div>
              ))}
              <Button onClick={addColor} variant="outline" className="w-full" disabled={colors.length >= 3}>Add Color</Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
          <div className="w-full aspect-video rounded-lg shadow-inner" style={{ background: gradientCss }} />
          <div className="relative">
            <Textarea readOnly value={`background: ${gradientCss};`} className="p-4 pr-12 font-code bg-muted/50 h-24"/>
            <Button variant="ghost" size="icon" className="absolute top-2 right-2" onClick={handleCopy}><Copy/></Button>
          </div>
        </div>
      </div>
    </ToolContainer>
  );
}
