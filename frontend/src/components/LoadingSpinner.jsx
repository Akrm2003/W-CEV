export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
      <div className="spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid var(--border-color)',
        borderTopColor: 'var(--accent-primary)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
