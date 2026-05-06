export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const { productName, action } = req.query;

  // Ping / health check
  if (action === 'ping') {
    return res.status(200).json({ ok: true, message: 'CJ Proxy is alive 🚀' });
  }

  const CJ_API_KEY = process.env.CJ_API_KEY;

  try {
    // Шаг 1: авторизация — только apiKey
    const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: CJ_API_KEY })
    });
    const authData = await authRes.json();

    if (!authData.result || !authData.data?.accessToken) {
      return res.status(401).json({ error: 'CJ auth failed', detail: authData.message });
    }

    const token = authData.data.accessToken;

    // Шаг 2: поиск — правильный эндпоинт /product/query
    const params = new URLSearchParams({
      productNameEn: productName || '',
      pageNum: 1,
      pageSize: 5
    });

    const searchRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/query?${params}`,
      { headers: { 'CJ-Access-Token': token } }
    );
    const searchData = await searchRes.json();

    return res.status(200).json(searchData);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
