import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { prompt } = req.body;
    
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: '请提供有效的问题' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('API key not configured');
      return res.status(500).json({ error: '服务器配置错误，请联系管理员' });
    }

    console.log('Using API key:', apiKey.substring(0, 5) + '...');
    console.log('Prompt:', prompt);

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    console.log('Sending request to Gemini API...');
    const result = await model.generateContent(prompt);
    console.log('Received response from Gemini API');
    
    const response = await result.response;
    const text = response.text();

    if (!text) {
      console.error('Empty response from Gemini API');
      return res.status(500).json({ error: '无法获取回复，请重试' });
    }

    console.log('Response text:', text.substring(0, 100) + '...');
    res.status(200).json({ response: text });
  } catch (error) {
    console.error('Detailed error:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // 处理不同类型的错误
    if (error.message.includes('API key')) {
      return res.status(401).json({ error: 'API 密钥无效' });
    } else if (error.message.includes('quota')) {
      return res.status(429).json({ error: 'API 调用次数超限' });
    } else if (error.message.includes('network')) {
      return res.status(503).json({ error: '网络连接错误，请检查网络后重试' });
    } else {
      return res.status(500).json({ 
        error: '服务器错误，请稍后重试',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
} 