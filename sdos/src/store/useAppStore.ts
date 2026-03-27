import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  AppState, AppSettings, Rep, PipelineReview, OneOnOne, Department,
  Initiative, Plan90Item, MonthlyMeeting
} from '@/types'

// ─── ID generator ────────────────────────────────────────────────────────────
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
const now = () => new Date().toISOString()

// ─── Default Data ─────────────────────────────────────────────────────────────
const defaultReps: Rep[] = [
  {
    id: 'rep-1', name: 'Antoine Richard', level: 'Junior',
    territory: 'Rive-Nord / Gatineau', rhythm: 'Revue',
    strengths: "Volonté d'évoluer, bonne base vente",
    challenges: 'Besoin de stabilité, veut progresser vers senior',
    directorCommitment: 'Définir un plan de progression clair',
    repCommitment: 'Améliorer rigueur de suivi',
    nextMeeting: '2026-03-30', createdAt: now()
  },
  {
    id: 'rep-2', name: 'Hugo', level: 'Rep',
    territory: 'À confirmer', rhythm: 'One-on-one',
    strengths: 'Bon bagage terrain, aime le CRM',
    challenges: 'Veut coaching régulier sans microgestion',
    directorCommitment: 'Instaurer un vrai rythme de coaching',
    repCommitment: 'Mieux préparer ses prochaines rencontres clients',
    nextMeeting: '2026-04-01', createdAt: now()
  },
  {
    id: 'rep-3', name: 'Jean-François Boutin', level: 'Rep',
    territory: 'À préciser', rhythm: 'Revue',
    strengths: 'Maturité, expérience de gestion',
    challenges: 'Clarification territoire / comptes, refresh CRM',
    directorCommitment: 'Clarifier attentes et objectifs SMART',
    repCommitment: 'Mieux exploiter le CRM',
    nextMeeting: '2026-03-31', createdAt: now()
  },
]

const defaultReviews: PipelineReview[] = [
  {
    id: 'rev-1', repId: 'rep-2', weekOf: '2026-03-23',
    failingAccounts: 7, lateTasks: 12,
    activitySummary: '6 rencontres, 14 appels, 3 soumissions',
    roadblocks: 'Délais location et approbations prix',
    nextMeetingPrep: 'Pomerleau — préparation marge / objection délai',
    directorActions: 'Valider options de contournement avec location',
    repActions: 'Préparer objectif clair de rencontre + next step demandé',
    createdAt: now()
  },
  {
    id: 'rev-2', repId: 'rep-1', weekOf: '2026-03-23',
    failingAccounts: 11, lateTasks: 18,
    activitySummary: '4 rencontres, 10 appels, 2 soumissions',
    roadblocks: 'Manque de latitude junior / leads transférés',
    nextMeetingPrep: 'Sous-traitant maçon — ouverture chantier actif',
    directorActions: 'Revoir règles de protection des leads juniors',
    repActions: 'Prioriser 10 comptes avec vraie probabilité de mouvement',
    createdAt: now()
  },
]

const defaultDepartments: Department[] = [
  {
    id: 'dept-1', name: 'Location / Préparation machine', contact: '',
    supportsWhat: 'Livraison rapide et soutien aux ventes terrain',
    frictions: 'Perception de lenteur versus la compétition',
    nextAction: 'Cartographier délais réels et points de rupture',
    cadence: 'Mensuel', createdAt: now()
  },
  {
    id: 'dept-2', name: 'Contrats', contact: '',
    supportsWhat: 'Sécurise les ententes et accélère les dossiers',
    frictions: 'Risque de goulot si priorités mal alignées',
    nextAction: 'Clarifier SLA interne ventes / contrats',
    cadence: 'Mensuel', createdAt: now()
  },
  {
    id: 'dept-3', name: 'Analyse des ventes', contact: '',
    supportsWhat: 'Lecture KPI, pipeline et territoire',
    frictions: 'Besoin de vues plus managériales',
    nextAction: 'Définir tableau de bord directeur des ventes',
    cadence: 'Mensuel', createdAt: now()
  },
  {
    id: 'dept-4', name: 'Service après-vente', contact: '',
    supportsWhat: 'Rétention client et upsell après livraison',
    frictions: "Remontée d'information vers les ventes trop lente",
    nextAction: 'Établir protocole de transfert info service → ventes',
    cadence: 'Mensuel', createdAt: now()
  },
  {
    id: 'dept-5', name: 'Ressources humaines', contact: '',
    supportsWhat: 'Recrutement, onboarding, rémunération variable',
    frictions: 'Délais de recrutement vs urgence terrain',
    nextAction: 'Aligner critères de sélection sur profil rep Manulift',
    cadence: 'Au besoin', createdAt: now()
  },
  {
    id: 'dept-6', name: 'Direction', contact: '',
    supportsWhat: 'Arbitrages stratégiques, budgets, approbations',
    frictions: 'Alignement sur les priorités commerciales trimestrielles',
    nextAction: 'Présenter plan 90 jours et demander validation budget',
    cadence: 'Mensuel', createdAt: now()
  },
]

