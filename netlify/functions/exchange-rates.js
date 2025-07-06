
exports.handler = async (event, context) => {
  const { httpMethod, path } = event;
  
  if (httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }
  
  try {
    // Extract base currency from path
    const baseCurrency = path.split('/').pop() || 'USD';
    
    // In a real implementation, you'd fetch from an external API
    // For now, return mock data
    const mockRates = {
      USD: { EUR: 0.85, GBP: 0.73, JPY: 110.0 },
      EUR: { USD: 1.18, GBP: 0.86, JPY: 129.5 },
      GBP: { USD: 1.37, EUR: 1.16, JPY: 150.8 }
    };
    
    const rates = mockRates[baseCurrency] || mockRates.USD;
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET'
      },
      body: JSON.stringify(rates)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal Server Error' })
    };
  }
};
