import { FileCode, Trash2, Edit3, ExternalLink } from 'lucide-react';
import '../styles/ComponentCard.css';

export default function ComponentCard({ component, onClick, onDelete, onEdit }) {
  // A simple way to generate a preview thumbnail would be an iframe or a static screenshot
  // For the MVP, we'll just show the generated HTML inside a scaled, pointer-events-none iframe
  
  const srcDoc = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { margin: 0; padding: 10px; display: flex; align-items: center; justify-content: center; min-height: 100vh; transform: scale(0.6); transform-origin: top left; width: 166%; height: 166%; }
        </style>
      </head>
      <body>
        ${component.html || ''}
      </body>
    </html>
  `;

  return (
    <div className="component-card glass-panel" onClick={() => onClick(component)}>
      <div className="card-preview">
        <div className="preview-overlay" />
        {component.html ? (
          <iframe
            title={component.name}
            srcDoc={srcDoc}
            className="card-iframe"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : (
          <div className="empty-preview">
            <FileCode size={40} className="empty-icon" />
            <span>No Preview Available</span>
          </div>
        )}
      </div>
      
      <div className="card-content">
        <h3 className="card-title">{component.name}</h3>
        <p className="card-desc">
          {component.description || 'No description provided.'}
        </p>
        <div className="card-footer">
          <span className="card-date">
            {new Date(component.updated_at).toLocaleDateString()}
          </span>
          <div className="card-actions">
            <button 
              className="action-btn"
              onClick={(e) => { e.stopPropagation(); onEdit(component); }}
              title="Open in Editor"
            >
              <Edit3 size={16} />
            </button>
            <button 
              className="action-btn text-error"
              onClick={(e) => { e.stopPropagation(); onDelete(component.id); }}
              title="Delete Component"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
