import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { MetaverseProvider } from './components/MetaverseContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
    <MetaverseProvider>
      <App />
    </MetaverseProvider>
    </HashRouter>
  </React.StrictMode>
)