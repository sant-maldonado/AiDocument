import { describe, it, expect } from 'vitest';
import { extractTextFromBuffer } from '../_lib/utils/extractText.js';
import { v2 as cloudinary } from 'cloudinary';

describe('extractTextFromBuffer', () => {
  it('should extract text from a txt buffer', async () => {
    const text = 'Hello world\nThis is a test';
    const buffer = Buffer.from(text, 'utf-8');
    const result = await extractTextFromBuffer(buffer, 'test.txt');
    expect(result).toBe(text);
  });

  it('should reject unsupported file types', async () => {
    const buffer = Buffer.from('test');
    await expect(extractTextFromBuffer(buffer, 'test.png')).rejects.toThrow('Unsupported file type');
  });
});

describe('Cloudinary config', () => {
  it('should have cloud_name configured', () => {
    const config = cloudinary.config();
    expect(config.cloud_name).toBeTruthy();
    expect(config.api_key).toBeTruthy();
    expect(config.api_secret).toBeTruthy();
  });
});
