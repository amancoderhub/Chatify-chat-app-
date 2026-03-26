import { Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import Auth from './pages/Auth/Auth'
import Chat from './pages/Chat/Chat'
import { GuestRoute, PrivateRoute } from './pages/PageGuards'

const App: React.FC = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/" element={<Auth />} />
          <Route path="/auth" element={<Auth />} />
        </Route>
        <Route element={<PrivateRoute />}>
          <Route path="/chat" element={<Chat />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
