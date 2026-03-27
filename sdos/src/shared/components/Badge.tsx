import type { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  color?: string
  className?: string
}

export function Badge({ children, color = '#94a3b8', className = '' }: BadgeProps) {
  // Parse hex to rgba
  const hex = color.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return (
    <span
      className={`badge ${className}`}
      style={{
        background: `rgba(${r},${g},${b},0.15)`,
        color,
        border: `1px solid rgba(${r},${g},${b},0.25)`,
      }}
    >
      {children}
    </span>
  )
}

// Priority badges
export function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    'Élevée': '#f87171',
    'Moyenne': '#fbbf24',
    'Faible': '#94a3b8',
  }
  return <Badge color={colors[priority] ?? '#94a3b8'}>{priority}</Badge>
}

// Status badges
export function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    'En cours': '#38bdf8',
    'Bloqué': '#f87171',
    'Complété': '#34d399',
    'À démarrer': '#94a3b8',
  }
  return <Badge color={colors[status] ?? '#94a3b8'}>{status}</Badge>
}

// Level badge
export function LevelBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    'Junior': '#fbbf24',
    'Rep': '#38bdf8',
    'Senior': '#34d399',
    'Team Lead': '#e879f9',
  }
  return <Badge color={colors[level] ?? '#94a3b8'}>{level}</Badge>
}

// Pillar badge
export function PillarBadge({ pillar }: { pillar: string }) {
  const colors: Record<string, string> = {
    'Comprendre': '#38bdf8',
    'Stabiliser': '#34d399',
    'Optimiser': '#fbbf24',
    'Développer': '#e879f9',
    'Institutionnaliser': '#fb923c',
  }
  return <Badge color={colors[pillar] ?? '#94a3b8'}>{pillar}</Badge>
}
