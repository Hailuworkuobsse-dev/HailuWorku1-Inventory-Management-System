import PDFDocument from 'pdfkit';
import { Response } from 'express';

export const generatePOPdf = (po: any, res: Response) => {
  const doc = new PDFDocument({ margin: 50 });

  // Pipe PDF to response
  doc.pipe(res);

  // 1. Header
  doc
    .fontSize(20)
    .text('CONSTRUCTION INC.', { align: 'center' })
    .fontSize(10)
    .text('123 Building Road, Site A', { align: 'center' })
    .moveDown();

  doc
    .fontSize(16)
    .text('PURCHASE ORDER', { align: 'center', underline: true })
    .moveDown();

  // 2. Metadata
  doc
    .fontSize(10)
    .text(`PO Number: ${po.poNumber}`, { align: 'left' })
    .text(`Date: ${new Date(po.createdAt).toLocaleDateString()}`, { align: 'left' })
    .text(`Supplier: ${po.supplier.name}`, { align: 'left' })
    .text(`Status: ${po.status}`, { align: 'right' })
    .moveDown();

  // 3. Table Headers
  const tableTop = 200;
  const itemX = 50;
  const qtyX = 300;
  const priceX = 370;
  const totalX = 450;

  doc
    .font('Helvetica-Bold')
    .text('Item / Material', itemX, tableTop)
    .text('Quantity', qtyX, tableTop)
    .text('Unit Price', priceX, tableTop)
    .text('Total', totalX, tableTop);

  doc
    .moveTo(50, tableTop + 15)
    .lineTo(550, tableTop + 15)
    .stroke();

  // 4. Line Items
  let y = tableTop + 30;
  let grandTotal = 0;

  po.items.forEach((item: any) => {
    const lineTotal = item.quantity * item.unitPrice;
    grandTotal += lineTotal;

    doc
      .font('Helvetica')
      .text(item.material.name, itemX, y)
      .text(item.quantity.toString(), qtyX, y)
      .text(`$${item.unitPrice}`, priceX, y)
      .text(`$${lineTotal.toFixed(2)}`, totalX, y);
    
    y += 20;
  });

  doc
    .moveTo(50, y)
    .lineTo(550, y)
    .stroke();

  // 5. Total
  doc
    .font('Helvetica-Bold')
    .text(`Grand Total: $${grandTotal.toFixed(2)}`, totalX, y + 10);

  // 6. Footer
  doc
    .fontSize(10)
    .text('Authorized Signature: _________________', 50, 700)
    .text('Thank you for your business.', { align: 'center', width: 500 });

  doc.end();
};
