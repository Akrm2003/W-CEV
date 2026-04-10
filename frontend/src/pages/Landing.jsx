import { Link } from 'react-router-dom';
import { Terminal, Lightbulb, Zap, ArrowRight, Code } from 'lucide-react';
import '../styles/Landing.css';

export default function Landing() {
  return (
    <div className="landing-page">
      {/* Background decoration */}
      <div className="bg-glow glow-1"></div>
      <div className="bg-glow glow-2"></div>
      
      <main className="landing-content">
        <section className="hero">
          <div className="hero-badge">
            <span className="badge-text" style={{marginRight: 6}}>✨</span> W-CEV v1.0 is here
          </div>
          <h1 className="hero-title">
            Build Stunning Web Components <br />
            <span className="text-gradient">With AI Assistance</span>
          </h1>
          <p className="hero-subtitle">
            An open-source, local-first React playground that lets you generate, edit, and visualize production-ready web components instantly.
          </p>
          <div className="hero-cta">
            <Link to="/editor/new" className="btn btn-primary btn-large">
              Start Building <ArrowRight size={18} />
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-large">
              View Gallery
            </Link>
          </div>
        </section>

        <section className="features container">
          <div className="feature-grid">
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Lightbulb size={24} /></div>
              <h3>AI Generation</h3>
              <p>Just describe what you want, and our LLM integration will instantly generate a fully styled, responsive HTML component.</p>
            </div>
            
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Zap size={24} /></div>
              <h3>Live Preview</h3>
              <p>See your changes instantly in a sandboxed iframe. Tweak HTML, CSS, and JS and watch the component update in real-time.</p>
            </div>
            
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Code size={24} /></div>
              <h3>Full Control</h3>
              <p>This isn't just a black box. You get a Monaco editor to fine-tune the generated code. Export the clean HTML when you're done.</p>
            </div>
            
            <div className="feature-card glass-panel">
              <div className="feature-icon"><Terminal size={24} /></div>
              <h3>Open Source SaaS</h3>
              <p>Run it locally with Docker, connect your own OpenAI key, and own your code. Built with React and FastAPI.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
