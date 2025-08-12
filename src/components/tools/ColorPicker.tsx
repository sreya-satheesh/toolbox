'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}


export default function ColorPicker() {
  const [color, setColor] = useState('#29abe2');
  const { toast } = useToast();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
  };
  
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
        title: 'Copied to Clipboard',
        description: `Copied ${value} to your clipboard.`,
    })
  }
  
  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

  return (
    <ToolContainer toolId="color-picker">
       <div className="grid md:grid-cols-2 gap-8">
            <div className="flex flex-col items-center gap-4">
                <Label htmlFor="color-input" className="cursor-pointer">
                    <div className="w-64 h-64 rounded-full border-8 border-background shadow-md" style={{ backgroundColor: color }}/>
                </Label>
                <input id="color-input" type="color" value={color} onChange={handleColorChange} className="w-0 h-0 opacity-0"/>
                <p className="text-muted-foreground">Click the circle to pick a color</p>
            </div>
            <div className="flex flex-col justify-center gap-4">
                <h3 className="text-2xl font-bold">Color Values</h3>
                <Card>
                    <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-center" onClick={() => handleCopy(color)}>
                            <span className="font-medium">HEX</span>
                            <span className="font-code text-primary cursor-pointer">{color}</span>
                        </div>
                         {rgb && (
                             <div className="flex justify-between items-center" onClick={() => handleCopy(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}>
                                <span className="font-medium">RGB</span>
                                <span className="font-code text-primary cursor-pointer">{rgb.r}, {rgb.g}, {rgb.b}</span>
                             </div>
                         )}
                         {hsl && (
                            <div className="flex justify-between items-center" onClick={() => handleCopy(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}>
                                <span className="font-medium">HSL</span>
                                <span className="font-code text-primary cursor-pointer">{hsl.h}, {hsl.s}%, {hsl.l}%</span>
                            </div>
                         )}
                    </CardContent>
                </Card>
            </div>
       </div>
    </ToolContainer>
  );
}
