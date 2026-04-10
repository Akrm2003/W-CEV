import { useState } from 'react';
import { Send, Sparkles, Loader2 } from 'lucide-react';
import { componentService } from '../services/componentService';
import { useToast } from '../hooks/useToast';
import '../styles/AIPanel.css';

export default function AIPanel({ onApplyCode }) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    try {
      setLoading(true);
      const res = await componentService.generateComponent(prompt);
      if (res && res.html) {
        onApplyCode(res.html);
        showToast('Component generated successfully!', 'success');
      }
    } catch (err) {
      showToast(err.message || 'Failed to generate component', 'error');
    } finally {
      setLoading(false);
      setPrompt('');
    }
  };

  return (
    <div className="ai-panel">
      <div className="ai-header">
        <Sparkles size={18} className="text-accent" />
        <h3>AI Assistant</h3>
      </div>
      
      <div className="ai-body">
        <div className="ai-welcome">
          <p>Describe the component you need. Be specific about layout, colors, and behavior.</p>
          <div className="prompt-suggestions">
            <span onClick={() => setPrompt('A responsive pricing table with 3 tiers. Dark mode with purple accents.')}>
              "Pricing table with 3 tiers"
            </span>
            <span onClick={() => setPrompt('A modern login form with glassmorphism effect.')}>
              "Glassmorphism login form"
            </span>
          </div>
        </div>
      </div>

      <form className="ai-input-area" onSubmit={handleGenerate}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A minimalist hero section with a gradient button..."
          rows={3}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleGenerate(e);
            }
          }}
        />
        <button 
          type="submit" 
          className="btn btn-primary generate-btn" 
          disabled={!prompt.trim() || loading}
        >
          {loading ? <Loader2 size={18} className="spin" /> : <Send size={18} />}
          <span>{loading ? 'Generating...' : 'Generate'}</span>
        </button>
      </form>
    </div>
  );
}
