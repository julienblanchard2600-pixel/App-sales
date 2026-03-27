import type { ReactNode } from 'react'

interface EmptyStateProps {
  message: string
  action?: ReactNode
  icon?: ReactNode
}

export function EmptyState({ message, action, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      {icon && <div style={{ color: 'var(--text-3)', marginBottom: 4 }}>{icon}</div>}
      <p style={{ color: 'var(--text-3)', fontSize: 14, maxWidth: 300, margin: 0 }}>{message}</p>
      {action}
    </div>
  )
}
