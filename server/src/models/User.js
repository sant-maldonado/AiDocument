import bcrypt from 'bcryptjs';

let _impl;

export async function initUserModel() {
  const { nedbUsers } = await import('../utils/db.js');
  _impl = nedbUsers;
}

export async function createUser({ username, email, password }) {
  const existing = await _impl.findOne({ $or: [{ email }, { username }] });
  if (existing) return null;
  const hashed = await bcrypt.hash(password, 12);
  return _impl.insert({ username, email, password: hashed, createdAt: new Date() });
}

export async function findUserByEmail(email) {
  return _impl.findOne({ email });
}

export async function findUserById(id) {
  return _impl.findOne({ _id: id });
}

export async function comparePassword(user, candidate) {
  return bcrypt.compare(candidate, user.password);
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}
