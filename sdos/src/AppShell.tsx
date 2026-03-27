import { useState, useEffect } from 'react'
import { NavLink, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, TrendingUp, Users, Building2,
  Rocket, CalendarDays, Target, Menu, X, ChevronLeft,
  ChevronRight, Search, Download, Upload, Settings
} from 'lucide-react'
import { useBreakpoint } from '@/shared/hooks/useMediaQuery'
import { useAppStore } from '@/store/useAppStore'
import { getWeekNumber, getAutoWeekType } from '@/shared/utils/date'
import { Modal, ConfirmModal } from '@/shared/components/Modal'

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { path: '/revues', label: 'Revues', icon: TrendingUp },
  { path: '/oneonone', label: 'One-on-one', icon: Users },
  { path: '/departements', label: 'Départements', icon: Building2 },
  { path: '/initiatives', label: 'Initiatives', icon: Rocket },
  { path: '/meeting', label: 'Meeting', icon: CalendarDays },
  { path: '/plan90', label: 'Plan 90j', icon: Target },
]

// ─── Sidebar (iPad/PC) ───────────────────────────────────────────────────────
function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const { settings, updateSettings } = useAppStore()
  const weekNum = getWeekNumber()
  const weekType = settings.weekTypeSetManually
    ? settings.weekType
    : getAutoWeekType()

  return (
    <aside
      className="sidebar"
      style={{ width: collapsed ? 60 : 240 }}
    >
      {/* Logo area */}
      <div style={{
        padding: collapsed ? '16px 0' : '16px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: collapsed ? 'center' : 'space-between',
        minHeight: 60,
      }}>
        {!collapsed && (
          <div>
            <div style={{ fontFamily: 'Fraunces, serif', fontWeight: 700, fontSize: 15, color: 'var(--text)', lineHeight: 1.2 }}>
              DNV Command
            </div>
            <div style={{ fontSize: 10, color: 'var(--accent)', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Sales Director OS
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex' }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Week indicator */}
      {!collapsed && (
        <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
              Sem. {weekNum} — <span style={{ color: weekType === 'A' ? 'var(--sky)' : 'var(--fuchsia)' }}>Sem. {weekType}</span>
            </span>
            <button
              onClick={() => updateSettings({
                weekType: weekType === 'A' ? 'B' : 'A',
                weekTypeSetManually: true
              })}
              style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 11, padding: '2px 6px' }}
            >
              ⇄
            </button>
          </div>
        </div>
      )}

      {/* Nav items */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            title={collapsed ? item.label : undefined}
            style={collapsed ? { justifyContent: 'center', padding: '10px 0' } : {}}
          >
            <item.icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span style={{ fontSize: 13, fontWeight: 500 }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user card */}
      {!collapsed && (
        <div style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0
          }}>JB</div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>Julien Blanchard</div>
            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>Directeur National des Ventes</div>
          </div>
        </div>
      )}
    </aside>
  )
}

