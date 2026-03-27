import { useState, useEffect } from 'react'
import { Plus, Trash2, AlertTriangle, Clock } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Modal, ConfirmModal } from '@/shared/components/Modal'
import { Field, FormGrid, FullSpan } from '@/shared/components/Field'
import { EmptyState } from '@/shared/components/EmptyState'
import { formatDateShort } from '@/shared/utils/date'
import { LevelBadge } from '@/shared/components/Badge'

// ─── Review Form ──────────────────────────────────────────────────────────────
function ReviewForm({ initial, onSave, onCancel }: {
  initial?: Partial<ReturnType<typeof useAppStore.getState>['reviews'][0]>
  onSave: (data: Record<string, string | number>) => void
  onCancel: () => void
}) {
  const { reps } = useAppStore()
  const [form, setForm] = useState({
    repId: initial?.repId ?? '',
    weekOf: initial?.weekOf ?? '',
    failingAccounts: String(initial?.failingAccounts ?? ''),
    lateTasks: String(initial?.lateTasks ?? ''),
    activitySummary: initial?.activitySummary ?? '',
    roadblocks: initial?.roadblocks ?? '',
    nextMeetingPrep: initial?.nextMeetingPrep ?? '',
    directorActions: initial?.directorActions ?? '',
    repActions: initial?.repActions ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.repId) e.repId = 'Champ obligatoire'
    if (!form.weekOf) e.weekOf = 'Champ obligatoire'
    if (form.failingAccounts === '' || isNaN(Number(form.failingAccounts))) e.failingAccounts = 'Nombre requis'
    if (form.lateTasks === '' || isNaN(Number(form.lateTasks))) e.lateTasks = 'Nombre requis'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave({
      ...form,
      failingAccounts: Number(form.failingAccounts),
      lateTasks: Number(form.lateTasks),
    })
  }

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      <FormGrid>
        <Field label="Représentant" required error={errors.repId}>
          <select value={form.repId} onChange={e => set('repId', e.target.value)}>
            <option value="" disabled>Sélectionner un rep…</option>
            {reps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </Field>
        <Field label="Semaine du" required error={errors.weekOf}>
          <input type="date" value={form.weekOf} onChange={e => set('weekOf', e.target.value)} />
        </Field>
        <Field label="Comptes défaillants" required error={errors.failingAccounts}>
          <input
            type="number" inputMode="numeric" min="0"
            value={form.failingAccounts} onChange={e => set('failingAccounts', e.target.value)}
            placeholder="0"
          />
        </Field>
        <Field label="Tâches en retard" required error={errors.lateTasks}>
          <input
            type="number" inputMode="numeric" min="0"
            value={form.lateTasks} onChange={e => set('lateTasks', e.target.value)}
            placeholder="0"
          />
        </Field>
        <FullSpan>
          <Field label="Résumé activité de la semaine">
            <input type="text" value={form.activitySummary} onChange={e => set('activitySummary', e.target.value)} placeholder="Rencontres, appels, soumissions…" />
          </Field>
        </FullSpan>
        <FullSpan>
          <Field label="Roadblocks">
            <textarea value={form.roadblocks} onChange={e => set('roadblocks', e.target.value)} placeholder="Obstacles rencontrés…" />
          </Field>
        </FullSpan>
        <FullSpan>
          <Field label="Préparation prochaine rencontre">
            <textarea value={form.nextMeetingPrep} onChange={e => set('nextMeetingPrep', e.target.value)} placeholder="Client, objectif, next step attendu…" />
          </Field>
        </FullSpan>
        <Field label="Actions du directeur">
          <textarea value={form.directorActions} onChange={e => set('directorActions', e.target.value)} placeholder="Mes engagements…" style={{ minHeight: 70 }} />
        </Field>
        <Field label="Actions du rep">
          <textarea value={form.repActions} onChange={e => set('repActions', e.target.value)} placeholder="Engagements du rep…" style={{ minHeight: 70 }} />
        </Field>
      </FormGrid>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
      </div>
    </>
  )
}

