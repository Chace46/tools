const express = require('express');
const app = express();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

app.set('view engine', 'ejs');

app.get('/download', (req, res) => {
  const zipPath = path.join(__dirname, 'file.zip');
  const zipFileStream = fs.createReadStream(zipPath);

  // Set the headers for the response
  res.setHeader('Content-disposition', 'attachment; filename=file.zip');
  res.setHeader('Content-Type', 'application/zip');

  // Create a HTML template to display download progress
  const template = `
    <html>
      <head>
        <title>Downloading...</title>
      </head>
      <body>
        <p>Downloading...</p>
        <progress id="progressBar" value="0" max="100"></progress>
        <script>
          const progressBar = document.getElementById('progressBar');
          const totalBytes = ${fs.statSync(zipPath).size};

          zipFileStream.on('data', (chunk) => {
            progressBar.value += chunk.length;
          });

          zipFileStream.on('end', () => {
            progressBar.value = totalBytes;
          });
        </script>
      </body>
    </html>
  `;

  // Render the HTML template and send it to the client
  res.write(ejs.render(template));

  // Pipe the zip file stream to the response
  zipFileStream.pipe(res);
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
