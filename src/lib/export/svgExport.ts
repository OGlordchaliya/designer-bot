import { DesignDocument, TextLayer, ShapeLayer, IconLayer } from '../ddom/types';

export class SVGExportEngine {
  static generateSVG(doc: DesignDocument, options?: { transparentBg?: boolean }): string {
    const W = doc.artboard.width;
    const H = doc.artboard.height;
    const bg = options?.transparentBg ? 'none' : doc.artboard.backgroundColor || '#FFFFFF';

    const sorted = [...doc.layers].sort((a, b) => (a.zIndex || 0) - (b.zIndex || 0));
    let elements = '';

    sorted.forEach((layer) => {
      if (!layer.visible) return;
      if (layer.type === 'shape') {
        elements += this.renderShape(layer as ShapeLayer);
      } else if (layer.type === 'text') {
        elements += this.renderText(layer as TextLayer);
      } else if (layer.type === 'icon') {
        elements += this.renderIcon(layer as IconLayer);
      }
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <defs>
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&amp;family=Plus+Jakarta+Sans:wght@500;700;800&amp;display=swap');
      text { font-family: 'Plus Jakarta Sans', 'Inter', -apple-system, sans-serif; }
    </style>
  </defs>
  ${bg !== 'none' ? `<rect width="${W}" height="${H}" fill="${bg}" />` : ''}
  ${elements}
</svg>`;
  }

  private static renderShape(layer: ShapeLayer): string {
    const { x, y, width, height, shapeType, fill, stroke, strokeWidth, borderRadius, opacity, rotation } = layer;
    const rot = rotation ? `transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"` : '';
    const op = opacity !== undefined ? `opacity="${opacity}"` : '';
    const str = stroke ? `stroke="${stroke}" stroke-width="${strokeWidth || 1}"` : '';

    if (shapeType === 'circle') {
      const r = Math.min(width, height) / 2;
      return `<circle cx="${x + r}" cy="${y + r}" r="${r}" fill="${fill}" ${str} ${op} ${rot} />\n`;
    }

    if (shapeType === 'pill') {
      const rx = height / 2;
      return `<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${rx}" fill="${fill}" ${str} ${op} ${rot} />\n`;
    }

    const rx = borderRadius ? `rx="${borderRadius}"` : '';
    return `<rect x="${x}" y="${y}" width="${width}" height="${height}" ${rx} fill="${fill}" ${str} ${op} ${rot} />\n`;
  }

  private static renderText(layer: TextLayer): string {
    const { x, y, width, text, fontSize, fontFamily, fontWeight, textAlign, color, opacity, letterSpacing, rotation } = layer;
    const rot = rotation ? `transform="rotate(${rotation} ${x + width / 2} ${y + 20})"` : '';
    const op = opacity !== undefined ? `opacity="${opacity}"` : '';
    const anchor = textAlign === 'center' ? 'middle' : textAlign === 'right' ? 'end' : 'start';
    const tx = textAlign === 'center' ? x + width / 2 : textAlign === 'right' ? x + width : x;

    const lines = text.split('\n');
    const lineHeight = fontSize * 1.35;

    const tspans = lines
      .map((line, i) => `<tspan x="${tx}" dy="${i === 0 ? fontSize : lineHeight}">${this.escapeXML(line)}</tspan>`)
      .join('');

    return `<text x="${tx}" y="${y}" fill="${color}" font-size="${fontSize}" font-family="${fontFamily || 'Inter'}" font-weight="${fontWeight || 600}" text-anchor="${anchor}" letter-spacing="${letterSpacing || 0}" ${op} ${rot}>${tspans}</text>\n`;
  }

  private static renderIcon(layer: IconLayer): string {
    const { x, y, width, iconName, color, strokeWidth = 2, opacity, rotation } = layer;
    const rot = rotation ? `transform="rotate(${rotation} ${x + width / 2} ${y + width / 2})"` : '';
    const op = opacity !== undefined ? `opacity="${opacity}"` : '';

    let path = `M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5`;
    if (iconName === 'Zap') {
      path = `M13 2L3 14h9l-1 8 10-12h-9l1-8z`;
    } else if (iconName === 'Shield' || iconName === 'ShieldCheck') {
      path = `M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z`;
    } else if (iconName === 'Hexagon') {
      path = `M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z`;
    }

    return `<g transform="translate(${x}, ${y}) scale(${width / 24})" ${op} ${rot}>
      <path d="${path}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />
    </g>\n`;
  }

  private static escapeXML(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  static downloadSVG(doc: DesignDocument, fileName?: string): void {
    if (typeof window === 'undefined') return;
    const svgString = this.generateSVG(doc);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName || doc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
