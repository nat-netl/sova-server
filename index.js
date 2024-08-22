const express = require("express");
const fs = require("fs");
const cors = require("cors");
const axios = require("axios");
const http = require("http");
const https = require("https");
// const privateKey  = fs.readFileSync('ssl-new/sovaexchange.com.key', 'utf8');
// const certificate = fs.readFileSync('ssl-new/sovaexchange.com.crt', 'utf8');

require("dotenv").config();
// const credentials = {key: privateKey, cert: certificate};
const app = express();
const httpServer = http.createServer(app);
// var httpsServer = https.createServer(credentials, app);
const port = process.env.API_PORT || 8000;

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: 1,
    message: "API StarlengExchange",
  });
});
// Получение коинов
app.get("/api/v1/coin", (req, res) => {
  let id = req.query.id.toString();
  let valute = req.query.valute.toString()
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
        id: id,
        convert: valute,
      },
    })
    .then((response) => {
      const data = response.data;
      const coinsData = [];


      for (key in data.data) {
        let price
        let receive
        for (keyValute in data.data[key].quote) {
          price = Number(data.data[key].quote[keyValute].price).toFixed(2);
          // цена коина в рупии + 30%
          receive = Number((data.data[key].quote[keyValute].price * 1.3).toFixed(2));
        }

        coinsData.push({
          id: data.data[key].id,
          symbol: data.data[key].symbol,
          name: data.data[key].name,
          price,
          receive,
        });
      }
      console.log(coinsData);

      res.json({
        success: 1,
        data: coinsData,
      });
    })
    .catch((err) => {
      console.error("Ошибка при получении данных:", err);
    });
});

app.get("/api/v1/coins", (req, res) => {
  axios
    .get(process.env.API_BASE_URL, {
      headers: {
        "X-CMC_PRO_API_KEY": process.env.API_KEY,
      },
      params: {
        id: "3408,52,2,5426,1,1027,1839,3272,825,6636,74,2010,1958",
        convert: "INR",
      },
    })
    .then((response) => {
      const data = response.data;
      const coinsData = [];

      for (key in data.data) {
        let price = Number(data.data[key].quote.INR.price).toFixed(1);
        // цена коина в рупии + 30%
        let receive = Number((data.data[key].quote.INR.price * 1.3)).toFixed(1);

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

httpServer.listen(port, () => {
  console.log(port);
});
