'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return { r: Math.round(255 * f(0)), g: Math.round(255 * f(8)), b: Math.round(255 * f(4)) };
}

function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex({ r, g, b }: {r:number, g:number, b:number}): string {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}


export default function HslToHexConverter() {
  const [h, setH] = useState(197);
  const [s, setS] = useState(81);
  const [l, setL] = useState(55);

  const isValid = (v: number, max: number) => v >= 0 && v <= max;
  
  const { hex, rgb } = useMemo(() => {
    if(isValid(h, 360) && isValid(s, 100) && isValid(l, 100)) {
        const calculatedRgb = hslToRgb(h, s, l);
        return { hex: rgbToHex(calculatedRgb), rgb: calculatedRgb };
    }
    return { hex: 'Invalid', rgb: null };
  }, [h, s, l]);

  return (
    <ToolContainer toolId="hsl-to-hex-converter">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex items-end gap-4">
            <div className="grid grid-cols-3 gap-4">
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="h-input">Hue</Label>
                    <Input id="h-input" type="number" value={h} onChange={e => setH(parseInt(e.target.value, 10) || 0)} className="font-code text-lg" min="0" max="360" />
                 </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="s-input">Saturation</Label>
                    <Input id="s-input" type="number" value={s} onChange={e => setS(parseInt(e.target.value, 10) || 0)} className="font-code text-lg" min="0" max="100" />
                 </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="l-input">Lightness</Label>
                    <Input id="l-input" type="number" value={l} onChange={e => setL(parseInt(e.target.value, 10) || 0)} className="font-code text-lg" min="0" max="100" />
                 </div>
            </div>
            <div
                className="w-16 h-12 rounded-md border"
                style={{ backgroundColor: hex !== 'Invalid' ? hex : 'transparent' }}
            />
        </div>
        
        <div className="flex gap-8 text-center">
            <div>
                <p className="text-muted-foreground">HEX Value</p>
                <p className={`text-4xl font-bold font-code tracking-wider ${hex === 'Invalid' ? 'text-destructive' : ''}`}>
                {hex}
                </p>
            </div>
             {rgb && (
                <div>
                    <p className="text-muted-foreground">RGB Value</p>
                    <p className={`text-4xl font-bold font-code tracking-wider`}>
                    {`${rgb.r}, ${rgb.g}, ${rgb.b}`}
                    </p>
                </div>
             )}
        </div>
      </div>
    </ToolContainer>
  );
}