// ─── Review Card ──────────────────────────────────────────────────────────────
function ReviewCard({ review, onEdit, onDelete }: {
  review: ReturnType<typeof useAppStore.getState>['reviews'][0]
  onEdit: () => void
  onDelete: () => void
}) {
  const { reps } = useAppStore()
  const rep = reps.find(r => r.id === review.repId)
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <div
        className="card"
        style={{ padding: '16px 20px', cursor: 'pointer' }}
        onClick={onEdit}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--surface-2)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: 'var(--sky)', flexShrink: 0
            }}>
              {rep?.name.charAt(0) ?? '?'}
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{rep?.name ?? 'Rep inconnu'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Sem. du {formatDateShort(review.weekOf)}</div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {rep && <LevelBadge level={rep.level} />}
            <button
              className="btn btn-danger"
              style={{ padding: '4px 8px', minHeight: 0, fontSize: 12 }}
              onClick={e => { e.stopPropagation(); setShowDelete(true) }}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: 'flex', gap: 12, marginBottom: review.activitySummary ? 12 : 0 }}>
          <div className="card-inner" style={{ padding: '8px 14px', flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <AlertTriangle size={14} style={{ color: 'var(--red)' }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--red)', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
                {review.failingAccounts}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>défaillants</div>
            </div>
          </div>
          <div className="card-inner" style={{ padding: '8px 14px', flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={14} style={{ color: 'var(--amber)' }} />
            <div>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--amber)', fontFamily: 'JetBrains Mono', lineHeight: 1 }}>
                {review.lateTasks}
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>en retard</div>
            </div>
          </div>
        </div>

        {/* Activity summary */}
        {review.activitySummary && (
          <div style={{ fontSize: 12, color: 'var(--text-2)', marginTop: 4 }}>
            {review.activitySummary}
          </div>
        )}

        {/* Next meeting prep preview */}
        {review.nextMeetingPrep && (
          <div style={{ marginTop: 10, padding: '8px 12px', background: 'rgba(56, 189, 248, 0.06)', borderRadius: 8, borderLeft: '2px solid var(--sky)' }}>
            <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sky)', marginBottom: 3 }}>Prochaine rencontre</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{review.nextMeetingPrep}</div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={onDelete}
        message={`Supprimer la revue de ${rep?.name ?? 'ce rep'} pour la semaine du ${formatDateShort(review.weekOf)} ?`}
      />
    </>
  )
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
function ReviewModal({ review, onClose }: {
  review: ReturnType<typeof useAppStore.getState>['reviews'][0] | null
  onClose: () => void
}) {
  const { reps, addReview, updateReview } = useAppStore()
  const isNew = !review
  const rep = review ? reps.find(r => r.id === review.repId) : null

  function handleSave(data: Record<string, string | number>) {
    if (isNew) {
      addReview(data as Parameters<typeof addReview>[0])
    } else {
      updateReview(review!.id, data as Parameters<typeof updateReview>[1])
    }
    onClose()
  }

  return (
    <Modal
      open={true}
      onClose={onClose}
      title={isNew ? 'Nouvelle revue' : `Revue — ${rep?.name ?? 'Rep'}`}
    >
      <ReviewForm
        initial={review ?? undefined}
        onSave={handleSave}
        onCancel={onClose}
      />
    </Modal>
  )
}

// ─── Main Revues ──────────────────────────────────────────────────────────────
export function Revues() {
  const { reviews, reps, deleteReview } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingReview, setEditingReview] = useState<typeof reviews[0] | null>(null)
  const [filterRepId, setFilterRepId] = useState('')
  const [filterWeek, setFilterWeek] = useState('')

  // Cmd+N shortcut
  useEffect(() => {
    const handler = () => setModalOpen(true)
    window.addEventListener('sdos:new', handler)
    return () => window.removeEventListener('sdos:new', handler)
  }, [])

  const filtered = reviews.filter(r => {
    if (filterRepId && r.repId !== filterRepId) return false
    if (filterWeek && r.weekOf !== filterWeek) return false
    return true
  })

  function openNew() {
    setEditingReview(null)
    setModalOpen(true)
  }

  function openEdit(rev: typeof reviews[0]) {
    setEditingReview(rev)
    setModalOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 className="section-title">Revues d'opportunités</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Semaine A — Revues pipeline avec chaque rep</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nouvelle revue
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <select
          value={filterRepId}
          onChange={e => setFilterRepId(e.target.value)}
          style={{ width: 'auto', minWidth: 160 }}
        >
          <option value="">Tous les reps</option>
          {reps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </select>
        <input
          type="date"
          value={filterWeek}
          onChange={e => setFilterWeek(e.target.value)}
          style={{ width: 'auto' }}
          title="Filtrer par semaine"
        />
        {(filterRepId || filterWeek) && (
          <button
            className="btn btn-secondary"
            style={{ padding: '8px 12px' }}
            onClick={() => { setFilterRepId(''); setFilterWeek('') }}
          >
            Effacer
          </button>
        )}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          message="Aucune revue enregistrée. Créez votre première revue."
          action={
            <button className="btn btn-primary" onClick={openNew}>
              <Plus size={15} /> Nouvelle revue
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gap: 14 }}>
          {filtered.map(rev => (
            <ReviewCard
              key={rev.id}
              review={rev}
              onEdit={() => openEdit(rev)}
              onDelete={() => deleteReview(rev.id)}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <ReviewModal
          review={editingReview}
          onClose={() => { setModalOpen(false); setEditingReview(null) }}
        />
      )}
    </div>
  )
}
