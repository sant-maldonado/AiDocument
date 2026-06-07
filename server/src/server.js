import 'dotenv/config';
import app from './app.js';
import { initUserModel } from './models/User.js';
import { initDocumentModel } from './models/Document.js';
import { initConversationModel } from './models/Conversation.js';

const PORT = process.env.PORT || 3001;

async function start() {
  await initUserModel();
  await initDocumentModel();
  await initConversationModel();
  console.log('Database initialized (nedb)');

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start:', err);
  process.exit(1);
});
