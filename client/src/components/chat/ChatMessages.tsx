import type { Message, User } from '../../types';

interface Props {
  messages: Message[];
  currentUser: User | null;
  typing: boolean;
}

export default function ChatMessages({ messages, currentUser, typing }: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
      {messages.map((msg, idx) => {
        const isSent =
          typeof msg.sender === 'string'
            ? msg.sender === currentUser?._id
            : msg.sender._id === currentUser?._id;

        return (
          <div key={msg._id || idx} className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md px-4 py-2 rounded-2xl ${
              isSent ? 'bg-blue-600 text-white' : 'bg-white shadow'
            }`}>
              <p>{msg.content}</p>
            </div>
          </div>
        );
      })}

      {typing && <div className="text-sm text-gray-400">typing...</div>}
    </div>
  );
}
