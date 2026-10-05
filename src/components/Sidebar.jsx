import { Plus, MessageSquare, Trash2, PanelLeftClose, PanelLeftOpen } from "lucide-react";

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;

  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function Sidebar({
  open,
  onToggle,
  chats,
  activeChatId,
  loading,
  onSelect,
  onNewChat,
  onDelete,
}) {
  return (
    <>
      {/* Toggle button - always visible, sits at top-left */}
      <button
        onClick={onToggle}
        aria-label={open ? "Close sidebar" : "Open sidebar"}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg
                   bg-white dark:bg-gray-800
                   border border-gray-200 dark:border-gray-700
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition shadow-sm"
      >
        {open ? (
          <PanelLeftClose className="w-5 h-5" />
        ) : (
          <PanelLeftOpen className="w-5 h-5" />
        )}
      </button>

      {/* Backdrop on mobile */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col
                    bg-gray-50 dark:bg-gray-900
                    border-r border-gray-200 dark:border-gray-700
                    transition-transform duration-300 ease-in-out
                    ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-3 pt-14">
          <button
            onClick={onNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg
                       border border-gray-200 dark:border-gray-700
                       bg-white dark:bg-gray-800
                       hover:bg-gray-100 dark:hover:bg-gray-700
                       transition text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* History list */}
        <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 px-2 py-2">
            History
          </p>

          {loading && (
            <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-4">
              Loading history...
            </p>
          )}

          {!loading && chats.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-4">
              No chats yet. Ask your first question!
            </p>
          )}

          {!loading &&
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelect(chat)}
                className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer
                           transition text-sm
                           ${
                             activeChatId === chat.id
                               ? "bg-gray-200 dark:bg-gray-700"
                               : "hover:bg-gray-100 dark:hover:bg-gray-800"
                           }`}
              >
                <MessageSquare className="w-4 h-4 shrink-0 text-gray-400" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-gray-800 dark:text-gray-200">
                    {chat.question}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    {formatDate(chat.createdAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(chat.id);
                  }}
                  aria-label="Delete chat"
                  className="opacity-0 group-hover:opacity-100 p-1 rounded
                             hover:bg-gray-200 dark:hover:bg-gray-600
                             transition shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
            Veritas
          </p>
        </div>
      </aside>
    </>
  );
}
