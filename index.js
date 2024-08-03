const express = require("express");
const cors = require("cors");
const axios = require("axios");

require("dotenv").config();
const app = express();
const port = process.env.API_PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: 1,
    message: "API stworka",
  });
});
// Получение коинов
app.get("/api/v1/coin", (req, res) => {
  let id = req.query.id;
  console.log (id)
  if (!id) {
    return res.json({
      success: 1,
      data: "Параметр id не может быть пустым",
    });
  }

  axios
    .get(process.env.API_BASE_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
      },
      params: {
        // id: "825,3408,2,5426,1,1027,1839,6636,74,6636,1,4679,4679",
        id: id.toString(),
        convert: "INR",
      },
    })
    .then((response) => {
      const data = response.data;
      const coinsData = [];

      console.log(data);

      for (key in data.data) {
        let price = Number(data.data[key].quote.INR.price.toFixed(1));
        // цена коина в рупии + 30%
        let receive = Number((data.data[key].quote.INR.price * 1.3).toFixed(1));

        coinsData.push({
          id: data.data[key].id,
          symbol: data.data[key].symbol,
          name: data.data[key].name,
          price,
          receive,
        });
      }

      res.json({
        success: 1,
        data: coinsData,
      });
    })
    .catch((err) => {
      console.error("Ошибка при получении данных:", err);
    });
});

app.listen(port, () => {
  console.log(port);
});
