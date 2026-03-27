import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppShell } from './AppShell'
import { Dashboard } from './modules/dashboard/Dashboard'
import { Revues } from './modules/reviews/Revues'
import { OneOnOneModule } from './modules/oneonone/OneOnOneModule'
import { Departements } from './modules/departments/Departements'
import { Initiatives } from './modules/initiatives/Initiatives'
import { MeetingMensuel } from './modules/monthly/MeetingMensuel'
import { Plan90 } from './modules/plan90/Plan90'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route index element={<Dashboard />} />
          <Route path="revues" element={<Revues />} />
          <Route path="oneonone" element={<OneOnOneModule />} />
          <Route path="departements" element={<Departements />} />
          <Route path="initiatives" element={<Initiatives />} />
          <Route path="meeting" element={<MeetingMensuel />} />
          <Route path="plan90" element={<Plan90 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
