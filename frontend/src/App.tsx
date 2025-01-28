import {AuthContextProvider} from '@/auth'
import Routes from './routes/Routes'
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
      <AuthContextProvider>
          <Routes/>
          <Toaster />
      </AuthContextProvider>
  )
}

export default App
