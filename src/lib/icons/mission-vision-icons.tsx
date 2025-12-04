import {
  Target,
  Lightbulb,
  Rocket,
  TrendingUp,
  Award,
  Users,
  Globe,
  Shield,
  Zap,
  Star,
  Heart,
  Briefcase,
  CheckCircle,
  Eye,
  Compass,
  Flag,
  Trophy,
  Sparkles,
  PieChart,
  LineChart,
} from 'lucide-react';
import { LucideIcon } from 'lucide-react';

export interface IconOption {
  name: string;
  label: string;
  icon: LucideIcon;
  category: 'mission' | 'vision' | 'both';
}

export const MISSION_VISION_ICONS: IconOption[] = [
  { name: 'target', label: 'Target', icon: Target, category: 'both' },
  { name: 'lightbulb', label: 'Innovation', icon: Lightbulb, category: 'mission' },
  { name: 'rocket', label: 'Growth', icon: Rocket, category: 'vision' },
  { name: 'trending-up', label: 'Progress', icon: TrendingUp, category: 'both' },
  { name: 'award', label: 'Excellence', icon: Award, category: 'mission' },
  { name: 'users', label: 'Team', icon: Users, category: 'both' },
  { name: 'globe', label: 'Global', icon: Globe, category: 'vision' },
  { name: 'shield', label: 'Trust', icon: Shield, category: 'mission' },
  { name: 'zap', label: 'Speed', icon: Zap, category: 'mission' },
  { name: 'star', label: 'Quality', icon: Star, category: 'mission' },
  { name: 'heart', label: 'Passion', icon: Heart, category: 'both' },
  { name: 'briefcase', label: 'Professional', icon: Briefcase, category: 'both' },
  { name: 'check-circle', label: 'Success', icon: CheckCircle, category: 'both' },
  { name: 'eye', label: 'Vision', icon: Eye, category: 'vision' },
  { name: 'compass', label: 'Direction', icon: Compass, category: 'vision' },
  { name: 'flag', label: 'Goal', icon: Flag, category: 'vision' },
  { name: 'trophy', label: 'Achievement', icon: Trophy, category: 'both' },
  { name: 'sparkles', label: 'Innovation', icon: Sparkles, category: 'mission' },
  { name: 'pie-chart', label: 'Strategy', icon: PieChart, category: 'both' },
  { name: 'line-chart', label: 'Growth', icon: LineChart, category: 'vision' },
];

// Получить иконку по имени
export const getIconByName = (iconName: string | null | undefined): LucideIcon | null => {
  if (!iconName) return null;
  const iconOption = MISSION_VISION_ICONS.find(icon => icon.name === iconName);
  return iconOption ? iconOption.icon : null;
};

// Получить иконки для миссий
export const getMissionIcons = (): IconOption[] => {
  return MISSION_VISION_ICONS.filter(icon => icon.category === 'mission' || icon.category === 'both');
};

// Получить иконки для визий
export const getVisionIcons = (): IconOption[] => {
  return MISSION_VISION_ICONS.filter(icon => icon.category === 'vision' || icon.category === 'both');
};
