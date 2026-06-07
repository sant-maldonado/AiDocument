export async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    const mod = await import('pdfjs-dist');
    const pdfjs = mod.default || mod;
    const data = new Uint8Array(buffer);
    const doc = await pdfjs.getDocument({ data, disableWorker: true }).promise;
    const pages = [];
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => item.str).join(' '));
    }
    return pages.join('\n');
  }

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: .${ext}`);
}
