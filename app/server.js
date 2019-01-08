const express = require('express');
const request = require('request-promise-native');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path'); //TODO

const port = process.env.PORT || 8080;
const filePath = process.env.FILEPATH || '/tmp/myfile';

(function init() {
console.log(`envoy config is at: ${filePath}`);
if (!fs.existsSync(path.dirname(filePath))) {
  console.error(`invalid file path ${filePath}`);
  return;
}

fs.promises.copyFile('./envoy-config.yaml', filePath)
.then(() => console.log('updated envoy config'))
.catch(() => console.log('error updating envoy config'));
})();

function handleApplyConfig(req, res) {
  let body = req.body;
  fs.writeFileSync(filePath, body, { encoding: 'utf8', flag: 'w' });
  request.post('http://localhost:9901/quitquitquit').then((resQuit)=> {
    if (resQuit === 'OK\n') { //this is the expected body response from envoy for successfully restarting
      console.log('restarted envoy');
      res.end();
    }
    else {
      throw new Error('Envoy didnt restart');
    }
  }).catch((e) => {
    console.error(`error while trying to restart envoy`);
    res.writeHead(500);
    res.end();
  });
}

function handleGetConfig(req, res) {
  const content = fs.readFileSync(filePath, { encoding: 'utf8', flag: 'r' })
  res.end(content);
}

function generateEnvConfig(req, res) {
  const env = require('./env.js');
  res.send(`var env=${JSON.stringify(env)}`);
}

const app = express();
app.use('/', express.static('www'));
app.use('/node_modules/', express.static('node_modules'));
app.use(bodyParser.text({type: 'application/yaml'}));
app.post('/applyConfig', handleApplyConfig);
app.get('/getconfig', handleGetConfig);
app.get('/env.js', generateEnvConfig)
app.listen(port, () => console.log(`server listening on port ${port}`));