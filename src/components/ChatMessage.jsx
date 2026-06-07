import ReactMarkdown from 'react-markdown';

export default function ChatMessage({ role, content }) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 min-h-[2.5rem] ${
          isUser
            ? 'bg-blue-600 text-white'
            : 'bg-gray-800 text-gray-100'
        }`}
      >
        {isUser ? (
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        ) : (
          <div className="text-sm prose prose-invert max-w-none">
            {content ? (
              <ReactMarkdown>{content}</ReactMarkdown>
            ) : (
              <span className="inline-block w-2 h-4 bg-blue-400 animate-pulse" />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
