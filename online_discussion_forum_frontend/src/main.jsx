import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { disableReactDevTools } from '@fvilers/disable-react-devtools'

if (process.env.NODE_ENV === 'production') {
  disableReactDevTools();
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AuthProvider>
      <Routes>
        <Route path="/*" element={<App />} />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
)