// ─── Bottom Tab Bar (iPhone) ──────────────────────────────────────────────────
function BottomTabBar() {
  const location = useLocation()
  const visible = NAV_ITEMS.slice(0, 5)
  const more = NAV_ITEMS.slice(5)
  const [showMore, setShowMore] = useState(false)

  return (
    <>
      <div className="tab-bar">
        {visible.map(item => {
          const isActive = item.exact
            ? location.pathname === item.path
            : location.pathname.startsWith(item.path)
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={`tab-bar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={22} />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
        <button
          className={`tab-bar-item ${showMore ? 'active' : ''}`}
          onClick={() => setShowMore(s => !s)}
        >
          <Menu size={22} />
          <span>Plus</span>
        </button>
      </div>

      {/* More menu */}
      {showMore && (
        <div style={{
          position: 'fixed', bottom: 'calc(60px + env(safe-area-inset-bottom))',
          left: 0, right: 0,
          background: 'var(--surface-1)',
          borderTop: '1px solid var(--border)',
          zIndex: 49,
          padding: '8px 0',
        }}>
          {more.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className="sidebar-item"
              onClick={() => setShowMore(false)}
              style={{ margin: '2px 12px' }}
            >
              <item.icon size={18} />
              <span style={{ fontSize: 14 }}>{item.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </>
  )
}

// ─── Topbar ───────────────────────────────────────────────────────────────────
function Topbar({ sidebarCollapsed }: { sidebarCollapsed: boolean }) {
  const location = useLocation()
  const { settings, updateSettings, exportData, importData } = useAppStore()
  const breakpoint = useBreakpoint()
  const [search, setSearch] = useState('')
  const [showSettings, setShowSettings] = useState(false)
  const [showExportConfirm, setShowExportConfirm] = useState(false)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [saved, setSaved] = useState(false)

  const weekNum = getWeekNumber()
  const weekType = settings.weekTypeSetManually ? settings.weekType : getAutoWeekType()

  // Find current module label
  const currentNav = NAV_ITEMS.find(n =>
    n.exact ? location.pathname === n.path : location.pathname.startsWith(n.path)
  )
  const moduleLabel = currentNav?.label ?? 'Dashboard'

  function handleExport() {
    const json = exportData()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sdos-export-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          importData(ev.target?.result as string)
          setSaved(true)
          setTimeout(() => setSaved(false), 2000)
        } catch {
          alert('Fichier JSON invalide')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const leftOffset = breakpoint !== 'mobile'
    ? (sidebarCollapsed ? 60 : 240)
    : 0

  return (
    <>
      <div
        className="topbar"
        style={{ left: leftOffset, position: 'fixed', top: 0, right: 0, zIndex: 30 }}
      >
        {/* Module title */}
        <h1 style={{
          fontFamily: 'Fraunces, serif', fontWeight: 700,
          fontSize: 18, margin: 0, color: 'var(--text)', flex: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }}>
          {moduleLabel}
        </h1>

        {/* Week badge (desktop/tablet) */}
        {breakpoint !== 'mobile' && (
          <div className="week-badge">
            Sem. {weekNum} —{' '}
            <span style={{ color: weekType === 'A' ? 'var(--sky)' : 'var(--fuchsia)' }}>
              Sem. {weekType} ({weekType === 'A' ? 'Pipeline' : 'One-on-one'})
            </span>
            <button
              onClick={() => updateSettings({ weekType: weekType === 'A' ? 'B' : 'A', weekTypeSetManually: true })}
              style={{ background: 'none', border: 'none', color: 'var(--text-3)', cursor: 'pointer', fontSize: 12, padding: '0 0 0 4px' }}
              title="Basculer semaine A/B"
            >⇄</button>
          </div>
        )}

        {/* Search */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, color: 'var(--text-3)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher…"
            style={{
              paddingLeft: 30, paddingRight: search ? 30 : 12,
              width: breakpoint === 'mobile' ? 120 : 200,
              height: 36, borderRadius: 10, fontSize: 13,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{
                position: 'absolute', right: 8,
                background: 'none', border: 'none',
                color: 'var(--text-3)', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center'
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Settings */}
        <button
          onClick={() => setShowSettings(true)}
          style={{ background: 'var(--surface-2)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-2)', cursor: 'pointer', padding: '7px', display: 'flex', alignItems: 'center', minWidth: 36, minHeight: 36 }}
          title="Paramètres"
        >
          <Settings size={16} />
        </button>

        {/* Save indicator */}
        {saved && (
          <span style={{ fontSize: 12, color: 'var(--emerald)', whiteSpace: 'nowrap' }}>Sauvegardé ✓</span>
        )}
      </div>

      {/* Settings Modal */}
      <Modal open={showSettings} onClose={() => setShowSettings(false)} title="Paramètres">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Données</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1, gap: 8 }} onClick={() => { setShowExportConfirm(true) }}>
                <Download size={15} /> Exporter JSON
              </button>
              <button className="btn btn-secondary" style={{ flex: 1, gap: 8 }} onClick={() => setShowImportConfirm(true)}>
                <Upload size={15} /> Importer JSON
              </button>
            </div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-3)', lineHeight: 1.6 }}>
            Sales Director OS v1.0 — Manulift<br />
            Données stockées localement sur cet appareil.
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={showExportConfirm}
        onClose={() => setShowExportConfirm(false)}
        onConfirm={handleExport}
        title="Exporter les données"
        message="Toutes vos données seront exportées dans un fichier JSON. Continuer ?"
        confirmLabel="Exporter"
        danger={false}
      />
      <ConfirmModal
        open={showImportConfirm}
        onClose={() => setShowImportConfirm(false)}
        onConfirm={handleImportClick}
        title="Importer des données"
        message="L'import remplacera toutes vos données actuelles. Cette action est irréversible. Continuer ?"
        confirmLabel="Importer"
        danger
      />
    </>
  )
}

// ─── AppShell ─────────────────────────────────────────────────────────────────
export function AppShell() {
  const breakpoint = useBreakpoint()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'n') {
        e.preventDefault()
        // Trigger new action — modules handle this via a global event
        window.dispatchEvent(new CustomEvent('sdos:new'))
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  const isMobile = breakpoint === 'mobile'
  const sidebarWidth = isMobile ? 0 : sidebarCollapsed ? 60 : 240
  const topbarHeight = 60
  const bottomOffset = isMobile ? 'calc(60px + env(safe-area-inset-bottom))' : 0

  return (
    <div style={{ minHeight: '100dvh', background: 'var(--bg)' }}>
      {/* Sidebar */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
        />
      )}

      {/* Topbar */}
      <Topbar sidebarCollapsed={sidebarCollapsed} />

      {/* Main content */}
      <main
        style={{
          marginLeft: sidebarWidth,
          paddingTop: topbarHeight,
          paddingBottom: bottomOffset,
          minHeight: '100dvh',
          maxWidth: `calc(1400px + ${sidebarWidth}px)`,
        }}
      >
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px 20px' }}>
          <Outlet />
        </div>
      </main>

      {/* Bottom tab bar (mobile) */}
      {isMobile && <BottomTabBar />}
    </div>
  )
}
