import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, HelpCircle } from 'lucide-react';
import { componentService } from '../services/componentService';
import { useToast } from '../hooks/useToast';
import ComponentCard from '../components/ComponentCard';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();

  const fetchComponents = async () => {
    try {
      setLoading(true);
      const res = await componentService.getComponents(search);
      setComponents(res.components);
    } catch (err) {
      showToast('Failed to load components', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delay = setTimeout(fetchComponents, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this component?')) return;
    
    try {
      await componentService.deleteComponent(id);
      showToast('Component deleted', 'success');
      setComponents(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      showToast('Failed to delete component', 'error');
    }
  };

  const handleEdit = (comp) => {
    navigate(`/editor/${comp.id}`);
  };

  return (
    <div className="dashboard container">
      <header className="dashboard-header">
        <div>
          <h2>Your Components</h2>
          <p className="text-secondary">Manage and create UI components</p>
        </div>
        
        <div className="dashboard-actions">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search components..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/editor/new')}>
            <Plus size={18} /> New Component
          </button>
        </div>
      </header>

      {loading ? (
        <LoadingSpinner />
      ) : components.length === 0 ? (
        <div className="empty-state glass-panel">
          <HelpCircle size={48} className="empty-icon text-muted" />
          <h3>No components found</h3>
          <p className="text-secondary">
            {search ? 'Try adjusting your search terms.' : "You haven't created any components yet."}
          </p>
          {!search && (
            <button className="btn btn-primary" onClick={() => navigate('/editor/new')} style={{marginTop: '1rem'}}>
              Create your first component
            </button>
          )}
        </div>
      ) : (
        <div className="components-grid">
          {components.map(comp => (
            <ComponentCard 
              key={comp.id} 
              component={comp} 
              onClick={handleEdit}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
