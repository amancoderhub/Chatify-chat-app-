import { Route, Routes } from 'react-router'
import { Toaster } from 'sonner'
import Auth from './pages/Auth/Auth'
import Chat from './pages/Chat/Chat'

const App: React.FC = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
