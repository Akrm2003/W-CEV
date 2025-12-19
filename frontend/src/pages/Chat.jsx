import { useState, useRef } from 'react';
import '../styles/Chat.css';

function Chat() {
  const [code, setCode] = useState('');
  const iframeRef = useRef(null);

  const handleSubmit = () => {
    console.log('Code length:', code.length);
    
    const iframe = iframeRef.current;
    if (iframe) {
      console.log('Iframe found');
      
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
        iframe.src = 'about:blank';
        setTimeout(() => {
          const freshDoc = iframe.contentDocument || iframe.contentWindow.document;
          freshDoc.open();
          console.log('Document opened');
          
          freshDoc.write(code);
          console.log('Code written to iframe');
          
          freshDoc.close();
          console.log('Document closed');
          console.log('=== SUBMIT END ===');
        }, 50);
        
      } catch (error) {
        console.error('Error writing to iframe:', error);
      }
    } else {
      console.error('Iframe ref is null');
    }
    
    setCode('');
  };

  return (
    <div className='Chat-container'>
      <div className='preview-section'>
        <h2>Preview:</h2>
        <iframe 
          ref={iframeRef}
          className='preview-iframe'
          title="Code Preview"
        />
      </div>
      <div className='input-section'>
        <textarea
			placeholder="Enter code here"
			value={code}
			onChange={(e) => setCode(e.target.value)}
			rows={15}
			cols={50}
		/>

        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
}

export default Chat;


