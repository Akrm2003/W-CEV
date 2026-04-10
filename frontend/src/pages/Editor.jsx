import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { Save, Download, ChevronLeft, Layout } from 'lucide-react';
import { componentService } from '../services/componentService';
import { useToast } from '../hooks/useToast';
import Preview from '../components/Preview';
import AIPanel from '../components/AIPanel';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/Editor.css';

export default function CodeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [component, setComponent] = useState({ name: 'Untitled Component', description: '', html: '' });
  const [loading, setLoading] = useState(id && id !== 'new');
  const [saving, setSaving] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(true);

  useEffect(() => {
    if (id && id !== 'new') {
      loadComponent();
    }
  }, [id]);

  const loadComponent = async () => {
    try {
      setLoading(true);
      const res = await componentService.getComponent(id);
      setComponent(res);
    } catch (err) {
      showToast('Failed to load component', 'error');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (id === 'new' || !id) {
        const res = await componentService.createComponent(component);
        showToast('Created successfully', 'success');
        navigate(`/editor/${res.id}`, { replace: true });
      } else {
        await componentService.updateComponent(id, component);
        showToast('Saved successfully', 'success');
      }
    } catch (err) {
      showToast('Failed to save', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = () => {
    const blob = new Blob([component.html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${component.name.replace(/\s+/g, '-').toLowerCase() || 'component'}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="editor-loading"><LoadingSpinner /></div>;

  return (
    <div className="editor-page">
      {/* Top Toolbar */}
      <div className="editor-toolbar glass-panel">
        <div className="toolbar-left">
          <button className="btn-icon" onClick={() => navigate('/dashboard')}>
            <ChevronLeft size={20} />
          </button>
          <input 
            type="text" 
            className="component-name-input"
            value={component.name}
            onChange={e => setComponent({...component, name: e.target.value})}
            placeholder="Component Name"
          />
        </div>
        
        <div className="toolbar-right">
          <button 
            className={`btn-icon ${showAIPanel ? 'active text-accent' : ''}`}
            onClick={() => setShowAIPanel(!showAIPanel)}
            title="Toggle AI Panel"
          >
            <Layout size={18} />
          </button>
          <button className="btn btn-secondary" onClick={handleExport}>
            <Download size={16} /> Export
          </button>
          <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
            <Save size={16} /> {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Main Workspace Workspace */}
      <div className="workspace">
        <div className="workspace-editor">
          <Editor
            height="100%"
            defaultLanguage="html"
            theme="vs-dark"
            value={component.html}
            onChange={(val) => setComponent({...component, html: val || ''})}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16 }
            }}
          />
        </div>
        
        <div className="workspace-preview">
          <Preview code={component.html} />
        </div>

        {showAIPanel && (
          <div className="workspace-ai">
            <AIPanel onApplyCode={(code) => setComponent({...component, html: code})} />
          </div>
        )}
      </div>
    </div>
  );
}
