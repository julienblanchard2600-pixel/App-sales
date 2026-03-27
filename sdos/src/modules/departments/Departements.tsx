import { useState, useEffect } from 'react'
import { Plus, Trash2, CheckCircle2, AlertOctagon, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Modal, ConfirmModal } from '@/shared/components/Modal'
import { Field, FormGrid, FullSpan } from '@/shared/components/Field'
import { EmptyState } from '@/shared/components/EmptyState'
import { Badge } from '@/shared/components/Badge'
import { useBreakpoint } from '@/shared/hooks/useMediaQuery'
import type { Department, DeptCadence } from '@/types'

const CADENCES: DeptCadence[] = ['Hebdo', '2 semaines', 'Mensuel', 'Au besoin']

const cadenceColors: Record<string, string> = {
  'Hebdo': '#38bdf8',
  '2 semaines': '#e879f9',
  'Mensuel': '#34d399',
  'Au besoin': '#94a3b8',
}

// ─── Department Form ──────────────────────────────────────────────────────────
function DeptForm({ initial, onSave, onCancel }: {
  initial?: Partial<Department>
  onSave: (data: Partial<Department>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<Department>>({
    name: '', contact: '', supportsWhat: '', frictions: '',
    nextAction: '', cadence: 'Mensuel', ...initial
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

  const set = (k: keyof Department, v: string) => setForm((f: Partial<Department>) => ({ ...f, [k]: v }))

  return (
    <>
      <FormGrid>
        <Field label="Nom du département" required error={errors.name}>
          <input type="text" value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="Ex: Service après-vente" />
        </Field>
        <Field label="Responsable / Contact clé">
          <input type="text" value={form.contact ?? ''} onChange={e => set('contact', e.target.value)} placeholder="Nom du contact" />
        </Field>
        <Field label="Cadence">
          <select value={form.cadence ?? 'Mensuel'} onChange={e => set('cadence', e.target.value as DeptCadence)}>
            {CADENCES.map(c => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <div />
        <FullSpan>
          <Field label="Ce qui supporte les ventes">
            <textarea value={form.supportsWhat ?? ''} onChange={e => set('supportsWhat', e.target.value)} placeholder="Comment ce département soutient-il les ventes ?" />
          </Field>
        </FullSpan>
        <FullSpan>
          <Field label="Friction / Irritants">
            <textarea value={form.frictions ?? ''} onChange={e => set('frictions', e.target.value)} placeholder="Points de friction, irritants, problèmes récurrents…" />
          </Field>
        </FullSpan>
        <FullSpan>
          <Field label="Prochaine action">
            <textarea value={form.nextAction ?? ''} onChange={e => set('nextAction', e.target.value)} placeholder="Action concrète à poser…" style={{ minHeight: 70 }} />
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

// ─── Department Card ──────────────────────────────────────────────────────────
function DeptCard({ dept, onEdit, onDelete }: {
  dept: Department, onEdit: () => void, onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <div className="card" style={{ padding: '16px 18px', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12 }} onClick={onEdit}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Fraunces, serif', color: 'var(--text)', marginBottom: 4 }}>
              {dept.name}
            </div>
            {dept.contact && (
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{dept.contact}</div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            {dept.cadence && (
              <Badge color={cadenceColors[dept.cadence] ?? '#94a3b8'}>{dept.cadence}</Badge>
            )}
            <button
              className="btn btn-danger"
              style={{ padding: '4px 7px', minHeight: 0 }}
              onClick={e => { e.stopPropagation(); setShowDelete(true) }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* 3 sections */}
        {dept.supportsWhat && (
          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(52,211,153,0.07)', borderLeft: '3px solid var(--emerald)' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--emerald)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <CheckCircle2 size={10} /> Supporte les ventes
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{dept.supportsWhat}</div>
          </div>
        )}

        {dept.frictions && (
          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(248,113,113,0.07)', borderLeft: '3px solid var(--red)' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--red)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <AlertOctagon size={10} /> Friction / Irritants
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{dept.frictions}</div>
          </div>
        )}

        {dept.nextAction && (
          <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(56,189,248,0.07)', borderLeft: '3px solid var(--sky)' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--sky)', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ChevronRight size={10} /> Prochaine action
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.5 }}>{dept.nextAction}</div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={onDelete}
        message={`Supprimer le département "${dept.name}" ?`}
      />
    </>
  )
}

// ─── Main Departements ────────────────────────────────────────────────────────
export function Departements() {
  const { departments, addDepartment, updateDepartment, deleteDepartment } = useAppStore()
  const breakpoint = useBreakpoint()
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDept, setEditingDept] = useState<Department | null>(null)

  useEffect(() => {
    const handler = () => { setEditingDept(null); setModalOpen(true) }
    window.addEventListener('sdos:new', handler)
    return () => window.removeEventListener('sdos:new', handler)
  }, [])

  const cols = breakpoint === 'mobile' ? 1 : breakpoint === 'tablet' ? 2 : 3

  function openNew() { setEditingDept(null); setModalOpen(true) }
  function openEdit(dept: Department) { setEditingDept(dept); setModalOpen(true) }

  function saveDept(data: Partial<Department>) {
    if (editingDept) updateDepartment(editingDept.id, data)
    else addDepartment(data as Parameters<typeof addDepartment>[0])
    setModalOpen(false)
    setEditingDept(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ flex: 1 }}>
          <h1 className="section-title">Hub Départements</h1>
          <p style={{ color: 'var(--text-3)', fontSize: 13, margin: '4px 0 0' }}>Registre de relation managériale avec les 6 départements internes</p>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Ajouter département
        </button>
      </div>

      {departments.length === 0 ? (
        <EmptyState
          message="Aucun département. Les 6 départements sont préconfigurés."
          action={<button className="btn btn-primary" onClick={openNew}><Plus size={15} /> Ajouter</button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 16 }}>
          {departments.map(dept => (
            <DeptCard
              key={dept.id}
              dept={dept}
              onEdit={() => openEdit(dept)}
              onDelete={() => deleteDepartment(dept.id)}
            />
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal
          open
          onClose={() => { setModalOpen(false); setEditingDept(null) }}
          title={editingDept ? `Modifier — ${editingDept.name}` : 'Nouveau département'}
        >
          <DeptForm
            initial={editingDept ?? undefined}
            onSave={saveDept}
            onCancel={() => { setModalOpen(false); setEditingDept(null) }}
          />
        </Modal>
      )}
    </div>
  )
}
