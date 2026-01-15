import {
  Calculator,
  FileText,
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  Shield,
  Scale,
  BookOpen,
  Landmark,
  ClipboardCheck,
  PieChart,
  Receipt,
  Building,
  Wallet,
  BarChart,
  FileCheck,
  Percent,
  CreditCard,
  FilePlus,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface ServiceCategoryIconOption {
  name: string;
  label: string;
  icon: LucideIcon;
}

export const SERVICE_CATEGORY_ICONS: ServiceCategoryIconOption[] = [
  { name: 'calculator', label: 'Calculator', icon: Calculator },
  { name: 'file-text', label: 'Document', icon: FileText },
  { name: 'trending-up', label: 'Growth', icon: TrendingUp },
  { name: 'users', label: 'Team', icon: Users },
  { name: 'briefcase', label: 'Business', icon: Briefcase },
  { name: 'dollar-sign', label: 'Finance', icon: DollarSign },
  { name: 'shield', label: 'Protection', icon: Shield },
  { name: 'scale', label: 'Legal', icon: Scale },
  { name: 'book-open', label: 'Knowledge', icon: BookOpen },
  { name: 'landmark', label: 'Institution', icon: Landmark },
  { name: 'clipboard-check', label: 'Compliance', icon: ClipboardCheck },
  { name: 'pie-chart', label: 'Analytics', icon: PieChart },
  { name: 'receipt', label: 'Receipt', icon: Receipt },
  { name: 'building', label: 'Company', icon: Building },
  { name: 'wallet', label: 'Accounting', icon: Wallet },
  { name: 'bar-chart', label: 'Reports', icon: BarChart },
  { name: 'file-check', label: 'Audit', icon: FileCheck },
  { name: 'percent', label: 'Tax', icon: Percent },
  { name: 'credit-card', label: 'Payment', icon: CreditCard },
  { name: 'file-plus', label: 'New Document', icon: FilePlus },
];

// Получить иконку по имени
export const getServiceCategoryIconByName = (iconName: string | null | undefined): LucideIcon | null => {
  if (!iconName) return null;
  const iconOption = SERVICE_CATEGORY_ICONS.find(icon => icon.name === iconName);
  return iconOption ? iconOption.icon : null;
};

// Получить все иконки
export const getServiceCategoryIcons = (): ServiceCategoryIconOption[] => {
  return SERVICE_CATEGORY_ICONS;
};
