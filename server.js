const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());
const baseUrl = "http://20.244.56.144/test";
let windowStore = [];
const windowSize = 10;
let accesstoken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ4MDcxMDk1LCJpYXQiOjE3NDgwNzA3OTUsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6ImM5MzdiOGI1LWI3ZGUtNGQ0NS1hYTA2LTJhYjVhODBkY2Y2MSIsInN1YiI6Im1hZGhhbm0wNzA0QGdtYWlsLmNvbSJ9LCJlbWFpbCI6Im1hZGhhbm0wNzA0QGdtYWlsLmNvbSIsIm5hbWUiOiJtYWRoYW4gbSIsInJvbGxObyI6IjkyNzYyMmJjYjAyOCIsImFjY2Vzc0NvZGUiOiJ3aGVRVXkiLCJjbGllbnRJRCI6ImM5MzdiOGI1LWI3ZGUtNGQ0NS1hYTA2LTJhYjVhODBkY2Y2MSIsImNsaWVudFNlY3JldCI6Ik5lbXBzVUt1eEhtZGtkUXQifQ.6t42WtAF0m1P1uRFDBxIYje3Xi_-75mALbu3w18iV8w';

const fetchNumbers = async (type) => {
  try {
    const response = await axios.get(`${baseUrl}/numbers/${type}`, {
      headers: { Authorization: `Bearer ${accesstoken}` },
      timeout: 2000
    });
    return response.data.numbers || [];
  } catch (err) {
    console.error("Fetch failed or timeout:", err.message);
    return [];
  }
};

app.get('/', (req, res) => {
  res.send("Hello World");
});

app.get('/numbers/:type', async (req, res) => {
  const { type } = req.params;
  const validType = ['p', 'f', 'e', 'r'];
  
  if (!validType.includes(type)) {
    return res.status(400).json({ error: "Invalid Type" });
  }

  const windowPrevsizeState = [...windowStore];
  const number = await fetchNumbers(type);

  number.forEach((num) => {
    if (!windowStore.includes(num)) {
      if (windowStore.length >= windowSize) {
        windowStore.shift();
      }
      windowStore.push(num);
    }
  });

  const avg = windowStore.length > 0
    ? (windowStore.reduce((a, b) => a + b, 0) / windowStore.length).toFixed(2)
    : 0.0;

  res.json({
    windowPrevsizeState,
    windowCurrState: [...windowStore],
    numbers: number,
    avg: parseFloat(avg)
  });
});

app.listen(9876, () => {
  console.log("Server is connected on port 9876");
});
