import Datastore from 'nedb-promises';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

export const nedbUsers = Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true });
export const nedbDocuments = Datastore.create({ filename: path.join(dataDir, 'documents.db'), autoload: true });
export const nedbConversations = Datastore.create({ filename: path.join(dataDir, 'conversations.db'), autoload: true });
