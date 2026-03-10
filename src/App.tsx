import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import MapPage from './pages/MapPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
