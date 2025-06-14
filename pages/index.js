import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('请输入问题');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResponse(data.response);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('发生错误，请重试');
    }
    setLoading(false);
  };

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px'
      }}>Gemini API 代理</h1>
      
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
      }}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            width: '100%',
            height: '120px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #ddd',
            fontSize: '16px',
            resize: 'vertical',
            fontFamily: 'inherit'
          }}
          placeholder="请输入您的问题..."
          disabled={loading}
        />
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#0070f3',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.2s'
          }}
        >
          {loading ? '发送中...' : '发送'}
        </button>
      </form>

      {error && (
        <div style={{
          marginTop: '20px',
          padding: '12px',
          backgroundColor: '#ffebee',
          color: '#c62828',
          borderRadius: '8px',
          border: '1px solid #ffcdd2'
        }}>
          {error}
        </div>
      )}

      {response && (
        <div style={{
          marginTop: '30px',
          padding: '20px',
          backgroundColor: '#f5f5f5',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}>
          <h2 style={{
            color: '#333',
            marginBottom: '15px',
            fontSize: '20px'
          }}>回复：</h2>
          <p style={{
            color: '#333',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
          }}>{response}</p>
        </div>
      )}
    </div>
  );
} 