import { useState, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { Smartphone, Monitor, Tablet, RefreshCw, XCircle } from 'lucide-react';
import '../styles/Preview.css';

export default function Preview({ code }) {
  const [viewport, setViewport] = useState('desktop');
  const iframeRef = useRef(null);

  const updateIframe = () => {
    if (!iframeRef.current) return;
    
    // We add a default background to the iframe body so it doesn't stay transparent
    const srcDoc = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              margin: 0; 
              padding: 0; 
              min-height: 100vh; 
              background-color: #ffffff; /* Preview is usually light mode unless overridden by code */
            }
          </style>
        </head>
        <body>
          ${code || '<div style="padding: 20px; color: #888; font-family: sans-serif; text-align: center;">Empty Document</div>'}
        </body>
      </html>
    `;
    
    iframeRef.current.srcdoc = srcDoc;
  };

  // Debounce iframe updates
  useEffect(() => {
    const timer = setTimeout(updateIframe, 300);
    return () => clearTimeout(timer);
  }, [code]);

  return (
    <div className="preview-panel">
      <div className="preview-toolbar glass-panel">
        <div className="viewport-controls">
          <button 
            className={`btn-icon ${viewport === 'mobile' ? 'active' : ''}`}
            onClick={() => setViewport('mobile')}
            title="Mobile (375px)"
          >
            <Smartphone size={18} />
          </button>
          <button 
            className={`btn-icon ${viewport === 'tablet' ? 'active' : ''}`}
            onClick={() => setViewport('tablet')}
            title="Tablet (768px)"
          >
            <Tablet size={18} />
          </button>
          <button 
            className={`btn-icon ${viewport === 'desktop' ? 'active' : ''}`}
            onClick={() => setViewport('desktop')}
            title="Desktop (Responsive)"
          >
            <Monitor size={18} />
          </button>
        </div>
        
        <div className="preview-actions">
          <button className="btn-icon" onClick={updateIframe} title="Force Refresh">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>
      
      <div className="preview-container">
        <div className={`preview-frame viewport-${viewport}`}>
          <iframe
            ref={iframeRef}
            title="Component Preview"
            className="preview-iframe"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        </div>
      </div>
    </div>
  );
}
