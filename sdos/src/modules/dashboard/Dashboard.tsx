import { Users, AlertTriangle, Clock, Rocket, CalendarDays, ChevronRight, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { formatDate, formatDateShort, getWeekNumber, getAutoWeekType } from '@/shared/utils/date'
import { PriorityBadge, StatusBadge, PillarBadge } from '@/shared/components/Badge'
import { useBreakpoint } from '@/shared/hooks/useMediaQuery'
import { useNavigate } from 'react-router-dom'
import { format, addDays, startOfWeek, isSameDay } from 'date-fns'
import { fr } from 'date-fns/locale'

// ─── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({
  icon: Icon, label, value, color, onClick
}: {
  icon: React.ElementType, label: string, value: number | string, color: string, onClick?: () => void
}) {
  return (
    <div
      className="card"
      onClick={onClick}
      style={{
        padding: '18px 20px',
        cursor: onClick ? 'pointer' : 'default',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="label" style={{ margin: 0 }}>{label}</span>
        <div style={{
          width: 32, height: 32, borderRadius: 10,
          background: `rgba(${hexToRgb(color)}, 0.15)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <Icon size={16} style={{ color }} />
        </div>
      </div>
      <div style={{
        fontFamily: 'JetBrains Mono, monospace',
        fontSize: 32, fontWeight: 700, color: 'var(--text)', lineHeight: 1
      }}>
        {value}
      </div>
    </div>
  )
}

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  return `${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)}`
}

// ─── Week Calendar ────────────────────────────────────────────────────────────
function WeekCalendar({ reviews, oneOnOnes }: {
  reviews: Array<{ weekOf: string }>, oneOnOnes: Array<{ date: string }>
}) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const reviewDates = new Set(reviews.map(r => r.weekOf))
  const oonDates = new Set(oneOnOnes.map(o => o.date))

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      {days.map(day => {
        const iso = format(day, 'yyyy-MM-dd')
        const isToday = isSameDay(day, today)
        const hasReview = reviewDates.has(iso)
        const hasOon = oonDates.has(iso)
        const dayLabel = format(day, 'EEE', { locale: fr })
        const dayNum = format(day, 'd')

        return (
          <div key={iso} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{
              fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em',
              color: isToday ? 'var(--sky)' : 'var(--text-3)',
              marginBottom: 4, fontWeight: isToday ? 700 : 400
            }}>
              {dayLabel}
            </div>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', margin: '0 auto',
              background: isToday ? 'var(--sky)' : 'transparent',
              border: isToday ? 'none' : '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 600,
              color: isToday ? '#020617' : 'var(--text-2)',
            }}>
              {dayNum}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 3, marginTop: 4 }}>
              {hasReview && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--sky)' }} title="Revue" />}
              {hasOon && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--fuchsia)' }} title="One-on-one" />}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, children, onSeeAll }: {
  title: string, children: React.ReactNode, onSeeAll?: () => void
}) {
  return (
    <div className="card" style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="section-subtitle" style={{ margin: 0, fontSize: 15 }}>{title}</h2>
        {onSeeAll && (
          <button
            onClick={onSeeAll}
            style={{ background: 'none', border: 'none', color: 'var(--sky)', cursor: 'pointer', fontSize: 12, display: 'flex', alignItems: 'center', gap: 2 }}
          >
            Voir tout <ChevronRight size={14} />
          </button>
        )}
      </div>
      {children}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export function Dashboard() {
  const { reps, reviews, oneOnOnes, initiatives, plan90Items, settings } = useAppStore()
  const navigate = useNavigate()
  const breakpoint = useBreakpoint()

  const weekType = settings.weekTypeSetManually ? settings.weekType : getAutoWeekType()
  const weekNum = getWeekNumber()

  // KPI calculations
  const totalReps = reps.length
  const totalFailingAccounts = reviews.slice(0, 10).reduce((s: number, r) => s + r.failingAccounts, 0)
  const totalLateTasks = reviews.slice(0, 10).reduce((s: number, r) => s + r.lateTasks, 0)
  const criticalInitiatives = initiatives.filter(i => i.priority === 'Élevée' && i.status !== 'Complété').length

  // Next 3 reviews
  const upcomingReviews = reviews.slice(0, 3)

  // Next 3 one-on-ones
  const upcomingOon = oneOnOnes.slice(0, 3)

  // Blocked initiatives for dashboard
  const blockedInitiatives = initiatives.filter(i => i.status === 'Bloqué' || i.priority === 'Élevée')

  // Plan 90 progress
  const plan90Total = plan90Items.length
  const plan90Done = plan90Items.filter(i => i.status === 'Complété').length
  const plan90Pct = plan90Total > 0 ? Math.round((plan90Done / plan90Total) * 100) : 0
  const nextPlan90 = plan90Items.filter(i => i.status !== 'Complété').slice(0, 4)

  const isCompact = breakpoint === 'mobile'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? 16 : 20 }}>
      {/* Week indicator (mobile) */}
      {isCompact && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="week-badge">
            Sem. {weekNum} — <span style={{ color: weekType === 'A' ? 'var(--sky)' : 'var(--fuchsia)', marginLeft: 4, fontWeight: 600 }}>
              Sem. {weekType} ({weekType === 'A' ? 'Pipeline' : 'One-on-one'})
            </span>
          </span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid-kpi">
        <KpiCard icon={Users} label="Reps actifs" value={totalReps} color="#38bdf8" onClick={() => navigate('/oneonone')} />
        <KpiCard icon={AlertTriangle} label="Comptes défaillants" value={totalFailingAccounts} color="#f87171" onClick={() => navigate('/revues')} />
        <KpiCard icon={Clock} label="Tâches en retard" value={totalLateTasks} color="#fbbf24" onClick={() => navigate('/revues')} />
        <KpiCard icon={Rocket} label="Initiatives critiques" value={criticalInitiatives} color="#f87171" onClick={() => navigate('/initiatives')} />
      </div>

      {/* Main 2-col grid (tablet+) or stacked (mobile) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isCompact ? '1fr' : '1fr 1fr',
        gap: isCompact ? 16 : 20,
      }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? 16 : 20 }}>
          {/* Week calendar */}
          <Section title={`Semaine ${weekNum} — calendrier`}>
            <WeekCalendar reviews={reviews} oneOnOnes={oneOnOnes} />
            <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-3)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--sky)' }} />
                Revue pipeline
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--text-3)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--fuchsia)' }} />
                One-on-one
              </div>
            </div>
          </Section>

          {/* Next reviews */}
          <Section title="Prochaines revues" onSeeAll={() => navigate('/revues')}>
            {upcomingReviews.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Aucune revue enregistrée.</p>
            ) : (
              upcomingReviews.map(rev => {
                const rep = reps.find(r => r.id === rev.repId)
                return (
                  <div key={rev.id} className="card-inner" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'var(--sky)', flexShrink: 0
                    }}>
                      {rep?.name.charAt(0) ?? '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{rep?.name ?? 'Rep inconnu'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Sem. du {formatDateShort(rev.weekOf)}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--red)', fontFamily: 'JetBrains Mono' }}>{rev.failingAccounts}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>défaillants</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--amber)', fontFamily: 'JetBrains Mono' }}>{rev.lateTasks}</div>
                        <div style={{ fontSize: 9, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>retard</div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </Section>

          {/* Next one-on-ones */}
          <Section title="Prochains one-on-one" onSeeAll={() => navigate('/oneonone')}>
            {upcomingOon.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Aucun one-on-one planifié.</p>
            ) : (
              upcomingOon.map(oon => {
                const rep = reps.find(r => r.id === oon.repId)
                return (
                  <div key={oon.id} className="card-inner" style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: '50%',
                      background: 'var(--surface-2)', border: '1px solid var(--border)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 700, color: 'var(--fuchsia)', flexShrink: 0
                    }}>
                      {rep?.name.charAt(0) ?? '?'}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep?.name ?? 'Rep inconnu'}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{formatDate(oon.date)}</div>
                    </div>
                    {oon.focusTopic && (
                      <div style={{ fontSize: 11, color: 'var(--text-3)', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {oon.focusTopic}
                      </div>
                    )}
                  </div>
                )
              })
            )}
          </Section>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: isCompact ? 16 : 20 }}>
          {/* Initiatives critiques */}
          <Section title="Initiatives prioritaires" onSeeAll={() => navigate('/initiatives')}>
            {blockedInitiatives.length === 0 ? (
              <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Aucune initiative critique.</p>
            ) : (
              blockedInitiatives.slice(0, 4).map(init => (
                <div key={init.id} className="card-inner" style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', flex: 1 }}>{init.name}</div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <PriorityBadge priority={init.priority} />
                      <StatusBadge status={init.status} />
                    </div>
                  </div>
                  {init.nextAction && (
                    <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                      <TrendingUp size={12} style={{ marginTop: 2, flexShrink: 0, color: 'var(--accent)' }} />
                      {init.nextAction}
                    </div>
                  )}
                </div>
              ))
            )}
          </Section>

          {/* Plan 90 days progress */}
          <Section title="Plan 90 jours" onSeeAll={() => navigate('/plan90')}>
            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: 'var(--text-2)' }}>Progression globale</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono' }}>
                  {plan90Done}/{plan90Total} ({plan90Pct}%)
                </span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${plan90Pct}%` }} />
              </div>
            </div>

            {/* Next items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              {nextPlan90.length === 0 ? (
                <p style={{ color: 'var(--text-3)', fontSize: 13 }}>Plan vide.</p>
              ) : (
                nextPlan90.map(item => (
                  <div key={item.id} className="card-inner" style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <PillarBadge pillar={item.pillar} />
                      <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{item.horizon}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text)', lineHeight: 1.4 }}>{item.action}</div>
                  </div>
                ))
              )}
            </div>
          </Section>

          {/* Outlook Placeholder */}
          <div className="card" style={{ padding: '18px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <CalendarDays size={18} style={{ color: 'var(--text-3)' }} />
              <h2 className="section-subtitle" style={{ margin: 0, fontSize: 15, color: 'var(--text-2)' }}>Calendrier Outlook</h2>
            </div>
            <div style={{
              border: '1px dashed var(--border)',
              borderRadius: 12,
              padding: '24px 16px',
              textAlign: 'center',
              color: 'var(--text-3)',
              fontSize: 13,
            }}>
              <CalendarDays size={28} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
              <div style={{ fontWeight: 600, marginBottom: 4 }}>Phase 2</div>
              <div style={{ fontSize: 12 }}>Intégration Microsoft Graph API</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
