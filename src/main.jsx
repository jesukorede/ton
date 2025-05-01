import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { HashRouter } from 'react-router-dom'
import { MetaverseProvider } from './components/MetaverseContext'

const router = {
  future: {
    v7_startTransition: true,
    v7_normalizeFormMethod: true,
    v7_fetcherPersist: true
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter {...router}>
      <MetaverseProvider>
        <App />
      </MetaverseProvider>
    </HashRouter>
  </React.StrictMode>
)