import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './hooks/useToast';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Editor from './pages/Editor';
import NotFound from './pages/NotFound';
import './App.css';

function AppLayout({ children }) {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <AppLayout>
              <Landing />
            </AppLayout>
          } />
          <Route path="/dashboard" element={
            <AppLayout>
              <Dashboard />
            </AppLayout>
          } />
          
          {/* Editor routes use the layout but the editor handles its own height */}
          <Route path="/editor/:id" element={
            <AppLayout>
              <Editor />
            </AppLayout>
          } />
          <Route path="/editor/new" element={<Navigate to="/editor/" replace />} />
          <Route path="/editor/" element={
            <AppLayout>
              <Editor />
            </AppLayout>
          } />

          <Route path="*" element={
            <AppLayout>
              <NotFound />
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
