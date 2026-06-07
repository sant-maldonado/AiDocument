import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from '../components/Navbar.jsx';
import DocumentUploader from '../components/DocumentUploader.jsx';
import ConversationList from '../components/ConversationList.jsx';
import ChatMessage from '../components/ChatMessage.jsx';
import ChatInput from '../components/ChatInput.jsx';
import { documentsAPI, chatAPI } from '../services/api.js';
import { streamChat } from '../services/stream.js';

export default function Chat() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [selectedDocName, setSelectedDocName] = useState('');
  const [conversationId, setConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const abortRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    documentsAPI().list().then(({ data }) => setDocuments(data)).catch(() => {});
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleUploadSuccess(doc) {
    setDocuments((prev) => [doc, ...prev]);
    setSelectedDocId(doc._id);
    setSelectedDocName(doc.originalName);
    setConversationId(null);
    setMessages([]);
  }

  function handleSelectDocument(docId, docName) {
    setSelectedDocId(docId);
    setSelectedDocName(docName);
    setConversationId(null);
    setMessages([]);
  }

  const handleNewConversation = useCallback(() => {
    setConversationId(null);
    setMessages([]);
  }, []);

  async function handleSelectConversation(id) {
    setConversationId(id);
    setMessages([]);
    setStreaming(true);
    try {
      const { data } = await chatAPI().getConversation(id);
      setMessages(data.messages || []);
    } catch {
      // ignore
    } finally {
      setStreaming(false);
    }
  }

  function handleSend(message) {
    if (!selectedDocId || !message.trim()) return;

    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage, { role: 'assistant', content: '' }]);
    setStreaming(true);

    let currentContent = '';

    const abort = streamChat({
      documentId: selectedDocId,
      message,
      conversationId,
      onChunk: (chunk) => {
        currentContent += chunk;
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === 'assistant') {
            next[next.length - 1] = { ...last, content: currentContent };
          }
          return next;
        });
      },
      onDone: (newConvId) => {
        if (newConvId) setConversationId(newConvId);
        setStreaming(false);
        currentContent = '';
      },
      onError: (error) => {
        setMessages((prev) => {
          const next = [...prev];
          const last = next[next.length - 1];
          if (last && last.role === 'assistant') {
            next[next.length - 1] = { ...last, content: `Error: ${error}` };
          }
          return next;
        });
        setStreaming(false);
        currentContent = '';
      },
    });

    abortRef.current = abort;
  }

  async function handleDeleteDocument(docId) {
    await documentsAPI().delete(docId);
    setDocuments((prev) => prev.filter((d) => d._id !== docId));
    if (selectedDocId === docId) {
      setSelectedDocId(null);
      setSelectedDocName('');
      setConversationId(null);
      setMessages([]);
    }
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950 text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && (
          <aside className="w-72 bg-gray-900 flex flex-col border-r border-gray-800">
            <DocumentUploader onUploadSuccess={handleUploadSuccess} />
            <div className="flex-1 overflow-y-auto p-2">
              {documents.map((doc) => (
                <div
                  key={doc._id}
                  onClick={() => handleSelectDocument(doc._id, doc.originalName)}
                  className={`px-3 py-2 rounded cursor-pointer text-sm flex items-center justify-between hover:bg-gray-800 transition-colors mb-1 ${
                    selectedDocId === doc._id ? 'bg-gray-800 ring-1 ring-blue-500' : ''
                  }`}
                >
                  <span className="truncate text-gray-300">{doc.originalName}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteDocument(doc._id); }}
                    className="text-xs text-gray-500 hover:text-red-400 ml-2 shrink-0"
                  >
                    del
                  </button>
                </div>
              ))}
            </div>
            {selectedDocId && (
              <ConversationList
                documentId={selectedDocId}
                activeConversationId={conversationId}
                onSelect={handleSelectConversation}
                onNew={handleNewConversation}
              />
            )}
          </aside>
        )}
        <main className="flex-1 flex flex-col">
          <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-800">
            <button
              onClick={() => setShowSidebar((v) => !v)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              {showSidebar ? 'Hide sidebar' : 'Show sidebar'}
            </button>
            {selectedDocName && (
              <span className="text-sm text-gray-400 truncate">
                Document: <span className="text-gray-200">{selectedDocName}</span>
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {!selectedDocId && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Upload a document to get started</p>
              </div>
            )}
            {selectedDocId && messages.length === 0 && !streaming && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Ask a question about the document</p>
              </div>
            )}
            {messages.map((msg, i) => (
              <ChatMessage key={i} role={msg.role} content={msg.content} />
            ))}
            <div ref={messagesEndRef} />
          </div>
          {selectedDocId && (
            <ChatInput onSend={handleSend} disabled={streaming} />
          )}
        </main>
      </div>
    </div>
  );
}
