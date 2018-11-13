const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.get('/bot/:text*?', (req, res) => {
  const { text } = req.params;

  res.json(text);
});

app.use(express.static(__dirname + '/views'));

var port = process.env.PORT || 3000
app.listen(port, () => console.log(`Running on port ${port}`));
