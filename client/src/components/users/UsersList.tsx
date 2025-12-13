import type { User } from '../../types';

interface Props {
  users: User[];
  selectedUser: User | null;
  unreadCounts: Record<string, number>;
  onSelect: (user: User) => void;
}

export default function UsersList({
  users,
  selectedUser,
  unreadCounts,
  onSelect
}: Props) {
  return (
    <div className="w-80 bg-white border-r overflow-y-auto">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Messages</h3>
      </div>

      {users.map(user => (
        <button
          key={user._id}
          onClick={() => onSelect(user)}
          className={`w-full p-4 flex gap-3 ${
            selectedUser?._id === user._id ? 'bg-blue-50' : ''
          }`}
        >
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center">
              {user.username[0].toUpperCase()}
            </div>
            {user.isOnline && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex-1 text-left">
            <div className="flex justify-between">
              <p className="font-medium">{user.username}</p>
              {unreadCounts[user._id] > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 rounded-full">
                  {unreadCounts[user._id]}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
