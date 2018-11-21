const express = require('express');
const bodyParser = require('body-parser');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const workspace_id = process.env.WATSON_WORKSPACE_ID;
const assistant = new AssistantV1({
  username: process.env.WATSON_USERNAME,
  password: process.env.WATSON_PASSWORD,
  url: 'https://gateway.watsonplatform.net/assistant/api/',
  version: '2018-02-16',
});

/* Utilitarios */
const watsonRequest = (text = {}, context = {}) => {
  const paramsWatson = {
    input: { text },
    context,
    workspace_id,
  };

  return new Promise((resolve, reject) => {
    assistant.message(paramsWatson, (err, response) => {
      if (err) reject(err);
      resolve(chatfuelResponse(response));
    });
  });
}

const chatfuelResponse = (response) => {
  const { output } = response;
  const resWatson = {
    messages: [],    
    set_attributes: {
      context: {},
    }
  }
    
  if (output) {
    for (var i = 0; i < output.text.length; i++) {        
      resWatson.messages.push({ text: output.text[i] });    
    }
    resWatson.set_attributes.context = response.context;
  }

  return resWatson;
};

/** Métodos **/

app.post('/bot', (req, res) => {
  const {
    body: {      
      text,
      context,
    },
   } = req;

  console.info('chatfuel text: ' + text);
  console.info('chatfuel context: ' + context);
  console.info('chatfuel body: ' + req.body);

  watsonRequest(text, context)
    .then((result) => {
      res.json(result);
    })
    .catch(console.error);
});

app.use(express.static(__dirname + '/html'));

var port = process.env.PORT || 3000;
app.listen(port,  () => console.log(`Running on port ${port}`));
