import { useState, useEffect } from 'react'
import { Plus, Trash2, AlertTriangle, TrendingUp } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Modal, ConfirmModal } from '@/shared/components/Modal'
import { Field, FormGrid, FullSpan } from '@/shared/components/Field'
import { EmptyState } from '@/shared/components/EmptyState'
import { PriorityBadge, StatusBadge } from '@/shared/components/Badge'
import { formatDateShort } from '@/shared/utils/date'
import type { Initiative, Priority, InitiativeStatus } from '@/types'

const PRIORITIES: Priority[] = ['Élevée', 'Moyenne', 'Faible']
const STATUSES: InitiativeStatus[] = ['À démarrer', 'En cours', 'Bloqué', 'Complété']

// ─── Initiative Form ──────────────────────────────────────────────────────────
function InitiativeForm({ initial, onSave, onCancel }: {
  initial?: Partial<Initiative>
  onSave: (data: Partial<Initiative>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<Initiative>>({
    name: '', priority: 'Moyenne', status: 'À démarrer',
    owner: 'Julien', dueDate: '', expectedValue: '', nextAction: '',
    ...initial,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.name?.trim()) e.name = 'Champ obligatoire'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave(form)
  }

  const set = (k: keyof Initiative, v: string) => setForm((f: Partial<Initiative>) => ({ ...f, [k]: v }))

  return (
    <>
      <FormGrid>
        <FullSpan>
          <Field label="Nom de l'initiative" required error={errors.name}>
            <input type="text" value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="Ex: Embauche Ottawa" />
          </Field>
        </FullSpan>
        <Field label="Priorité" required>
          <select value={form.priority ?? 'Moyenne'} onChange={e => set('priority', e.target.value as Priority)}>
            {PRIORITIES.map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <Field label="Statut" required>
          <select value={form.status ?? 'À démarrer'} onChange={e => set('status', e.target.value as InitiativeStatus)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
        <Field label="Responsable">
          <input type="text" value={form.owner ?? 'Julien'} onChange={e => set('owner', e.target.value)} />
        </Field>
        <Field label="Échéance">
          <input type="date" value={form.dueDate ?? ''} onChange={e => set('dueDate', e.target.value)} />
        </Field>
        <FullSpan>
          <Field label="Valeur attendue">
            <textarea value={form.expectedValue ?? ''} onChange={e => set('expectedValue', e.target.value)} placeholder="Quel résultat vise-t-on ?" />
          </Field>
        </FullSpan>
        <FullSpan>
          <Field label="Prochaine action">
            <textarea value={form.nextAction ?? ''} onChange={e => set('nextAction', e.target.value)} placeholder="Action concrète à poser maintenant…" style={{ minHeight: 70 }} />
          </Field>
        </FullSpan>
      </FormGrid>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
      </div>
    </>
  )
}

// ─── Initiative Card ──────────────────────────────────────────────────────────
function InitiativeCard({ initiative, onEdit, onDelete }: {
  initiative: Initiative, onEdit: () => void, onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)
  const isBlocked = initiative.status === 'Bloqué'
  const isCompleted = initiative.status === 'Complété'

  return (
    <>
      <div
        className="card"
        onClick={onEdit}
        style={{
          padding: '16px 18px',
          cursor: 'pointer',
          opacity: isCompleted ? 0.65 : 1,
          background: isBlocked ? 'rgba(248,113,113,0.04)' : undefined,
          borderColor: isBlocked ? 'rgba(248,113,113,0.3)' : undefined,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' }}>
              {isBlocked && <AlertTriangle size={14} style={{ color: 'var(--red)', flexShrink: 0 }} />}
              <PriorityBadge priority={initiative.priority} />
              <StatusBadge status={initiative.status} />
            </div>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Fraunces, serif', color: isCompleted ? 'var(--text-3)' : 'var(--text)', lineHeight: 1.3 }}>
              {initiative.name}
            </div>
          </div>
          <button
            className="btn btn-danger"
            style={{ padding: '4px 8px', minHeight: 0, flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); setShowDelete(true) }}
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {initiative.owner && (
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Responsable : <span style={{ color: 'var(--text-2)' }}>{initiative.owner}</span>
            </span>
          )}
          {initiative.dueDate && (
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>
              Échéance : <span style={{ color: 'var(--text-2)' }}>{formatDateShort(initiative.dueDate)}</span>
            </span>
          )}
        </div>

        {initiative.nextAction && (
          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(56,189,248,0.07)', borderLeft: '3px solid var(--sky)', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <TrendingUp size={12} style={{ color: 'var(--sky)', marginTop: 2, flexShrink: 0 }} />
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{initiative.nextAction}</div>
          </div>
        )}

        {initiative.expectedValue && (
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.5, fontStyle: 'italic' }}>
            {initiative.expectedValue}
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={onDelete}
        message={`Supprimer l'initiative "${initiative.name}" ?`}
      />
    </>
  )
}

// ─── Main Initiatives ─────────────────────────────────────────────────────────
export function Initiatives() {
  const { initiatives, addInitiative, updateInitiative, deleteInitiative } = useAppStore()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingInit, setEditingInit] = useState<Initiative | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [filterPriority, setFilterPriority] = useState<string>('')

  useEffect(() => {
    const handler = () => { setEditingInit(null); setModalOpen(true) }
    window.addEventListener('sdos:new', handler)
    return () => window.removeEventListener('sdos:new', handler)
  }, [])

  const filtered = initiatives.filter(i => {
    if (filterStatus && i.status !== filterStatus) return false
    if (filterPriority && i.priority !== filterPriority) return false
    return true
  })

  // Sort: blocked first, then by priority, then not completed
  const sorted = [...filtered].sort((a, b) => {
    if (a.status === 'Bloqué' && b.status !== 'Bloqué') return -1
    if (b.status === 'Bloqué' && a.status !== 'Bloqué') return 1
    const pOrder: Record<string, number> = { 'Élevée': 0, 'Moyenne': 1, 'Faible': 2 }
    if ((pOrder[a.priority] ?? 1) !== (pOrder[b.priority] ?? 1)) return (pOrder[a.priority] ?? 1) - (pOrder[b.priority] ?? 1)
    if (a.status === 'Complété' && b.status !== 'Complété') return 1
    if (b.status === 'Complété' && a.status !== 'Complété') return -1
    return 0
  })

  function saveInit(data: Partial<Initiative>) {
    if (editingInit) updateInitiative(editingInit.id, data)
    else addInitiative(data as Parameters<typeof addInitiative>[0])
    setModalOpen(false)
    setEditingInit(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 className="section-title">Initiatives</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Chantiers stratégiques du directeur des ventes</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingInit(null); setModalOpen(true) }}>
          <Plus size={16} /> Nouvelle initiative
        </button>
      </div>

      {/* Stats bar */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {STATUSES.map(status => {
          const count = initiatives.filter(i => i.status === status).length
          return (
            <button
              key={status}
              onClick={() => setFilterStatus(filterStatus === status ? '' : status)}
              style={{
                background: filterStatus === status ? 'var(--surface-2)' : 'transparent',
                border: `1px solid ${filterStatus === status ? 'var(--border)' : 'transparent'}`,
                borderRadius: 8,
                padding: '5px 10px',
                cursor: 'pointer',
                display: 'flex',
                gap: 6,
                alignItems: 'center',
              }}
            >
              <StatusBadge status={status} />
              <span style={{ fontSize: 12, color: 'var(--text-2)', fontFamily: 'JetBrains Mono' }}>{count}</span>
            </button>
          )
        })}
        {filterStatus && (
          <button className="btn btn-secondary" style={{ padding: '5px 10px' }} onClick={() => setFilterStatus('')}>Effacer</button>
        )}
      </div>

      {/* Grid */}
      {sorted.length === 0 ? (
        <EmptyState
          message="Aucune initiative. Ajoutez votre premier chantier."
          action={<button className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={15} /> Nouvelle initiative</button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 14 }}>
          {sorted.map(init => (
            <InitiativeCard
              key={init.id}
              initiative={init}
              onEdit={() => { setEditingInit(init); setModalOpen(true) }}
              onDelete={() => deleteInitiative(init.id)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal
          open
          onClose={() => { setModalOpen(false); setEditingInit(null) }}
          title={editingInit ? `Modifier — ${editingInit.name}` : 'Nouvelle initiative'}
        >
          <InitiativeForm
            initial={editingInit ?? undefined}
            onSave={saveInit}
            onCancel={() => { setModalOpen(false); setEditingInit(null) }}
          />
        </Modal>
      )}
    </div>
  )
}
