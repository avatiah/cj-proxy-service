export default async function handler(req, res) {
  // Разрешаем расширению обращаться к прокси
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, CJ-Access-Token');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Весь остальной код получения токена и поиска...
}
