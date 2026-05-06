// ... внутри блока try после выполнения поиска
const searchData = await searchRes.json();

// Если CJ вернул ошибку в самом JSON (например, неверный токен)
if (searchData.result === false) {
  return res.status(200).json({
    result: false,
    error: searchData.message || "CJ API ошибка"
  });
}

// Возвращаем строго ту структуру, которую ждет popup.js
res.status(200).json({
  result: true,
  data: {
    list: searchData.data?.list || []
  }
});
