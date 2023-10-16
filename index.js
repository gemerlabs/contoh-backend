const express = require("express");
const app = express();
const data = require("./data.json");
const fs = require("fs");

app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(express.json());

app.get("/catalog", (req, res) => {
  const { minimum, maximum } = req.query;
  const result = [];
  if (minimum && maximum) {
    for (const catalog of data) {
      if (catalog.harga >= minimum && catalog.harga <= maximum) {
        result.push(catalog);
      }
    }
  }

  return res.status(200).json(result);
});

app.get("/catalog/:id", (req, res) => {
  const { id } = req.params;

  let catalog = null;
  for (const cat of data) {
    if (cat.id == id) {
      catalog = cat;
    }
  }

  if (!catalog) {
    return res.status(200).json({
      message: "Data Tidak ditemukan",
    });
  }

  return res.status(200).json({
    data: catalog,
  });
});

app.post("/catalog", (req, res) => {
  const { title, warna, harga } = req.body;

  if (!title || !warna || !harga) {
    return res.status(400).json({
      message: "Data Tidak Lengkap",
    });
  }

  const last = data[data.length - 1];
  const latestId = last.id + 1;
  const fullData = [...data];
  fullData.push({
    id: latestId,
    title,
    warna,
    harga,
  });

  fs.writeFileSync("./data.json", JSON.stringify(fullData));
  return res.status(200).json({
    message: "Berhasil menambahkan data",
  });
});

app.put("/catalog", (req, res) => {
  // const { id } = req.params;
  const { title, warna, harga, id } = req.body;

  if (!title || !warna || !harga) {
    return res.status(400).json({
      message: "Data Tidak Lengkap",
    });
  }

  let catalog = null;
  for (const cat of data) {
    if (cat.id === Number(id)) {
      catalog = cat;
    }
  }

  if (!catalog) {
    return res.status(200).json({
      message: "Data Tidak ditemukan",
    });
  }

  const finalData = [...data].map((element) => {
    if (element.id === Number(id)) {
      return {
        id: element.id,
        title,
        warna,
        harga,
      };
    } else {
      return element;
    }
  });

  fs.writeFileSync("./data.json", JSON.stringify(finalData));

  return res.status(200).json({
    message: "Berhasil merubah data!",
    data: finalData,
  });
});

app.delete("/catalog/:id", (req, res) => {
  const { id } = req.params;

  let catalog = null;
  for (const cat of data) {
    if (cat.id === Number(id)) {
      catalog = cat;
    }
  }

  if (!catalog) {
    return res.status(200).json({
      message: "Data Tidak ditemukan",
    });
  }

  const finalData = [...data].filter((cat) => cat.id !== Number(id));
  fs.writeFileSync("./data.json", JSON.stringify(finalData));

  return res.status(200).json({
    message: "Berhasil Menghapus data",
    data: finalData,
  });
});

app.listen(3001, () => {
  console.log("Server Running on port http://localhost:3001");
});
