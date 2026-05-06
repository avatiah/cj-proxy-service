export default async function handler(req, res) {
  // Настройка заголовков CORS для взаимодействия с расширением
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешает запросы из любого источника
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, CJ-Access-Token');

  // Обработка предварительного запроса (preflight)[cite: 1]
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { productName } = req.query;

  // Использование переменных окружения для безопасности
  const CJ_EMAIL = process.env.CJ_EMAIL;
  const CJ_API_KEY = process.env.CJ_API_KEY;

  if (!productName) {
    return res.status(400).json({ error: 'Параметр productName обязателен' });
  }

  try {
    // 1. Получение реального Access Token от CJ API[cite: 1]
    const authResponse = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: CJ_EMAIL,
        apiKey: CJ_API_KEY
      })
    });

    const authData = await authResponse.json();

    if (!authData.result || !authData.data || !authData.data.accessToken) {
      console.error('Ошибка авторизации CJ:', authData);
      return res.status(401).json({ error: 'Не удалось авторизоваться в CJ API' });
    }

    const token = authData.data.accessToken;

    // 2. Выполнение реального поиска товаров по API без заглушек[cite: 1]
    const searchResponse = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/list?productName=${encodeURIComponent(productName)}&pageSize=10`, {
      method: 'GET',
      headers: {
        'CJ-Access-Token': token
      }
    });

    const searchData = await searchResponse.json();

    // Возвращаем реальные данные расширению[cite: 1]
    return res.status(200).json(searchData);

  } catch (error) {
    console.error('Proxy Error:', error);
    return res.status(500).json({ error: 'Внутренняя ошибка сервера прокси' });
  }
}
