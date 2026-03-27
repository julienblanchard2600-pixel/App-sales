import { useState, useEffect } from 'react'
import { Plus, Trash2, User, ChevronRight } from 'lucide-react'
import { useAppStore } from '@/store/useAppStore'
import { Modal, ConfirmModal } from '@/shared/components/Modal'
import { Field, FormGrid, FullSpan } from '@/shared/components/Field'
import { EmptyState } from '@/shared/components/EmptyState'
import { LevelBadge } from '@/shared/components/Badge'
import { formatDate, formatDateShort } from '@/shared/utils/date'
import { useBreakpoint } from '@/shared/hooks/useMediaQuery'
import type { Rep, MeetingRhythm, RepLevel } from '@/types'

// ─── Rep Form ─────────────────────────────────────────────────────────────────
function RepForm({ initial, onSave, onCancel }: {
  initial?: Partial<Rep>
  onSave: (data: Partial<Rep>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<Rep>>({
    name: '', level: 'Rep', territory: '', rhythm: 'Revue',
    strengths: '', challenges: '', directorCommitment: '',
    repCommitment: '', nextMeeting: '',
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

  const set = (k: keyof Rep, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      <FormGrid>
        <Field label="Nom complet" required error={errors.name}>
          <input type="text" value={form.name ?? ''} onChange={e => set('name', e.target.value)} placeholder="Prénom Nom" />
        </Field>
        <Field label="Niveau">
          <select value={form.level ?? 'Rep'} onChange={e => set('level', e.target.value as RepLevel)}>
            {(['Junior', 'Rep', 'Senior', 'Team Lead'] as RepLevel[]).map(l => <option key={l}>{l}</option>)}
          </select>
        </Field>
        <Field label="Territoire">
          <input type="text" value={form.territory ?? ''} onChange={e => set('territory', e.target.value)} placeholder="Région, secteur…" />
        </Field>
        <Field label="Rythme de rencontre">
          <select value={form.rhythm ?? 'Revue'} onChange={e => set('rhythm', e.target.value as MeetingRhythm)}>
            {(['One-on-one', 'Revue', 'Les deux'] as MeetingRhythm[]).map(r => <option key={r}>{r}</option>)}
          </select>
        </Field>
        <Field label="Prochaine rencontre">
          <input type="date" value={form.nextMeeting ?? ''} onChange={e => set('nextMeeting', e.target.value)} />
        </Field>
        <div />
        <FullSpan>
          <Field label="Forces">
            <textarea value={form.strengths ?? ''} onChange={e => set('strengths', e.target.value)} placeholder="Points forts du rep…" />
          </Field>
        </FullSpan>
        <FullSpan>
          <Field label="Défis / Axe coaching">
            <textarea value={form.challenges ?? ''} onChange={e => set('challenges', e.target.value)} placeholder="Défis actuels, axes de développement…" />
          </Field>
        </FullSpan>
        <Field label="Engagement directeur">
          <textarea value={form.directorCommitment ?? ''} onChange={e => set('directorCommitment', e.target.value)} style={{ minHeight: 70 }} />
        </Field>
        <Field label="Engagement rep">
          <textarea value={form.repCommitment ?? ''} onChange={e => set('repCommitment', e.target.value)} style={{ minHeight: 70 }} />
        </Field>
      </FormGrid>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
      </div>
    </>
  )
}

// ─── Rep Card ─────────────────────────────────────────────────────────────────
function RepCard({ rep, selected, onClick, onDelete }: {
  rep: Rep, selected: boolean, onClick: () => void, onDelete: () => void
}) {
  const [showDelete, setShowDelete] = useState(false)

  return (
    <>
      <div
        className={`card ${selected ? 'active' : ''}`}
        onClick={onClick}
        style={{
          padding: '14px 16px', cursor: 'pointer',
          borderColor: selected ? 'var(--sky)' : undefined,
          background: selected ? 'rgba(56,189,248,0.05)' : undefined,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: selected ? 'rgba(56,189,248,0.15)' : 'var(--surface-2)',
            border: `1px solid ${selected ? 'var(--sky)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700,
            color: selected ? 'var(--sky)' : 'var(--text-2)', flexShrink: 0
          }}>
            {rep.name.charAt(0)}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {rep.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-3)' }}>{rep.territory || 'Territoire non défini'}</div>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <LevelBadge level={rep.level} />
            <button
              className="btn btn-danger"
              style={{ padding: '3px 7px', minHeight: 0, fontSize: 12 }}
              onClick={e => { e.stopPropagation(); setShowDelete(true) }}
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* Always-visible strengths and challenges */}
        {rep.strengths && (
          <div style={{ marginBottom: 6, padding: '6px 10px', borderRadius: 8, background: 'rgba(52,211,153,0.07)', borderLeft: '2px solid var(--emerald)' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--emerald)', marginBottom: 2 }}>Forces</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>{rep.strengths}</div>
          </div>
        )}
        {rep.challenges && (
          <div style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(251,191,36,0.07)', borderLeft: '2px solid var(--amber)' }}>
            <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber)', marginBottom: 2 }}>Défis / Axe coaching</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.4 }}>{rep.challenges}</div>
          </div>
        )}

        {rep.nextMeeting && (
          <div style={{ marginTop: 8, fontSize: 11, color: 'var(--text-3)' }}>
            Prochaine rencontre : <span style={{ color: 'var(--text-2)' }}>{formatDate(rep.nextMeeting)}</span>
          </div>
        )}

        {selected && (
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--sky)' }}>
            <ChevronRight size={13} /> Détail à droite
          </div>
        )}
      </div>

      <ConfirmModal
        open={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={onDelete}
        message={`Supprimer la fiche de ${rep.name} ? Ses one-on-one ne seront pas supprimés.`}
      />
    </>
  )
}

// ─── One-on-One Form ──────────────────────────────────────────────────────────
type OonData = ReturnType<typeof useAppStore.getState>['oneOnOnes'][0]

function OonForm({ initial, reps, onSave, onCancel }: {
  initial?: Partial<OonData>
  reps: Rep[]
  onSave: (data: Partial<OonData>) => void
  onCancel: () => void
}) {
  const [form, setForm] = useState<Partial<OonData>>({
    repId: reps[0]?.id ?? '',
    date: '',
    focusTopic: '', currentChallenges: '', ongoingCoaching: '',
    repRequest: '', directorCommitment: '', repCommitment: '',
    ...initial,
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const e: Record<string, string> = {}
    if (!form.repId) e.repId = 'Champ obligatoire'
    if (!form.date) e.date = 'Champ obligatoire'
    return e
  }

  function handleSubmit() {
    const e = validate()
    if (Object.keys(e).length > 0) { setErrors(e); return }
    onSave(form)
  }

  const set = (k: keyof OonData, v: string) => setForm(f => ({ ...f, [k]: v }))

  return (
    <>
      <FormGrid>
        <Field label="Représentant" required error={errors.repId}>
          <select value={form.repId ?? ''} onChange={e => set('repId', e.target.value)}>
            <option value="" disabled>Sélectionner…</option>
            {reps.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </Field>
        <Field label="Date" required error={errors.date}>
          <input type="date" value={form.date ?? ''} onChange={e => set('date', e.target.value)} />
        </Field>
        <FullSpan>
          <Field label="Focus de la rencontre">
            <input type="text" value={form.focusTopic ?? ''} onChange={e => set('focusTopic', e.target.value)} placeholder="Thème principal…" />
          </Field>
        </FullSpan>
        <Field label="Défis actuels">
          <textarea value={form.currentChallenges ?? ''} onChange={e => set('currentChallenges', e.target.value)} style={{ minHeight: 70 }} />
        </Field>
        <Field label="Coaching en cours">
          <textarea value={form.ongoingCoaching ?? ''} onChange={e => set('ongoingCoaching', e.target.value)} style={{ minHeight: 70 }} />
        </Field>
        <FullSpan>
          <Field label="Demande du rep">
            <textarea value={form.repRequest ?? ''} onChange={e => set('repRequest', e.target.value)} style={{ minHeight: 60 }} />
          </Field>
        </FullSpan>
        <Field label="Engagement directeur">
          <textarea value={form.directorCommitment ?? ''} onChange={e => set('directorCommitment', e.target.value)} style={{ minHeight: 70 }} />
        </Field>
        <Field label="Engagement rep">
          <textarea value={form.repCommitment ?? ''} onChange={e => set('repCommitment', e.target.value)} style={{ minHeight: 70 }} />
        </Field>
      </FormGrid>
      <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 20 }}>
        <button className="btn btn-secondary" onClick={onCancel}>Annuler</button>
        <button className="btn btn-primary" onClick={handleSubmit}>Enregistrer</button>
      </div>
    </>
  )
}

// ─── Rep Detail (right panel) ─────────────────────────────────────────────────
function RepDetail({ rep, onEdit }: { rep: Rep, onEdit: () => void }) {
  const { oneOnOnes, reps, addOneOnOne, updateOneOnOne, deleteOneOnOne } = useAppStore()
  const repOons = oneOnOnes.filter(o => o.repId === rep.id).slice().sort((a, b) => b.date.localeCompare(a.date))
  const [oonModal, setOonModal] = useState(false)
  const [editingOon, setEditingOon] = useState<OonData | null>(null)
  const [deleteOonId, setDeleteOonId] = useState<string | null>(null)

  function saveOon(data: Partial<OonData>) {
    if (editingOon) {
      updateOneOnOne(editingOon.id, data)
    } else {
      addOneOnOne({ ...data, repId: rep.id } as Parameters<typeof addOneOnOne>[0])
    }
    setOonModal(false)
    setEditingOon(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Rep header */}
      <div className="card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'rgba(56,189,248,0.15)',
              border: '2px solid var(--sky)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, fontWeight: 700, color: 'var(--sky)'
            }}>
              {rep.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', fontFamily: 'Fraunces, serif' }}>{rep.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)' }}>{rep.territory || 'Territoire non défini'}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <LevelBadge level={rep.level} />
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: 12 }} onClick={onEdit}>
              Modifier
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {rep.strengths && (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(52,211,153,0.07)', border: '1px solid rgba(52,211,153,0.15)' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--emerald)', marginBottom: 4 }}>Forces</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{rep.strengths}</div>
            </div>
          )}
          {rep.challenges && (
            <div style={{ padding: '10px 12px', borderRadius: 10, background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.15)' }}>
              <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--amber)', marginBottom: 4 }}>Défis / Axe coaching</div>
              <div style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.5 }}>{rep.challenges}</div>
            </div>
          )}
        </div>

        {(rep.directorCommitment || rep.repCommitment) && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {rep.directorCommitment && (
              <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 4 }}>Engagement directeur</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{rep.directorCommitment}</div>
              </div>
            )}
            {rep.repCommitment && (
              <div style={{ padding: '8px 12px', borderRadius: 10, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 4 }}>Engagement rep</div>
                <div style={{ fontSize: 12, color: 'var(--text-2)' }}>{rep.repCommitment}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* One-on-ones */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 className="section-subtitle" style={{ margin: 0 }}>One-on-one ({repOons.length})</h2>
        <button className="btn btn-primary" style={{ padding: '7px 14px', fontSize: 13 }} onClick={() => { setEditingOon(null); setOonModal(true) }}>
          <Plus size={15} /> Nouveau
        </button>
      </div>

      {repOons.length === 0 ? (
        <EmptyState message="Aucun one-on-one pour ce rep." />
      ) : (
        repOons.map(oon => (
          <div key={oon.id} className="card" style={{ padding: '14px 16px', cursor: 'pointer' }} onClick={() => { setEditingOon(oon); setOonModal(true) }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: oon.focusTopic ? 8 : 0 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>{formatDate(oon.date)}</div>
                {oon.focusTopic && <div style={{ fontSize: 12, color: 'var(--sky)', marginTop: 2 }}>{oon.focusTopic}</div>}
              </div>
              <button
                className="btn btn-danger"
                style={{ padding: '4px 8px', minHeight: 0 }}
                onClick={e => { e.stopPropagation(); setDeleteOonId(oon.id) }}
              >
                <Trash2 size={13} />
              </button>
            </div>
            {oon.directorCommitment && (
              <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 6, paddingTop: 6, borderTop: '1px solid var(--border)' }}>
                <span style={{ color: 'var(--text-2)', fontWeight: 500 }}>Directeur : </span>{oon.directorCommitment}
              </div>
            )}
          </div>
        ))
      )}

      {/* Modals */}
      {oonModal && (
        <Modal open={true} onClose={() => { setOonModal(false); setEditingOon(null) }}
          title={editingOon ? `One-on-one — ${formatDate(editingOon.date)}` : `Nouveau one-on-one — ${rep.name}`}
        >
          <OonForm
            initial={editingOon ?? { repId: rep.id }}
            reps={[rep]}
            onSave={saveOon}
            onCancel={() => { setOonModal(false); setEditingOon(null) }}
          />
        </Modal>
      )}

      <ConfirmModal
        open={!!deleteOonId}
        onClose={() => setDeleteOonId(null)}
        onConfirm={() => { if (deleteOonId) deleteOneOnOne(deleteOonId) }}
        message="Supprimer ce one-on-one ?"
      />
    </div>
  )
}

// ─── Main Module ──────────────────────────────────────────────────────────────
export function OneOnOneModule() {
  const { reps, addRep, updateRep, deleteRep } = useAppStore()
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  const [selectedRepId, setSelectedRepId] = useState<string | null>(reps[0]?.id ?? null)
  const [tab, setTab] = useState<'reps' | 'oon'>('reps')
  const [repModal, setRepModal] = useState(false)
  const [editingRep, setEditingRep] = useState<Rep | null>(null)
  const [newRepModal, setNewRepModal] = useState(false)

  useEffect(() => {
    const handler = () => setNewRepModal(true)
    window.addEventListener('sdos:new', handler)
    return () => window.removeEventListener('sdos:new', handler)
  }, [])

  const selectedRep = reps.find(r => r.id === selectedRepId) ?? null

  function saveRep(data: Partial<Rep>) {
    if (editingRep) updateRep(editingRep.id, data)
    else addRep(data as Parameters<typeof addRep>[0])
    setRepModal(false)
    setNewRepModal(false)
    setEditingRep(null)
  }

  // Mobile: tab layout
  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 className="section-title">One-on-one</h1>
          <button className="btn btn-primary" onClick={() => setNewRepModal(true)}><Plus size={15} /> Ajouter rep</button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
          {(['reps', 'oon'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              flex: 1, padding: '10px', background: tab === t ? 'var(--surface-2)' : 'transparent',
              border: 'none', color: tab === t ? 'var(--text)' : 'var(--text-3)',
              cursor: 'pointer', fontWeight: tab === t ? 600 : 400, fontSize: 13
            }}>
              {t === 'reps' ? 'Reps' : 'One-on-one'}
            </button>
          ))}
        </div>

        {tab === 'reps' ? (
          reps.length === 0 ? (
            <EmptyState message="Aucun rep. Commencez par ajouter un rep." />
          ) : (
            reps.map(rep => (
              <RepCard
                key={rep.id}
                rep={rep}
                selected={selectedRepId === rep.id}
                onClick={() => { setSelectedRepId(rep.id); setTab('oon') }}
                onDelete={() => deleteRep(rep.id)}
              />
            ))
          )
        ) : (
          selectedRep
            ? <RepDetail rep={selectedRep} onEdit={() => { setEditingRep(selectedRep); setRepModal(true) }} />
            : <EmptyState message="Sélectionnez un rep dans l'onglet Reps." />
        )}

        {(repModal || newRepModal) && (
          <Modal open onClose={() => { setRepModal(false); setNewRepModal(false); setEditingRep(null) }}
            title={editingRep ? `Modifier — ${editingRep.name}` : 'Nouveau rep'}
          >
            <RepForm initial={editingRep ?? undefined} onSave={saveRep} onCancel={() => { setRepModal(false); setNewRepModal(false); setEditingRep(null) }} />
          </Modal>
        )}
      </div>
    )
  }

  // Desktop/tablet: sidebar + detail layout
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 className="section-title">One-on-one — Coaching</h1>
        <button className="btn btn-primary" onClick={() => setNewRepModal(true)}><Plus size={15} /> Ajouter un rep</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>
        {/* Rep list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: 4 }}>
            Reps ({reps.length})
          </div>
          {reps.length === 0 ? (
            <EmptyState message="Aucun one-on-one planifié. Commencez par ajouter un rep." />
          ) : (
            reps.map(rep => (
              <RepCard
                key={rep.id}
                rep={rep}
                selected={selectedRepId === rep.id}
                onClick={() => setSelectedRepId(rep.id)}
                onDelete={() => { deleteRep(rep.id); if (selectedRepId === rep.id) setSelectedRepId(reps[0]?.id ?? null) }}
              />
            ))
          )}
        </div>

        {/* Detail */}
        <div>
          {selectedRep ? (
            <RepDetail
              rep={selectedRep}
              onEdit={() => { setEditingRep(selectedRep); setRepModal(true) }}
            />
          ) : (
            <EmptyState icon={<User size={40} />} message="Sélectionnez un rep pour voir ses one-on-one." />
          )}
        </div>
      </div>

      {(repModal || newRepModal) && (
        <Modal open onClose={() => { setRepModal(false); setNewRepModal(false); setEditingRep(null) }}
          title={editingRep ? `Modifier — ${editingRep.name}` : 'Nouveau rep'}
        >
          <RepForm initial={editingRep ?? undefined} onSave={saveRep} onCancel={() => { setRepModal(false); setNewRepModal(false); setEditingRep(null) }} />
        </Modal>
      )}
    </div>
  )
}
