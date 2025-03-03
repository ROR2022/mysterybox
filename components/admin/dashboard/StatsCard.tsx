interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
}

export function StatsCard({
  title,
  value,
  description,
  trend,
  icon
}: StatsCardProps) {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="card-title text-base-content/70">{title}</h2>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {description && (
              <p className="text-sm text-base-content/60 mt-1">{description}</p>
            )}
          </div>
          {icon && <div className="text-primary text-2xl">{icon}</div>}
        </div>
        {trend && (
          <div className="mt-4">
            <span
              className={`text-sm font-medium ${
                trend.isPositive ? 'text-success' : 'text-error'
              }`}
            >
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </span>
            <span className="text-sm text-base-content/60 ml-2">vs. mes anterior</span>
          </div>
        )}
      </div>
    </div>
  );
} 