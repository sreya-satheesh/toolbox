
'use client';

import { useState } from 'react';
import { ToolContainer } from '@/components/ToolContainer';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

// Color conversion utilities
function hexToRgb(hex: string) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
}

function rgbToHex(r: number, g: number, b: number) {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase();
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number) {
    s /= 100; l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;
    if (h >= 0 && h < 60) { [r,g,b] = [c,x,0]; }
    else if (h >= 60 && h < 120) { [r,g,b] = [x,c,0]; }
    else if (h >= 120 && h < 180) { [r,g,b] = [0,c,x]; }
    else if (h >= 180 && h < 240) { [r,g,b] = [0,x,c]; }
    else if (h >= 240 && h < 300) { [r,g,b] = [x,0,c]; }
    else if (h >= 300 && h < 360) { [r,g,b] = [c,0,x]; }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
}

function generateShades(hsl: {h:number, s:number, l:number}, count = 5) {
    const shades = [];
    const step = (95 - hsl.l) / (count - 1);
    for (let i = 0; i < count; i++) {
        const newL = Math.max(5, Math.min(95, hsl.l + (i - Math.floor(count/2)) * step * (i > Math.floor(count/2) ? 0.8 : 1.2)));
        const {r, g, b} = hslToRgb(hsl.h, hsl.s, newL);
        shades.push(rgbToHex(r, g, b));
    }
    return shades;
}

function generateComplementary(hsl: {h:number, s:number, l:number}) {
    const {r,g,b} = hslToRgb((hsl.h + 180) % 360, hsl.s, hsl.l);
    return rgbToHex(r, g, b);
}

function generateAnalogous(hsl: {h:number, s:number, l:number}) {
    const {r: r1, g: g1, b: b1} = hslToRgb((hsl.h + 30) % 360, hsl.s, hsl.l);
    const {r: r2, g: g2, b: b2} = hslToRgb((hsl.h - 30 + 360) % 360, hsl.s, hsl.l);
    return [rgbToHex(r1, g1, b1), rgbToHex(r2, g2, b2)];
}

function generateTriadic(hsl: {h:number, s:number, l:number}) {
    const {r: r1, g: g1, b: b1} = hslToRgb((hsl.h + 120) % 360, hsl.s, hsl.l);
    const {r: r2, g: g2, b: b2} = hslToRgb((hsl.h - 120 + 360) % 360, hsl.s, hsl.l);
    return [rgbToHex(r1, g1, b1), rgbToHex(r2, g2, b2)];
}


export default function ColorPaletteGenerator() {
  const [baseColor, setBaseColor] = useState('#29abe2');
  const { toast } = useToast();

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseColor(e.target.value);
  };
  
  const handleCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast({
        title: 'Copied HEX code',
        description: `Copied ${value} to your clipboard.`,
    })
  }

  const baseRgb = hexToRgb(baseColor);
  const baseHsl = baseRgb ? rgbToHsl(baseRgb.r, baseRgb.g, baseRgb.b) : null;
  
  const shades = baseHsl ? generateShades(baseHsl, 5) : [];
  const complementary = baseHsl ? [baseColor, generateComplementary(baseHsl)] : [];
  const analogous = baseHsl ? [generateAnalogous(baseHsl)[1], baseColor, generateAnalogous(baseHsl)[0]] : [];
  const triadic = baseHsl ? [baseColor, ...generateTriadic(baseHsl)] : [];
  
  const palettes = [
      { title: 'Shades', colors: shades },
      { title: 'Complementary', colors: complementary },
      { title: 'Analogous', colors: analogous },
      { title: 'Triadic', colors: triadic },
  ]

  return (
    <ToolContainer toolId="color-palette-generator">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
            <Label htmlFor="base-color-input">Base Color:</Label>
            <div className="relative">
                <input id="base-color-input" type="color" value={baseColor} onChange={handleColorChange} className="w-12 h-10 p-0 border-none bg-transparent" />
            </div>
            <span className="font-code text-lg">{baseColor}</span>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
            {palettes.map(palette => (
                <Card key={palette.title}>
                    <CardHeader><CardTitle>{palette.title}</CardTitle></CardHeader>
                    <CardContent>
                        <div className="flex h-20 rounded-lg overflow-hidden">
                           {palette.colors.map((color, index) => (
                                <div key={`${color}-${index}`} className="flex-1 h-full cursor-pointer transition-transform hover:scale-105" style={{backgroundColor: color}} onClick={() => handleCopy(color)} title={`Copy ${color}`} />
                           ))}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </ToolContainer>
  );
}
