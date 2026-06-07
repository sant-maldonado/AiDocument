import { createRequire } from 'module';

export async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    const req = createRequire(import.meta.url);
    req('pdfjs-dist/legacy/build/pdf.worker.js');

    const mod = await import('pdfjs-dist/legacy/build/pdf.js');
    const pdfjs = mod.default || mod;
    const PasswordException = mod.PasswordException;
    pdfjs.GlobalWorkerOptions.workerSrc = '';
    const data = new Uint8Array(buffer);
    let doc;
    try {
      doc = await pdfjs.getDocument(data).promise;
    } catch (err) {
      if (err instanceof PasswordException || err.name === 'PasswordException') {
        throw new Error('El PDF está protegido con contraseña. Subí un PDF sin protección.');
      }
      throw err;
    }
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