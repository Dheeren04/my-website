const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/api/certificates', (req, res) => {
  const certDir = path.join(__dirname, 'assets', 'certificates');

  fs.readdir(certDir, (err, files) => {
    if (err) {
      console.error(err);
      return res.json([]);
    }
    const imageFiles = files.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
    res.json(imageFiles);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});