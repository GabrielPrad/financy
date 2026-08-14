import {
  Banknote,
  BookOpen,
  Briefcase,
  Bus,
  Car,
  CircleDollarSign,
  Dumbbell,
  Gift,
  GraduationCap,
  HeartPulse,
  House,
  Laptop,
  PartyPopper,
  PiggyBank,
  Plane,
  Receipt,
  ShoppingBag,
  ShoppingCart,
  Smartphone,
  Sparkles,
  Tag,
  Utensils,
  Wallet,
  Wifi,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

/** Ícones disponíveis no formulário de categoria (chave salva no banco). */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  tag: Tag,
  wallet: Wallet,
  banknote: Banknote,
  'piggy-bank': PiggyBank,
  'circle-dollar-sign': CircleDollarSign,
  briefcase: Briefcase,
  laptop: Laptop,
  utensils: Utensils,
  'shopping-cart': ShoppingCart,
  'shopping-bag': ShoppingBag,
  house: House,
  receipt: Receipt,
  wifi: Wifi,
  smartphone: Smartphone,
  car: Car,
  bus: Bus,
  plane: Plane,
  'heart-pulse': HeartPulse,
  dumbbell: Dumbbell,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'party-popper': PartyPopper,
  gift: Gift,
  sparkles: Sparkles,
}

export const CATEGORY_ICON_KEYS = Object.keys(CATEGORY_ICONS)

/** Paleta sugerida no seletor de cor da categoria. */
export const CATEGORY_COLORS = [
  '#7C3AED',
  '#8B5CF6',
  '#6366F1',
  '#3B82F6',
  '#0EA5E9',
  '#06B6D4',
  '#14B8A6',
  '#22C55E',
  '#84CC16',
  '#EAB308',
  '#F97316',
  '#EF4444',
  '#EC4899',
  '#64748B',
]

interface CategoryIconProps {
  icon?: string | null
  color: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: 'size-8 rounded-lg [&_svg]:size-4',
  md: 'size-10 rounded-xl [&_svg]:size-4.5',
  lg: 'size-12 rounded-xl [&_svg]:size-5.5',
}

/** Quadradinho colorido com o ícone da categoria — usado em listas e cards. */
export function CategoryIcon({ icon, color, className, size = 'md' }: CategoryIconProps) {
  const Icon = (icon && CATEGORY_ICONS[icon]) || Tag

  return (
    <span
      className={cn('flex shrink-0 items-center justify-center', sizes[size], className)}
      style={{ backgroundColor: `${color}1A`, color }}
      aria-hidden
    >
      <Icon />
    </span>
  )
}
