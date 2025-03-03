import { formatDate } from "@/utils/dates";

interface ActivityItem {
  id: string;
  type: 'user' | 'box';
  title: string;
  subtitle: string;
  date: string;
}

interface ActivityListProps {
  title: string;
  items: ActivityItem[];
}

export function ActivityList({ title, items }: ActivityListProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title text-base-content/70 mb-4">{title}</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-start gap-4">
              <div className={`rounded-full p-2 ${
                item.type === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
              }`}>
                {item.type === 'user' ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-primary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-secondary"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-base-content truncate">
                  {item.title}
                </p>
                <p className="text-sm text-base-content/60 truncate">
                  {item.subtitle}
                </p>
              </div>
              <div className="text-sm text-base-content/60">
                {formatDate(item.date)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 