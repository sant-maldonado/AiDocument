import { useEffect, useState } from 'react';
import { chatAPI } from '../services/api.js';

export default function ConversationList({ documentId, activeConversationId, onSelect, onNew }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!documentId) {
      setConversations([]);
      return;
    }

    let cancelled = false;
    setLoading(true);
    chatAPI()
      .conversations(documentId)
      .then(({ data }) => {
        if (!cancelled) setConversations(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [documentId]);

  async function handleDelete(id, e) {
    e.stopPropagation();
    await chatAPI().deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c._id !== id));
    if (activeConversationId === id) {
      onNew();
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-4 border-b border-gray-700">
        <button
          onClick={onNew}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors"
        >
          + New conversation
        </button>
      </div>
      {loading && <p className="text-gray-400 text-sm p-4">Loading...</p>}
      {!loading && conversations.length === 0 && (
        <p className="text-gray-500 text-sm p-4">No conversations yet</p>
      )}
      {conversations.map((conv) => (
        <div
          key={conv._id}
          onClick={() => onSelect(conv._id)}
          className={`px-4 py-3 cursor-pointer border-b border-gray-800 hover:bg-gray-800 transition-colors ${
            activeConversationId === conv._id ? 'bg-gray-800' : ''
          }`}
        >
          <div className="flex items-start justify-between">
            <p className="text-sm text-gray-200 truncate flex-1">{conv.title}</p>
            <button
              onClick={(e) => handleDelete(conv._id, e)}
              className="text-xs text-gray-500 hover:text-red-400 ml-2"
            >
              del
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
