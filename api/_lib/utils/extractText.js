export async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    {
      const { Worker: NodeWorker } = await import('worker_threads');
      globalThis.Worker = function PdfWorker(url, opts) {
        if (!url || url === 'data:application/javascript,') {
          return { postMessage() {}, terminate() {}, addEventListener() {}, removeEventListener() {} };
        }
        return new NodeWorker(url, opts);
      };
    }
    const mod = await import('pdfjs-dist/legacy/build/pdf.js');
    const pdfjs = mod.default || mod;
    pdfjs.GlobalWorkerOptions.workerSrc = '';
    const data = new Uint8Array(buffer);
    const doc = await pdfjs.getDocument(data).promise;
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
