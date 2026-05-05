// Прокси для CJ Dropshipping
export default async function handler(req, res) {
  // Настройка CORS для расширения
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { productName } = req.query;
  const CJ_EMAIL = process.env.CJ_EMAIL;
  const CJ_API_KEY = process.env.CJ_API_KEY;

  try {
    // 1. Получение токена (без заглушек, только реальный запрос)
    const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: CJ_EMAIL, apiKey: CJ_API_KEY })
    });
    const authData = await authRes.json();
    const token = authData.data.accessToken;

    // 2. Поиск товара
    const searchRes = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/list?productName=${encodeURIComponent(productName)}&pageSize=5`, {
      method: 'GET',
      headers: { 'CJ-Access-Token': token }
    });
    const searchData = await searchRes.json();

    res.status(200).json(searchData);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
