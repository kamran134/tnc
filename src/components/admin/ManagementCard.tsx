interface ManagementCardProps {
  title: string;
  description: string;
  linkLabel: string;
  colorClass: string; // icon bg, e.g. 'bg-blue-100'
  iconColorClass: string; // e.g. 'text-blue-600'
  linkColorClass: string; // e.g. 'text-blue-600'
  icon: React.ReactNode;
  onClick?: () => void;
}

export function ManagementCard({
  title,
  description,
  linkLabel,
  colorClass,
  iconColorClass,
  linkColorClass,
  icon,
  onClick,
}: ManagementCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center mb-4">
        <div className={`w-10 h-10 ${colorClass} rounded-lg flex items-center justify-center mr-3`}>
          <span className={`w-5 h-5 ${iconColorClass}`}>{icon}</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className={`flex items-center text-sm ${linkColorClass} font-medium`}>
        <span>{linkLabel}</span>
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
