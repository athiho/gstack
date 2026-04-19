import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Initiatives } from './pages/Initiatives';
import { Roadmap } from './pages/Roadmap';

export default function App() {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/initiatives" element={<Initiatives />} />
            <Route path="/roadmap" element={<Roadmap />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
}
