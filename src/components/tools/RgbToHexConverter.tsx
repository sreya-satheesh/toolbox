'use client';

import { useState, useMemo } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function componentToHex(c: number): string {
    const hex = c.toString(16);
    return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number): string {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

export default function RgbToHexConverter() {
  const [r, setR] = useState(41);
  const [g, setG] = useState(171);
  const [b, setB] = useState(226);

  const isValid = (v: number) => v >= 0 && v <= 255;
  
  const hex = useMemo(() => {
    if(isValid(r) && isValid(g) && isValid(b)) {
        return rgbToHex(r, g, b);
    }
    return 'Invalid';
  }, [r, g, b]);

  return (
    <ToolContainer toolId="rgb-to-hex-converter">
      <div className="flex flex-col items-center justify-center gap-8">
        <div className="flex items-end gap-4">
            <div className="grid grid-cols-3 gap-4">
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="r-input">Red</Label>
                    <Input id="r-input" type="number" value={r} onChange={e => setR(parseInt(e.target.value, 10) || 0)} className="font-code text-lg" min="0" max="255" />
                 </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="g-input">Green</Label>
                    <Input id="g-input" type="number" value={g} onChange={e => setG(parseInt(e.target.value, 10) || 0)} className="font-code text-lg" min="0" max="255" />
                 </div>
                 <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="b-input">Blue</Label>
                    <Input id="b-input" type="number" value={b} onChange={e => setB(parseInt(e.target.value, 10) || 0)} className="font-code text-lg" min="0" max="255" />
                 </div>
            </div>
            <div
                className="w-16 h-12 rounded-md border"
                style={{ backgroundColor: hex !== 'Invalid' ? hex : 'transparent' }}
            />
        </div>
        
        <div className="text-center">
            <p className="text-muted-foreground">HEX Value</p>
            <p className={`text-4xl font-bold font-code tracking-wider ${hex === 'Invalid' ? 'text-destructive' : ''}`}>
              {hex}
            </p>
        </div>
      </div>
    </ToolContainer>
  );
}
