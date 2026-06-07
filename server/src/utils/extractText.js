import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (ext === '.pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }

  if (ext === '.txt') {
    return buffer.toString('utf-8');
  }

  throw new Error(`Unsupported file type: ${ext}`);
}
