interface StatCardProps {
  label: string;
  value: number | undefined;
  subLabel?: string;
  subValue?: number | undefined;
  subColor?: string;
  colorClass: string; // e.g. 'bg-blue-100', icon colors handled separately
  iconColorClass: string; // e.g. 'text-blue-600'
  isLoading: boolean;
  icon: React.ReactNode;
}

export function StatCard({
  label,
  value,
  subLabel,
  subValue,
  subColor = 'text-green-600',
  colorClass,
  iconColorClass,
  isLoading,
  icon,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`w-12 h-12 ${colorClass} rounded-lg flex items-center justify-center`}>
            <span className={`w-6 h-6 ${iconColorClass}`}>{icon}</span>
          </div>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{label}</p>
          {isLoading ? (
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse" />
          ) : (
            <p className="text-2xl font-bold text-gray-900">{value ?? 0}</p>
          )}
          {!isLoading && subLabel !== undefined && subValue !== undefined && (
            <p className={`text-xs ${subColor}`}>
              {subValue} {subLabel}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
