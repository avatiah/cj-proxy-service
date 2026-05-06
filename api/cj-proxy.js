// ... (начало кода с авторизацией остается прежним)

    const searchData = await searchRes.json();
    
    // ПРОВЕРКА: Если CJ вернул ошибку внутри JSON
    if (searchData.result === false) {
      return res.status(200).json({
        result: false,
        error: searchData.message || "CJ API вернул ошибку"
      });
    }

    // Возвращаем данные, убедившись, что list существует
    res.status(200).json({
      result: true,
      data: {
        list: searchData.data?.list || []
      }
    });
