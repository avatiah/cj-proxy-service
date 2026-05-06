export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { productName } = req.query;

  try {
    // Получение токена (обязательно настройте переменные окружения в Vercel!)
    const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        email: process.env.CJ_EMAIL, 
        apiKey: process.env.CJ_API_KEY 
      })
    });
    const authData = await authRes.json();
    const token = authData.data.accessToken;

    // Поиск товара
    const searchRes = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/list?productName=${encodeURIComponent(productName)}&pageSize=10`, {
      method: 'GET',
      headers: { 'CJ-Access-Token': token }
    });
    const searchData = await searchRes.json();

    res.status(200).json({
      result: true,
      data: { list: searchData.data?.list || [] }
    });
  } catch (error) {
    res.status(500).json({ result: false, error: error.message });
  }
}
