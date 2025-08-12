'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppContainer } from '@/components/AppContainer';
import { TOOLS_MAP } from '@/lib/tools';
import dynamic from 'next/dynamic';

import JsMinifier from '@/components/tools/JsMinifier';
import JsBeautifier from '@/components/tools/JsBeautifier';
import Base64EncoderDecoder from '@/components/tools/Base64EncoderDecoder';
import UrlEncoderDecoder from '@/components/tools/UrlEncoderDecoder';
import HashGenerator from '@/components/tools/HashGenerator';
import CaseConverter from '@/components/tools/CaseConverter';
import WordCounter from '@/components/tools/WordCounter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench } from 'lucide-react';

import JsObfuscator from '@/components/tools/JsObfuscator';
import Es6ToEs5Converter from '@/components/tools/Es6ToEs5Converter';
import CssMinifier from '@/components/tools/CssMinifier';
import CssBeautifier from '@/components/tools/CssBeautifier';
import HtmlMinifier from '@/components/tools/HtmlMinifier';
import HtmlBeautifier from '@/components/tools/HtmlBeautifier';
import HtmlEntitiesEncoderDecoder from '@/components/tools/HtmlEntitiesEncoderDecoder';
import UnicodeConverter from '@/components/tools/UnicodeConverter';
import JwtDecoder from '@/components/tools/JwtDecoder';
import Md5HashGenerator from '@/components/tools/Md5HashGenerator';
import HmacGenerator from '@/components/tools/HmacGenerator';
import CsvToJson from '@/components/tools/CsvToJson';
import JsonToCsv from '@/components/tools/JsonToCsv';
import XmlToJson from '@/components/tools/XmlToJson';
import JsonToXml from '@/components/tools/JsonToXml';
import YamlToJson from '@/components/tools/YamlToJson';
import JsonToYaml from '@/components/tools/JsonToYaml';
import MarkdownToHtml from '@/components/tools/MarkdownToHtml';
import HtmlToMarkdown from '@/components/tools/HtmlToMarkdown';

import ImageCompressor from '@/components/tools/ImageCompressor';
import ImageFormatConverter from '@/components/tools/ImageFormatConverter';
import ImageResizer from '@/components/tools/ImageResizer';
import ImageCropper from '@/components/tools/ImageCropper';
import ImageToBase64 from '@/components/tools/ImageToBase64';
import Base64ToImage from '@/components/tools/Base64ToImage';
import ImageMetadataViewer from '@/components/tools/ImageMetadataViewer';
import ImageMetadataRemover from '@/components/tools/ImageMetadataRemover';

import ColorPicker from '@/components/tools/ColorPicker';
import ColorPaletteGenerator from '@/components/tools/ColorPaletteGenerator';
import GradientGenerator from '@/components/tools/GradientGenerator';
import HexToRgbConverter from '@/components/tools/HexToRgbConverter';
import RgbToHexConverter from '@/components/tools/RgbToHexConverter';
import HslToHexConverter from '@/components/tools/HslToHexConverter';
import ImageColorExtractor from '@/components/tools/ImageColorExtractor';

import UnixTimestampConverter from '@/components/tools/UnixTimestampConverter';
import TimezoneConverter from '@/components/tools/TimezoneConverter';
import DateCalculator from '@/components/tools/DateCalculator';

import RegexTester from '@/components/tools/RegexTester';
import StringEscaper from '@/components/tools/StringEscaper';
import StringUnescaper from '@/components/tools/StringUnescaper';
import SlugGenerator from '@/components/tools/SlugGenerator';
import RandomStringGenerator from '@/components/tools/RandomStringGenerator';
import LoremIpsumGenerator from '@/components/tools/LoremIpsumGenerator';
import BcryptHasher from '@/components/tools/BcryptHasher';

const componentMap: { [key: string]: React.ComponentType<any> } = {
  'js-minifier': JsMinifier,
  'js-beautifier': JsBeautifier,
  'base64-encoder-decoder': Base64EncoderDecoder,
  'url-encoder-decoder': UrlEncoderDecoder,
  'hash-generator': HashGenerator,
  'case-converter': CaseConverter,
  'word-counter': WordCounter,
  'js-obfuscator': JsObfuscator,
  'es6-to-es5-converter': Es6ToEs5Converter,
  'css-minifier': CssMinifier,
  'css-beautifier': CssBeautifier,
  'html-minifier': HtmlMinifier,
  'html-beautifier': HtmlBeautifier,
  'html-entities-encoder-decoder': HtmlEntitiesEncoderDecoder,
  'unicode-converter': UnicodeConverter,
  'jwt-decoder': JwtDecoder,
  'md5-hash-generator': Md5HashGenerator,
  'hmac-generator': HmacGenerator,
  'bcrypt-hasher': BcryptHasher,
  'csv-to-json': CsvToJson,
  'json-to-csv': JsonToCsv,
  'xml-to-json': XmlToJson,
  'json-to-xml': JsonToXml,
  'yaml-to-json': YamlToJson,
  'json-to-yaml': JsonToYaml,
  'markdown-to-html': MarkdownToHtml,
  'html-to-markdown': HtmlToMarkdown,
  'image-compressor': ImageCompressor,
  'image-converter': ImageFormatConverter,
  'image-resizer': ImageResizer,
  'image-cropper': ImageCropper,
  'image-to-base64': ImageToBase64,
  'base64-to-image': Base64ToImage,
  'image-metadata-viewer': ImageMetadataViewer,
  'image-metadata-remover': ImageMetadataRemover,
  'color-picker': ColorPicker,
  'color-palette-generator': ColorPaletteGenerator,
  'gradient-generator': GradientGenerator,
  'hex-to-rgb-converter': HexToRgbConverter,
  'rgb-to-hex-converter': RgbToHexConverter,
  'hsl-to-hex-converter': HslToHexConverter,
  'image-color-extractor': ImageColorExtractor,
  'unix-timestamp-converter': UnixTimestampConverter,
  'timezone-converter': TimezoneConverter,
  'date-calculator': DateCalculator,
  'regex-tester': RegexTester,
  'string-escaper': StringEscaper,
  'string-unescaper': StringUnescaper,
  'slug-generator': SlugGenerator,
  'random-string-generator': RandomStringGenerator,
  'lorem-ipsum-generator': LoremIpsumGenerator,
};

function HomePageContent() {
  const searchParams = useSearchParams();
  const toolId = searchParams.get('tool');

  const ActiveTool = toolId ? componentMap[toolId] : null;
  const toolDetails = toolId ? TOOLS_MAP.get(toolId) : null;

  return (
    <AppContainer>
      {ActiveTool && toolDetails ? (
        <ActiveTool />
      ) : (
        <div className="flex h-full flex-col items-center justify-center text-center p-4 md:p-8">
          <Card className="w-full max-w-lg shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-3 text-2xl md:text-3xl font-headline">
                <Wrench className="size-8 text-primary" />
                Welcome to Toolbox
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select a tool from the sidebar to get started. Our collection of developer utilities is here to streamline your workflow.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </AppContainer>
  );
}

export default function Home() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  );
}
