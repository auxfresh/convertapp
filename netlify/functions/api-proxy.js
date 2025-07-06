
const { createProxyMiddleware } = require('http-proxy-middleware');

exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body } = event;
  
  // Extract the API path from the function path
  const apiPath = path.replace('/.netlify/functions/api-proxy', '');
  
  try {
    const response = await fetch(`${process.env.API_BASE_URL}${apiPath}`, {
      method: httpMethod,
      headers: {
        ...headers,
        'Content-Type': 'application/json'
      },
      body: httpMethod !== 'GET' ? body : undefined
    });
    
    const data = await response.text();
    
    return {
      statusCode: response.status,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
      },
      body: data
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
