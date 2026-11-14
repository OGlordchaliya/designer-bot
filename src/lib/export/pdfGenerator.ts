import jsPDF from 'jspdf';
import { DesignDocument } from '../ddom/types';
import { SVGExportEngine } from './svgExport';

export class PDFExportEngine {
  static async downloadPDF(doc: DesignDocument, fileName?: string): Promise<void> {
    if (typeof window === 'undefined') return;

    const isA4 = doc.category === 'letterhead' || doc.subcategory === 'invoice_standard';
    const orientation = doc.artboard.width > doc.artboard.height ? 'landscape' : 'portrait';

    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: isA4 ? 'a4' : [doc.artboard.width * 0.264583, doc.artboard.height * 0.264583],
    });

    const svgString = SVGExportEngine.generateSVG(doc);
    const canvas = document.createElement('canvas');
    const scale = 2;
    canvas.width = doc.artboard.width * scale;
    canvas.height = doc.artboard.height * scale;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const img = new Image();
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    await new Promise<void>((resolve, reject) => {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName || doc.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.pdf`);
  }
}
