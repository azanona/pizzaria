const express = require('express');
const bodyParser = require('body-parser');
const AssistantV1 = require('watson-developer-cloud/assistant/v1');

const app = express();
app.use(bodyParser.json());

assistant = new AssistantV1({
  username: 'apikey',
  password: 'DjoyTX4EbcJtweFJKnV-BtdS2uTtGr9FSf4Mgz9yHLYE',
  url: 'https://gateway.watsonplatform.net/assistant/api/',
  version: '2018-02-16',
});

const workspaceId = '314cfb97-428d-4aaa-befe-35f7e6fd272a';

app.post('/bot/debug', (req, res) => {
  const { text, context = {} } = req.body;

  const params = {
    input: { text },
    workspace_id: workspaceId,
    context,
  };
  console.info(req.body);
   console.info(text);
  console.info(context);

  assistant.message(params, (err, response) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      res.json(response);
    }
  });
});

app.get('/bot/', (req, res) => {
  const { mensagem, context = {} } = req.query;

  const paramsWatson = {
    input: { mensagem },
    workspace_id: workspaceId,
    context: context,
  };
console.info(mensagem)
	console.info(context);
  assistant.message(paramsWatson, (err, response) => {
      if (err) res.status(500).json(err);
      let resWatson = {
      	messages: []
      }
      if (response.output) {    
	      let output = response.output;    
	      for (var i = 0; i < output.text.length; i++) {        
		  resWatson.messages.push({ text: output.text[i] });    
	      }
	      //resWatson.set_attributes  = { context: response.context };  
      }
      res.json(resWatson);
    });
});

app.use(express.static(__dirname + '/html'));

var port = process.env.PORT || 3000
app.listen(port, () => console.log(`Running on port ${port}`));