const defaultInitiatives: Initiative[] = [
  {
    id: 'init-1', name: 'Clarification territoires / comptes / chantiers',
    priority: 'Élevée', status: 'En cours', owner: 'Julien',
    dueDate: '2026-04-15',
    expectedValue: 'Réduire conflits internes et bruit CRM',
    nextAction: 'Définir logique bureau chef / chantier / sous-traitant',
    createdAt: now()
  },
  {
    id: 'init-2', name: 'Embauche Ottawa',
    priority: 'Élevée', status: 'À démarrer', owner: 'Julien',
    dueDate: '2026-05-01',
    expectedValue: 'Couverture terrain et croissance secteur Ottawa',
    nextAction: 'Définir profil cible et séquence de recrutement',
    createdAt: now()
  },
  {
    id: 'init-3', name: 'Rythme standard de coaching',
    priority: 'Moyenne', status: 'En cours', owner: 'Julien',
    dueDate: '2026-04-10',
    expectedValue: 'Installer discipline managériale constante',
    nextAction: 'Fixer alternance revue opportunités / one-on-one',
    createdAt: now()
  },
]

const defaultPlan90Items: Plan90Item[] = [
  {
    id: 'p90-1', horizon: '0-30j', pillar: 'Comprendre',
    action: 'Cartographier équipe, territoires, CRM, départements',
    owner: 'Julien', status: 'En cours', createdAt: now()
  },
  {
    id: 'p90-2', horizon: '0-30j', pillar: 'Stabiliser',
    action: 'Installer cadence revue opportunités / one-on-one',
    owner: 'Julien', status: 'En cours', createdAt: now()
  },
  {
    id: 'p90-3', horizon: '31-60j', pillar: 'Optimiser',
    action: 'Clarifier logique comptes, chantiers et commissions',
    owner: 'Julien', status: 'À démarrer', createdAt: now()
  },
  {
    id: 'p90-4', horizon: '61-90j', pillar: 'Développer',
    action: 'Lancer embauche Ottawa',
    owner: 'Julien', status: 'À démarrer', createdAt: now()
  },
]

const defaultMonthlyMeetings: MonthlyMeeting[] = [
  {
    id: 'mm-1', month: 'Mars 2026',
    monthReview: "Mois d'observation, calibration de l'équipe, identification des irritants CRM, territoires et interfaces internes.",
    kpi: 'À intégrer depuis Salesforce / analyse des ventes.',
    announcements: 'Promotions, annonces entreprise, mouvements internes.',
    salesTraining: "Bloc L'Architecte : préparation de rencontre + next step demandé.",
    ids: 'Territoires, protection des ventes, lourdeur CRM, délais location.',
    bestPractices: 'Partager les préparations clients les plus solides.',
    createdAt: now()
  },
]

