import pdfParse from 'pdf-parse';

export async function extractTextFromBuffer(buffer, filename) {
  const ext = filename.split('.').pop().toLowerCase();

  if (ext === 'pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === 'txt') {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: .${ext}`);
}
