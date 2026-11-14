import { DesignDocument } from '../ddom/types';
import { SVGExportEngine } from './svgExport';

function escapeHTML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export class HTMLExportEngine {
  static generateHTML(doc: DesignDocument): string {
    const svgCode = SVGExportEngine.generateSVG(doc);
    const safeTitle = escapeHTML(doc.title || 'Creative Design');
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-Content-Type-Options" content="nosniff">
  <title>${safeTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: #0f172a;
      font-family: 'Inter', sans-serif;
    }
    .design-container {
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      border-radius: 8px;
      overflow: hidden;
      max-width: 100%;
    }
    svg {
      display: block;
      width: 100%;
      height: auto;
    }
  </style>
</head>
<body>
  <div class="design-container">
    ${svgCode}
  </div>
</body>
</html>`;
  }

  static generateReactComponent(doc: DesignDocument): string {
    let rawName = doc.title.replace(/[^a-zA-Z0-9]/g, '');
    if (!rawName || /^[0-9]/.test(rawName)) {
      rawName = `CreativeDesign_${rawName}`;
    }
    const svgCode = SVGExportEngine.generateSVG(doc);
    return `import React from 'react';

export const ${rawName}: React.FC<{ className?: string; style?: React.CSSProperties }> = ({ className, style }) => {
  return (
    <div className={className} style={{ display: 'inline-block', maxWidth: '100%', ...style }}>
      ${svgCode}
    </div>
  );
};

export default ${rawName};`;
  }
}