// ─── Store ────────────────────────────────────────────────────────────────────
export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      reps: defaultReps,
      reviews: defaultReviews,
      oneOnOnes: [],
      departments: defaultDepartments,
      initiatives: defaultInitiatives,
      plan90Items: defaultPlan90Items,
      monthlyMeetings: defaultMonthlyMeetings,
      settings: { weekType: 'A', weekTypeSetManually: false },

      // ── Reps ──
      addRep: (data: Omit<Rep, 'id' | 'createdAt'>) => set((s: AppState) => ({
        reps: [...s.reps, { ...data, id: uid(), createdAt: now() }]
      })),
      updateRep: (id: string, updates: Partial<Rep>) => set((s: AppState) => ({
        reps: s.reps.map((r: Rep) => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteRep: (id: string) => set((s: AppState) => ({ reps: s.reps.filter((r: Rep) => r.id !== id) })),

      // ── Reviews ──
      addReview: (data: Omit<PipelineReview, 'id' | 'createdAt'>) => set((s: AppState) => ({
        reviews: [{ ...data, id: uid(), createdAt: now() }, ...s.reviews]
      })),
      updateReview: (id: string, updates: Partial<PipelineReview>) => set((s: AppState) => ({
        reviews: s.reviews.map((r: PipelineReview) => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteReview: (id: string) => set((s: AppState) => ({ reviews: s.reviews.filter((r: PipelineReview) => r.id !== id) })),

      // ── One-on-ones ──
      addOneOnOne: (data: Omit<OneOnOne, 'id' | 'createdAt'>) => set((s: AppState) => ({
        oneOnOnes: [{ ...data, id: uid(), createdAt: now() }, ...s.oneOnOnes]
      })),
      updateOneOnOne: (id: string, updates: Partial<OneOnOne>) => set((s: AppState) => ({
        oneOnOnes: s.oneOnOnes.map((r: OneOnOne) => r.id === id ? { ...r, ...updates } : r)
      })),
      deleteOneOnOne: (id: string) => set((s: AppState) => ({ oneOnOnes: s.oneOnOnes.filter((r: OneOnOne) => r.id !== id) })),

      // ── Departments ──
      addDepartment: (data: Omit<Department, 'id' | 'createdAt'>) => set((s: AppState) => ({
        departments: [...s.departments, { ...data, id: uid(), createdAt: now() }]
      })),
      updateDepartment: (id: string, updates: Partial<Department>) => set((s: AppState) => ({
        departments: s.departments.map((d: Department) => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDepartment: (id: string) => set((s: AppState) => ({
        departments: s.departments.filter((d: Department) => d.id !== id)
      })),

      // ── Initiatives ──
      addInitiative: (data: Omit<Initiative, 'id' | 'createdAt'>) => set((s: AppState) => ({
        initiatives: [...s.initiatives, { ...data, id: uid(), createdAt: now() }]
      })),
      updateInitiative: (id: string, updates: Partial<Initiative>) => set((s: AppState) => ({
        initiatives: s.initiatives.map((i: Initiative) => i.id === id ? { ...i, ...updates } : i)
      })),
      deleteInitiative: (id: string) => set((s: AppState) => ({
        initiatives: s.initiatives.filter((i: Initiative) => i.id !== id)
      })),

      // ── Plan 90 ──
      addPlan90Item: (data: Omit<Plan90Item, 'id' | 'createdAt'>) => set((s: AppState) => ({
        plan90Items: [...s.plan90Items, { ...data, id: uid(), createdAt: now() }]
      })),
      updatePlan90Item: (id: string, updates: Partial<Plan90Item>) => set((s: AppState) => ({
        plan90Items: s.plan90Items.map((i: Plan90Item) => i.id === id ? { ...i, ...updates } : i)
      })),
      deletePlan90Item: (id: string) => set((s: AppState) => ({
        plan90Items: s.plan90Items.filter((i: Plan90Item) => i.id !== id)
      })),

      // ── Monthly meetings ──
      addMonthlyMeeting: (data: Omit<MonthlyMeeting, 'id' | 'createdAt'>) => set((s: AppState) => ({
        monthlyMeetings: [{ ...data, id: uid(), createdAt: now() }, ...s.monthlyMeetings]
      })),
      updateMonthlyMeeting: (id: string, updates: Partial<MonthlyMeeting>) => set((s: AppState) => ({
        monthlyMeetings: s.monthlyMeetings.map((m: MonthlyMeeting) => m.id === id ? { ...m, ...updates } : m)
      })),
      deleteMonthlyMeeting: (id: string) => set((s: AppState) => ({
        monthlyMeetings: s.monthlyMeetings.filter((m: MonthlyMeeting) => m.id !== id)
      })),

      // ── Settings ──
      updateSettings: (updates: Partial<AppSettings>) => set((s: AppState) => ({
        settings: { ...s.settings, ...updates }
      })),

      // ── Export / Import ──
      exportData: () => {
        const { reps, reviews, oneOnOnes, departments, initiatives, plan90Items, monthlyMeetings, settings } = get()
        return JSON.stringify({ reps, reviews, oneOnOnes, departments, initiatives, plan90Items, monthlyMeetings, settings }, null, 2)
      },
      importData: (json: string) => {
        try {
          const data = JSON.parse(json)
          set({
            reps: data.reps ?? [],
            reviews: data.reviews ?? [],
            oneOnOnes: data.oneOnOnes ?? [],
            departments: data.departments ?? [],
            initiatives: data.initiatives ?? [],
            plan90Items: data.plan90Items ?? [],
            monthlyMeetings: data.monthlyMeetings ?? [],
            settings: data.settings ?? { weekType: 'A', weekTypeSetManually: false },
          })
        } catch {
          throw new Error('Fichier JSON invalide')
        }
      },
    }),
    {
      name: 'sdos_v1',
    }
  )
)
