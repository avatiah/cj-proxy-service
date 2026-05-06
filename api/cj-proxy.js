export default async function handler(req, res) {
  // Устанавливаем CORS заголовки
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, CJ-Access-Token');

  // Обрабатываем preflight запрос
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { productName } = req.query;
  const CJ_EMAIL = process.env.CJ_EMAIL;
  const CJ_API_KEY = process.env.CJ_API_KEY;
  const REF_TAG = '12031fc5-06b0-49fc-bfa5-8d46fb759798';

  // Проверяем наличие переменных окружения
  if (!CJ_EMAIL || !CJ_API_KEY) {
    return res.status(500).json({ 
      result: false,
      error: "Отсутствуют переменные окружения CJ_EMAIL или CJ_API_KEY" 
    });
  }

  try {
    // Получаем токен доступа
    const authRes = await fetch('https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        email: CJ_EMAIL, 
        apiKey: CJ_API_KEY,
        refTag: REF_TAG
      })
    });

    const authData = await authRes.json();
    
    // Проверяем успешность авторизации
    if (!authData.data || !authData.data.accessToken) {
      console.error('Auth error:', authData);
      return res.status(401).json({ 
        result: false,
        error: "Ошибка авторизации в CJ API" 
      });
    }

    const token = authData.data.accessToken;

    // Выполняем поиск товаров
    const searchRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?productName=${encodeURIComponent(productName)}&pageSize=5&pageNum=1`,
      {
        method: 'GET',
        headers: { 
          'CJ-Access-Token': token,
          'Content-Type': 'application/json'
        }
      }
    );

    const searchData = await searchRes.json();
    
    // Возвращаем данные в ожидаемом формате
    res.status(200).json({
      result: true,
      data: {
        list: searchData.data?.list || []
      }
    });
    
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).json({ 
      result: false,
      error: "Ошибка на стороне прокси: " + error.message 
    });
  }
}
