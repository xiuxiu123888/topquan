import { ProductItem } from '../data/companyData';

/**
 * Escapes characters for PDF string literals: (, ), \
 */
function escapePdf(str: string): string {
  return str
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

/**
 * Clean string for standard PDF Type1 font (ASCII safe)
 */
function sanitizeAscii(str: string): string {
  // Convert standard Chinese punctuation to clean ASCII
  const cleaned = str
    .replace(/：/g, ': ')
    .replace(/；/g, '; ')
    .replace(/，/g, ', ')
    .replace(/（/g, ' (')
    .replace(/）/g, ') ')
    .replace(/、/g, ', ')
    .replace(/℃/g, 'C')
    .replace(/≤/g, '<= ')
    .replace(/×/g, 'x');

  // Return clean string
  return escapePdf(cleaned);
}

/**
 * Builds a structurally valid standard PDF 1.4 document as a Blob
 */
export function generateMockPdfBlob(product: ProductItem): Blob {
  const currentDate = new Date().toISOString().split('T')[0];
  
  // Prepare lines of content for the PDF document
  const contentLines: { text: string; isBold?: boolean; size?: number; indent?: number }[] = [
    { text: 'TOPQUANT TECHNOLOGY CO., LTD. (SHENZHEN)', isBold: true, size: 16 },
    { text: 'OFFICIAL PRODUCT TECHNICAL SPECIFICATION SHEET', isBold: true, size: 12 },
    { text: `Document ID: TQ-DS-${product.id}-2026 | Date: ${currentDate} | Status: Official Release`, size: 9 },
    { text: '----------------------------------------------------------------------------------------------------', size: 9 },
    { text: `MODEL NUMBER:  ${product.id}`, isBold: true, size: 13 },
    { text: `PRODUCT NAME:  ${sanitizeAscii(product.name)}`, isBold: true, size: 10 },
    { text: `CATEGORY:      ${product.categoryName} (${product.platform} Architecture Platform)`, size: 10 },
    { text: `TAGLINE:       ${sanitizeAscii(product.tagline)}`, size: 9 },
    { text: '----------------------------------------------------------------------------------------------------', size: 9 },
    { text: 'HARDWARE ENGINEERING SPECIFICATIONS MATRIX:', isBold: true, size: 11 }
  ];

  // Append specifications
  if (product.specsTable && product.specsTable.length > 0) {
    product.specsTable.forEach(spec => {
      contentLines.push({
        text: `* ${sanitizeAscii(spec.label)}: ${sanitizeAscii(spec.value)}`,
        size: 9,
        indent: 10
      });
    });
  }

  contentLines.push(
    { text: '----------------------------------------------------------------------------------------------------', size: 9 },
    { text: 'CORE ARCHITECTURAL ADVANTAGES:', isBold: true, size: 11 },
    { text: '- High Reliability: Precision screening, closed-loop liquid cooling, 72h full thermal stress aging.', size: 9, indent: 10 },
    { text: '- Full System Tuning: Low-latency BIOS, Linux OS kernel bypass, and Solarflare onload optimization.', size: 9, indent: 10 },
    { text: '- Exceptional Price/Performance: Tailored for HFT market making, arbitrage, and DMA exchange access.', size: 9, indent: 10 },
    { text: '----------------------------------------------------------------------------------------------------', size: 9 },
    { text: 'QUALITY ASSURANCE & COMPLIANCE:', isBold: true, size: 10 },
    { text: '* 72-Hour Full Thermal Stress Burn-in Certified - Zero Drop, Zero Jitter', size: 8, indent: 10 },
    { text: '* China Compulsory Certification (CCC) Certified', size: 8, indent: 10 },
    { text: '* 1-Year Comprehensive On-Site / Replacement Warranty, 7x24 Rapid Response', size: 8, indent: 10 },
    { text: '* Headquarters: Room A601, Building 1, Phase 2, Gaoxinqi Industrial Park, Baoan, Shenzhen', size: 8, indent: 10 },
    { text: '* Tel: 0755-23003729 / 18923779722 | Email: zhouwd@topquant.com.cn', size: 8, indent: 10 }
  );

  // Build stream content with exact PDF operators
  let streamBody = 'BT\n';
  let currentY = 800; // Start near top of A4 (595 x 842 pt)
  const leftX = 40;

  contentLines.forEach(line => {
    const fontSize = line.size || 10;
    const fontName = line.isBold ? '/F2' : '/F1';
    const xPos = leftX + (line.indent || 0);

    // Set font and position
    streamBody += `${fontName} ${fontSize} Tf\n`;
    streamBody += `1 0 0 1 ${xPos} ${currentY} Tm\n`;
    streamBody += `(${line.text}) Tj\n`;

    currentY -= fontSize + 5; // Line height
  });

  streamBody += 'ET\n';

  // Construct standard PDF objects
  const obj1 = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  const obj2 = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  const obj4 = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  const obj5 = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  const obj6 = `6 0 obj\n<< /Length ${streamBody.length} >>\nstream\n${streamBody}\nendstream\nendobj\n`;
  const obj3 = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';

  const header = '%PDF-1.4\n%\xE2\xE3\xCF\xD3\n';

  // Calculate byte offsets for xref
  const offset1 = header.length;
  const offset2 = offset1 + obj1.length;
  const offset3 = offset2 + obj2.length;
  const offset4 = offset3 + obj3.length;
  const offset5 = offset4 + obj4.length;
  const offset6 = offset5 + obj5.length;
  const xrefOffset = offset6 + obj6.length;

  const padOffset = (n: number) => String(n).padStart(10, '0');

  const xref = 
    `xref\n0 7\n` +
    `0000000000 65535 f \n` +
    `${padOffset(offset1)} 00000 n \n` +
    `${padOffset(offset2)} 00000 n \n` +
    `${padOffset(offset3)} 00000 n \n` +
    `${padOffset(offset4)} 00000 n \n` +
    `${padOffset(offset5)} 00000 n \n` +
    `${padOffset(offset6)} 00000 n \n`;

  const trailer = 
    `trailer\n<< /Size 7 /Root 1 0 R >>\n` +
    `startxref\n${xrefOffset}\n%%EOF\n`;

  const fullPdfString = header + obj1 + obj2 + obj3 + obj4 + obj5 + obj6 + xref + trailer;

  return new Blob([fullPdfString], { type: 'application/pdf' });
}

/**
 * Triggers a real browser download for the generated mock PDF file
 */
export function downloadMockPdf(product: ProductItem): void {
  const blob = generateMockPdfBlob(product);
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = `${product.id}_Specification_TopQuant.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(blobUrl), 30000);
}
