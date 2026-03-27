// ─── Reps ────────────────────────────────────────────────────────────────────
export type RepLevel = 'Junior' | 'Rep' | 'Senior' | 'Team Lead'
export type MeetingRhythm = 'One-on-one' | 'Revue' | 'Les deux'

export interface Rep {
  id: string
  name: string
  level: RepLevel
  territory?: string
  rhythm?: MeetingRhythm
  strengths?: string
  challenges?: string
  directorCommitment?: string
  repCommitment?: string
  nextMeeting?: string // YYYY-MM-DD
  createdAt: string
}

// ─── Pipeline Reviews ────────────────────────────────────────────────────────
export interface PipelineReview {
  id: string
  repId: string
  weekOf: string // YYYY-MM-DD
  failingAccounts: number
  lateTasks: number
  activitySummary?: string
  roadblocks?: string
  nextMeetingPrep?: string
  directorActions?: string
  repActions?: string
  createdAt: string
}

// ─── One-on-One ──────────────────────────────────────────────────────────────
export interface OneOnOne {
  id: string
  repId: string
  date: string // YYYY-MM-DD
  focusTopic?: string
  currentChallenges?: string
  ongoingCoaching?: string
  repRequest?: string
  directorCommitment?: string
  repCommitment?: string
  createdAt: string
}

// ─── Departments ─────────────────────────────────────────────────────────────
export type DeptCadence = 'Hebdo' | '2 semaines' | 'Mensuel' | 'Au besoin'

export interface Department {
  id: string
  name: string
  contact?: string
  supportsWhat?: string
  frictions?: string
  nextAction?: string
  cadence?: DeptCadence
  createdAt: string
}

// ─── Initiatives ─────────────────────────────────────────────────────────────
export type Priority = 'Élevée' | 'Moyenne' | 'Faible'
export type InitiativeStatus = 'À démarrer' | 'En cours' | 'Bloqué' | 'Complété'

export interface Initiative {
  id: string
  name: string
  priority: Priority
  status: InitiativeStatus
  owner?: string
  dueDate?: string // YYYY-MM-DD
  expectedValue?: string
  nextAction?: string
  createdAt: string
}

// ─── Plan 90 Days ────────────────────────────────────────────────────────────
export type Horizon = '0-30j' | '31-60j' | '61-90j' | 'Trimestre'
export type StrategicPillar =
  | 'Comprendre'
  | 'Stabiliser'
  | 'Optimiser'
  | 'Développer'
  | 'Institutionnaliser'
export type ItemStatus = 'À démarrer' | 'En cours' | 'Bloqué' | 'Complété'

export interface Plan90Item {
  id: string
  horizon: Horizon
  pillar: StrategicPillar
  action: string
  owner?: string
  status: ItemStatus
  createdAt: string
}

// ─── Monthly Meeting ─────────────────────────────────────────────────────────
export interface MonthlyMeeting {
  id: string
  month: string // "Mars 2026"
  monthReview?: string
  kpi?: string
  announcements?: string
  salesTraining?: string
  ids?: string
  bestPractices?: string
  createdAt: string
}

// ─── App Settings ─────────────────────────────────────────────────────────────
export interface AppSettings {
  weekType: 'A' | 'B' // A = Pipeline, B = One-on-one
  weekTypeSetManually: boolean
  lastWeekTypeUpdate?: string // ISO date
}

// ─── App Store ─────────────────────────────────────────────────────────────────
export interface AppState {
  reps: Rep[]
  reviews: PipelineReview[]
  oneOnOnes: OneOnOne[]
  departments: Department[]
  initiatives: Initiative[]
  plan90Items: Plan90Item[]
  monthlyMeetings: MonthlyMeeting[]
  settings: AppSettings

  // Reps
  addRep: (rep: Omit<Rep, 'id' | 'createdAt'>) => void
  updateRep: (id: string, updates: Partial<Rep>) => void
  deleteRep: (id: string) => void

  // Reviews
  addReview: (review: Omit<PipelineReview, 'id' | 'createdAt'>) => void
  updateReview: (id: string, updates: Partial<PipelineReview>) => void
  deleteReview: (id: string) => void

  // One-on-ones
  addOneOnOne: (item: Omit<OneOnOne, 'id' | 'createdAt'>) => void
  updateOneOnOne: (id: string, updates: Partial<OneOnOne>) => void
  deleteOneOnOne: (id: string) => void

  // Departments
  addDepartment: (dept: Omit<Department, 'id' | 'createdAt'>) => void
  updateDepartment: (id: string, updates: Partial<Department>) => void
  deleteDepartment: (id: string) => void

  // Initiatives
  addInitiative: (item: Omit<Initiative, 'id' | 'createdAt'>) => void
  updateInitiative: (id: string, updates: Partial<Initiative>) => void
  deleteInitiative: (id: string) => void

  // Plan 90
  addPlan90Item: (item: Omit<Plan90Item, 'id' | 'createdAt'>) => void
  updatePlan90Item: (id: string, updates: Partial<Plan90Item>) => void
  deletePlan90Item: (id: string) => void

  // Monthly meetings
  addMonthlyMeeting: (item: Omit<MonthlyMeeting, 'id' | 'createdAt'>) => void
  updateMonthlyMeeting: (id: string, updates: Partial<MonthlyMeeting>) => void
  deleteMonthlyMeeting: (id: string) => void

  // Settings
  updateSettings: (updates: Partial<AppSettings>) => void

  // Import/Export
  exportData: () => string
  importData: (json: string) => void
}
