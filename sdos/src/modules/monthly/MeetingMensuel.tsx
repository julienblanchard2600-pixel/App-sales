import { useState, useEffect } from 'react'
import { Plus, Trash2, Copy, Check } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { ConfirmModal } from '@/shared/components/Modal'
import { Field } from '@/shared/components/Field'
import { EmptyState } from '@/shared/components/EmptyState'
import { useBreakpoint } from '@/shared/hooks/useMediaQuery'
import type { MonthlyMeeting } from '@/types'

const AGENDA_SECTIONS = [
  { key: 'monthReview', label: 'Revue du mois', color: '#38bdf8', num: 1 },
  { key: 'kpi', label: 'KPI', color: '#34d399', num: 2 },
  { key: 'announcements', label: 'Annonces entreprise', color: '#fbbf24', num: 3 },
  { key: 'salesTraining', label: 'Formation ventes', color: '#e879f9', num: 4 },
  { key: 'ids', label: 'IDS / EOS', color: '#fb923c', num: 5 },
  { key: 'bestPractices', label: 'Best practices', color: '#a78bfa', num: 6 },
] as const

// ─── Agenda Preview ───────────────────────────────────────────────────────────
function AgendaPreview({ meeting }: { meeting: Partial<MonthlyMeeting> }) {
  const [copied, setCopied] = useState(false)

  function buildText() {
    const lines = [`ORDRE DU JOUR — ${meeting.month ?? ''}`, '']
    AGENDA_SECTIONS.forEach(section => {
      const value = meeting[section.key as keyof MonthlyMeeting] as string | undefined
      lines.push(`${section.num}. ${section.label.toUpperCase()}`)
      lines.push(value?.trim() || '(À compléter…)')
      lines.push('')
    })
    return lines.join('\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildText()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 17, fontWeight: 700, color: 'var(--text)' }}>
            {meeting.month ?? 'Mois à définir'}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>Aperçu de l'ordre du jour</div>
        </div>
        <button
          className="btn btn-secondary"
          onClick={handleCopy}
          style={{ gap: 6, fontSize: 12 }}
        >
          {copied ? <Check size={14} style={{ color: 'var(--emerald)' }} /> : <Copy size={14} />}
          {copied ? 'Copié !' : 'Copier'}
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {AGENDA_SECTIONS.map(section => {
          const value = meeting[section.key as keyof MonthlyMeeting] as string | undefined
          const hasContent = value?.trim()
          const hex = section.color.replace('#', '')
          const r = parseInt(hex.slice(0,2),16)
          const g = parseInt(hex.slice(2,4),16)
          const b = parseInt(hex.slice(4,6),16)

          return (
            <div
              key={section.key}
              style={{
                padding: '12px 14px',
                borderRadius: 12,
                background: `rgba(${r},${g},${b},0.06)`,
                borderLeft: `3px solid ${section.color}`,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: section.color,
                  color: '#020617',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700, flexShrink: 0
                }}>
                  {section.num}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: section.color }}>
                  {section.label}
                </div>
              </div>
              <div style={{
                fontSize: 13, lineHeight: 1.6,
                color: hasContent ? 'var(--text-2)' : 'var(--text-3)',
                fontStyle: hasContent ? 'normal' : 'italic',
                whiteSpace: 'pre-wrap',
              }}>
                {hasContent || 'À compléter…'}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Meeting Editor ────────────────────────────────────────────────────────────
function MeetingEditor({ meeting, onChange }: {
  meeting: Partial<MonthlyMeeting>
  onChange: (updates: Partial<MonthlyMeeting>) => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <Field label="Mois de référence" required>
        <input
          type="text"
          value={meeting.month ?? ''}
          onChange={e => onChange({ month: e.target.value })}
          placeholder="Ex: Mars 2026"
        />
      </Field>
      {AGENDA_SECTIONS.map(section => (
        <Field key={section.key} label={`${section.num}. ${section.label}`}>
          <textarea
            value={(meeting[section.key as keyof MonthlyMeeting] as string) ?? ''}
            onChange={e => onChange({ [section.key]: e.target.value })}
            placeholder="À compléter…"
            style={{ minHeight: 80, borderLeft: `3px solid ${section.color}`, borderRadius: '0 10px 10px 0' }}
          />
        </Field>
      ))}
    </div>
  )
}

// ─── Meeting List Item ────────────────────────────────────────────────────────
function MeetingItem({ meeting, selected, onClick, onDelete }: {
  meeting: MonthlyMeeting, selected: boolean, onClick: () => void, onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <div
        className="card"
        onClick={onClick}
        style={{
          padding: '12px 16px', cursor: 'pointer',
          borderColor: selected ? 'var(--sky)' : undefined,
          background: selected ? 'rgba(56,189,248,0.05)' : undefined,
          display: 'flex', alignItems: 'center', gap: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'Fraunces, serif' }}>{meeting.month}</div>
          {meeting.monthReview && (
            <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {meeting.monthReview}
            </div>
          )}
        </div>
        <button
          className="btn btn-danger"
          style={{ padding: '4px 7px', minHeight: 0 }}
          onClick={e => { e.stopPropagation(); setShowDelete(true) }}
        >
          <Trash2 size={12} />
        </button>
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={onDelete}
        message={`Supprimer le meeting de ${meeting.month} ?`}
      />
    </>
  )
}

// ─── Main MeetingMensuel ──────────────────────────────────────────────────────
export function MeetingMensuel() {
  const { monthlyMeetings, addMonthlyMeeting, updateMonthlyMeeting, deleteMonthlyMeeting } = useAppStore()
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  const [selectedId, setSelectedId] = useState<string | null>(monthlyMeetings[0]?.id ?? null)
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const [draft, setDraft] = useState<Partial<MonthlyMeeting>>({})
  const [isDirty, setIsDirty] = useState(false)

  useEffect(() => {
    const handler = () => createNew()
    window.addEventListener('sdos:new', handler)
    return () => window.removeEventListener('sdos:new', handler)
  }, [])

  const selectedMeeting = monthlyMeetings.find(m => m.id === selectedId) ?? null

  useEffect(() => {
    if (selectedMeeting) {
      setDraft({ ...selectedMeeting })
      setIsDirty(false)
    }
  }, [selectedId])

  function handleChange(updates: Partial<MonthlyMeeting>) {
    setDraft(d => ({ ...d, ...updates }))
    setIsDirty(true)
  }

  function handleSave() {
    if (selectedMeeting && isDirty) {
      updateMonthlyMeeting(selectedMeeting.id, draft)
      setIsDirty(false)
    }
  }

  function createNew() {
    const newMeeting = {
      month: `Nouveau meeting ${new Date().toLocaleDateString('fr-CA', { month: 'long', year: 'numeric' })}`,
      monthReview: '', kpi: '', announcements: '', salesTraining: '', ids: '', bestPractices: ''
    }
    addMonthlyMeeting(newMeeting as Parameters<typeof addMonthlyMeeting>[0])
    // Select the new one (it'll be at index 0 after add)
    setTimeout(() => {
      const store = useAppStore.getState()
      setSelectedId(store.monthlyMeetings[0]?.id ?? null)
    }, 0)
  }

  const editorContent = draft

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="section-title">Meeting mensuel</h1>
          <button className="btn btn-primary" onClick={createNew}><Plus size={15} /></button>
        </div>

        {/* List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {monthlyMeetings.map(m => (
            <MeetingItem
              key={m.id} meeting={m} selected={selectedId === m.id}
              onClick={() => setSelectedId(m.id)}
              onDelete={() => { deleteMonthlyMeeting(m.id); if (selectedId === m.id) setSelectedId(monthlyMeetings.find(x => x.id !== m.id)?.id ?? null) }}
            />
          ))}
        </div>

        {selectedMeeting && (
          <>
            <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
              {(['edit', 'preview'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)} style={{
                  flex: 1, padding: '10px', background: tab === t ? 'var(--surface-2)' : 'transparent',
                  border: 'none', color: tab === t ? 'var(--text)' : 'var(--text-3)',
                  cursor: 'pointer', fontWeight: tab === t ? 600 : 400, fontSize: 13
                }}>
                  {t === 'edit' ? 'Éditer' : 'Aperçu'}
                </button>
              ))}
            </div>

            <div className="card" style={{ padding: '16px' }}>
              {tab === 'edit' ? (
                <>
                  <MeetingEditor meeting={editorContent} onChange={handleChange} />
                  {isDirty && (
                    <button className="btn btn-primary" onClick={handleSave} style={{ width: '100%', marginTop: 16 }}>
                      Enregistrer
                    </button>
                  )}
                </>
              ) : (
                <AgendaPreview meeting={editorContent} />
              )}
            </div>
          </>
        )}

        {monthlyMeetings.length === 0 && (
          <EmptyState message="Aucun meeting. Créez votre premier meeting mensuel." action={
            <button className="btn btn-primary" onClick={createNew}><Plus size={15} /> Nouveau meeting</button>
          } />
        )}
      </div>
    )
  }

  // Desktop / tablet: 3-col layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="section-title">Meeting mensuel des ventes</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Préparez, structurez et documentez la réunion mensuelle</p>
        </div>
        <button className="btn btn-primary" onClick={createNew}>
          <Plus size={16} /> Nouveau meeting
        </button>
      </div>

      {monthlyMeetings.length === 0 ? (
        <EmptyState message="Aucun meeting mensuel." action={
          <button className="btn btn-primary" onClick={createNew}><Plus size={15} /> Nouveau meeting</button>
        } />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 1fr', gap: 20, alignItems: 'start' }}>
          {/* List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 4 }}>
              Meetings ({monthlyMeetings.length})
            </div>
            {monthlyMeetings.map(m => (
              <MeetingItem
                key={m.id} meeting={m} selected={selectedId === m.id}
                onClick={() => setSelectedId(m.id)}
                onDelete={() => { deleteMonthlyMeeting(m.id); if (selectedId === m.id) setSelectedId(monthlyMeetings.find(x => x.id !== m.id)?.id ?? null) }}
              />
            ))}
          </div>

          {/* Editor */}
          {selectedMeeting ? (
            <>
              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <h2 className="section-subtitle" style={{ margin: 0, fontSize: 15 }}>Éditeur</h2>
                  {isDirty && (
                    <button className="btn btn-primary" onClick={handleSave} style={{ fontSize: 12, padding: '6px 14px' }}>
                      Enregistrer
                    </button>
                  )}
                </div>
                <MeetingEditor meeting={editorContent} onChange={handleChange} />
              </div>

              <div className="card" style={{ padding: '20px', position: 'sticky', top: 80 }}>
                <AgendaPreview meeting={editorContent} />
              </div>
            </>
          ) : (
            <div style={{ gridColumn: '2 / -1' }}>
              <EmptyState message="Sélectionnez un meeting pour l'éditer." />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
