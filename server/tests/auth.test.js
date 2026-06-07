import { describe, it, expect, vi, beforeAll } from 'vitest';
import jwt from 'jsonwebtoken';

vi.mock('jsonwebtoken');

process.env.JWT_SECRET = 'test-secret';

// We test the middleware logic directly
import { authMiddleware } from '../src/middleware/authMiddleware.js';

describe('authMiddleware', () => {
  it('should return 401 if no token provided', () => {
    const req = { headers: {} };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 if token is invalid', () => {
    jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

    const req = { headers: { authorization: 'Bearer bad-token' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should set req.userId and call next if token is valid', () => {
    jwt.verify.mockReturnValue({ userId: 'abc123' });

    const req = { headers: { authorization: 'Bearer good-token' } };
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() };
    const next = vi.fn();

    authMiddleware(req, res, next);

    expect(req.userId).toBe('abc123');
    expect(next).toHaveBeenCalled();
  });
});

describe('extractText', () => {
  it('should extract text from a .txt file', async () => {
    const { extractTextFromFile } = await import('../src/utils/extractText.js');
    const fs = await import('fs');
    const writePath = 'test-temp.txt';
    fs.writeFileSync(writePath, 'Hello world');
    const text = await extractTextFromFile(writePath);
    expect(text).toBe('Hello world');
    fs.unlinkSync(writePath);
  });
});
