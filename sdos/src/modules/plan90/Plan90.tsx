import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Modal, ConfirmModal } from '@/shared/components/Modal'
import { Field, FormGrid, FullSpan } from '@/shared/components/Field'
import { EmptyState } from '@/shared/components/EmptyState'
import { PillarBadge, StatusBadge } from '@/shared/components/Badge'
import { useBreakpoint } from '@/shared/hooks/useMediaQuery'
import type { Plan90Item, Horizon, StrategicPillar, ItemStatus } from '@/types'

const HORIZONS: Horizon[] = ['0-30j', '31-60j', '61-90j', 'Trimestre']
const PILLARS: StrategicPillar[] = ['Comprendre', 'Stabiliser', 'Optimiser', 'Développer', 'Institutionnaliser']
const STATUSES: ItemStatus[] = ['À démarrer', 'En cours', 'Bloqué', 'Complété']

const HORIZON_LABELS: Record<Horizon, string> = {
  '0-30j': '0 – 30 jours',
  '31-60j': '31 – 60 jours',
  '61-90j': '61 – 90 jours',
  'Trimestre': 'Trimestre',
}

// ─── Item Form ────────────────────────────────────────────────────────────────
function Plan90Form({ initial, onSave, onCancel }: {
  initial?: Partial<Plan90Item>
  onSave: (data: Partial<Plan90Item>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<Plan90Item>>({
    horizon: '0-30j', pillar: 'Comprendre', action: '',
    owner: 'Julien', status: 'À démarrer', ...initial
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.action?.trim()) e.action = 'Champ obligatoire'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave(form)
  }

  const set = (k: keyof Plan90Item, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      <FormGrid>
        <Field label="Horizon" required>
          <select value={form.horizon ?? '0-30j'} onChange={e => set('horizon', e.target.value as Horizon)}>
            {HORIZONS.map(h => <option key={h} value={h}>{HORIZON_LABELS[h]}</option>)}
          </select>
        </Field>
        <Field label="Pilier stratégique" required>
          <select value={form.pillar ?? 'Comprendre'} onChange={e => set('pillar', e.target.value as StrategicPillar)}>
            {PILLARS.map(p => <option key={p}>{p}</option>)}
          </select>
        </Field>
        <FullSpan>
          <Field label="Action / Item" required error={errors.action}>
            <textarea
              value={form.action ?? ''}
              onChange={e => set('action', e.target.value)}
              placeholder="Décrivez l'action ou l'objectif…"
              style={{ minHeight: 90 }}
            />
          </Field>
        </FullSpan>
        <Field label="Responsable">
          <input type="text" value={form.owner ?? 'Julien'} onChange={e => set('owner', e.target.value)} />
        </Field>
        <Field label="Statut" required>
          <select value={form.status ?? 'À démarrer'} onChange={e => set('status', e.target.value as ItemStatus)}>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </FormGrid>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
      </div>
    </>
  )
}

// ─── Kanban Item Card ─────────────────────────────────────────────────────────
function KanbanCard({ item, onEdit, onDelete, onStatusChange }: {
  item: Plan90Item
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: ItemStatus) => void
}) {
  const [showDelete, setShowDelete] = useState(false)
  const isBlocked = item.status === 'Bloqué'
  const isCompleted = item.status === 'Complété'

  return (
    <>
      <div
        className="card"
        style={{
          padding: '12px 14px',
          cursor: 'pointer',
          opacity: isCompleted ? 0.6 : 1,
          background: isBlocked ? 'rgba(251,146,60,0.07)' : undefined,
          borderColor: isBlocked ? 'rgba(251,146,60,0.3)' : undefined,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
        onClick={onEdit}
      >
        {/* Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          <PillarBadge pillar={item.pillar} />
        </div>

        {/* Action text */}
        <div style={{
          fontSize: 13, color: isCompleted ? 'var(--text-3)' : 'var(--text)',
          lineHeight: 1.4, fontWeight: 500,
          textDecoration: isCompleted ? 'line-through' : 'none',
        }}>
          {item.action}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'space-between' }}>
          <select
            value={item.status}
            onChange={e => { e.stopPropagation(); onStatusChange(e.target.value as ItemStatus) }}
            onClick={e => e.stopPropagation()}
            style={{ width: 'auto', fontSize: 11, padding: '3px 6px', borderRadius: 6, flex: 1 }}
          >
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
          <button
            className="btn btn-danger"
            style={{ padding: '3px 7px', minHeight: 0, flexShrink: 0 }}
            onClick={e => { e.stopPropagation(); setShowDelete(true) }}
          >
            <Trash2 size={12} />
          </button>
        </div>

        {item.owner && (
          <div style={{ fontSize: 11, color: 'var(--text-3)' }}>
            {item.owner}
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={onDelete}
        message="Supprimer cet item du plan ?"
      />
    </>
  )
}

// ─── Kanban Column ────────────────────────────────────────────────────────────
function KanbanColumn({ horizon, items, onAddNew, onEdit, onDelete, onStatusChange }: {
  horizon: Horizon
  items: Plan90Item[]
  onAddNew: () => void
  onEdit: (item: Plan90Item) => void
  onDelete: (id: string) => void
  onStatusChange: (id: string, status: ItemStatus) => void
}) {
  const done = items.filter(i => i.status === 'Complété').length
  const total = items.length

  return (
    <div style={{
      background: 'var(--surface-1)',
      border: '1px solid var(--border)',
      borderRadius: 16,
      padding: '14px',
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      minHeight: 200,
    }}>
      {/* Column header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--text)' }}>
            {HORIZON_LABELS[horizon]}
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2 }}>
            {done}/{total} complétés
          </div>
        </div>
        <button
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', cursor: 'pointer', padding: '5px', display: 'flex', alignItems: 'center' }}
          onClick={onAddNew}
          title="Ajouter un item"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${(done / total) * 100}%` }} />
        </div>
      )}

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-3)', fontSize: 12 }}>
            Aucun item
          </div>
        ) : (
          items.map(item => (
            <KanbanCard
              key={item.id}
              item={item}
              onEdit={() => onEdit(item)}
              onDelete={() => onDelete(item.id)}
              onStatusChange={s => onStatusChange(item.id, s)}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ─── Main Plan90 ──────────────────────────────────────────────────────────────
export function Plan90() {
  const { plan90Items, addPlan90Item, updatePlan90Item, deletePlan90Item } = useAppStore()
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<Plan90Item | null>(null)
  const [defaultHorizon, setDefaultHorizon] = useState<Horizon>('0-30j')
  const [mobileHorizon, setMobileHorizon] = useState<Horizon>('0-30j')

  useEffect(() => {
    const handler = () => { setEditingItem(null); setModalOpen(true) }
    window.addEventListener('sdos:new', handler)
    return () => window.removeEventListener('sdos:new', handler)
  }, [])

  const totalItems = plan90Items.length
  const doneItems = plan90Items.filter(i => i.status === 'Complété').length
  const pct = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0

  function saveItem(data: Partial<Plan90Item>) {
    if (editingItem) updatePlan90Item(editingItem.id, data)
    else addPlan90Item(data as Parameters<typeof addPlan90Item>[0])
    setModalOpen(false)
    setEditingItem(null)
  }

  function openNew(horizon: Horizon) {
    setDefaultHorizon(horizon)
    setEditingItem(null)
    setModalOpen(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 className="section-title">Plan 90 jours</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Pilotage stratégique personnel du directeur des ventes</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditingItem(null); setModalOpen(true) }}>
          <Plus size={16} /> Nouvel item
        </button>
      </div>

      {/* Global progress */}
      <div className="card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>Progression globale du plan</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', fontFamily: 'JetBrains Mono' }}>
            {doneItems}/{totalItems} ({pct}%)
          </span>
        </div>
        <div className="progress-bar" style={{ height: 8 }}>
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>

        {/* Pillar legend */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          {PILLARS.map(p => {
            const count = plan90Items.filter(i => i.pillar === p).length
            return count > 0 ? (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--text-3)' }}>
                <PillarBadge pillar={p} />
                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 11 }}>{count}</span>
              </div>
            ) : null
          })}
        </div>
      </div>

      {plan90Items.length === 0 ? (
        <EmptyState
          message="Plan vide. Commencez par définir votre premier objectif."
          action={<button className="btn btn-primary" onClick={() => setModalOpen(true)}><Plus size={15} /> Nouvel item</button>}
        />
      ) : isMobile ? (
        /* Mobile: select + list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <select
              value={mobileHorizon}
              onChange={e => setMobileHorizon(e.target.value as Horizon)}
              style={{ flex: 1 }}
            >
              {HORIZONS.map(h => (
                <option key={h} value={h}>{HORIZON_LABELS[h]} ({plan90Items.filter(i => i.horizon === h).length})</option>
              ))}
            </select>
            <button className="btn btn-primary" style={{ padding: '9px 12px' }} onClick={() => openNew(mobileHorizon)}>
              <Plus size={15} />
            </button>
          </div>

          {plan90Items.filter(i => i.horizon === mobileHorizon).map(item => (
            <KanbanCard
              key={item.id}
              item={item}
              onEdit={() => { setEditingItem(item); setModalOpen(true) }}
              onDelete={() => deletePlan90Item(item.id)}
              onStatusChange={s => updatePlan90Item(item.id, { status: s })}
            />
          ))}
        </div>
      ) : (
        /* Desktop/tablet: 4-column kanban */
        <div className="kanban-board" style={{ gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))' }}>
          {HORIZONS.map(horizon => (
            <KanbanColumn
              key={horizon}
              horizon={horizon}
              items={plan90Items.filter(i => i.horizon === horizon)}
              onAddNew={() => openNew(horizon)}
              onEdit={item => { setEditingItem(item); setModalOpen(true) }}
              onDelete={id => deletePlan90Item(id)}
              onStatusChange={(id, s) => updatePlan90Item(id, { status: s })}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal
          open
          onClose={() => { setModalOpen(false); setEditingItem(null) }}
          title={editingItem ? 'Modifier l\'item' : 'Nouvel item'}
        >
          <Plan90Form
            initial={editingItem ?? { horizon: defaultHorizon }}
            onSave={saveItem}
            onCancel={() => { setModalOpen(false); setEditingItem(null) }}
          />
        </Modal>
      )}
    </div>
  )
}
