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
const watsonRequest = (text, context) => {
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
  const resWatson = {
    messages: [],
  }
  
  const { output } = response;
  if (output) {
    for (var i = 0; i < output.text.length; i++) {        
      resWatson.messages.push({ text: output.text[i] });    
    }
    resWatson.set_attributes.context = response.context;
  }

  return resWatson;
};

/** Métodos **/

var ctx = {};
app.post('/bot/debug/', (req, res) => {
  const {
    body: {
      text,
      sessions,
    },
   } = req;

  watsonRequest(text, context)
    .then((result) => {
      res.json(result);
    })
    .catch(console.error);
});

app.post('/bot/cf', (req, res) => {
  const { text } = req.body;
  
  const paramsWatson = {
    input: { text },
    context,
    workspace_id,
  };
  
	assistant.message(paramsWatson, (err, response) => {
      if (err) res.status(500).json(err);
      let resWatson = {
      	messages: [],
      }
      if (response.output) {    
        let { output } = response;
	      for (var i = 0; i < output.text.length; i++) {        
		      resWatson.messages.push({ text: output.text[i] });    
        }
        resWatson.set_attributes.context = response.context;
      }
      console.info(resWatson);
      res.json(resWatson);
    });
});

/**  Funcionando **/
app.post('/bot', (req, res) => {
  const { text, context = {} } = req.body;
  
  const paramsWatson = {
    input: { text },
    context,
    workspace_id,
  };
  console.info(paramsWatson);

	assistant.message(paramsWatson, (err, response) => {
      if (err) res.status(500).json(err);
      let resWatson = {
      	messages: [],
      }
      if (response.output) {    
        let { output } = response;
	      for (var i = 0; i < output.text.length; i++) {        
		      resWatson.messages.push({ text: output.text[i] });    
        }
        resWatson.context = response.context;
      }
      console.info(resWatson);
      res.json(resWatson);
    });
});

app.use(express.static(__dirname + '/html'));

var port = process.env.PORT || 3000
app.listen(port, () => console.log(`Running on port ${port}`));
