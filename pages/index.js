import { useState } from 'react';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error('Error:', error);
      setResponse('发生错误，请重试');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Gemini API 代理</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', height: '100px', marginBottom: '10px' }}
          placeholder="请输入您的问题..."
        />
        <button type="submit" disabled={loading}>
          {loading ? '发送中...' : '发送'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '20px' }}>
          <h2>回复：</h2>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
} 