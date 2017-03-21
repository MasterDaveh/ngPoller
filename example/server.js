const express = require('express');
const bp = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8001;
let fileRows = [];
let idx = 0;

app.use('/', express.static('../example/'));
app.use(bp.json());
app.use(bp.urlencoded({ extended: true }));

const formatForPoller = (hasNew, def, success) => {
  const ret = {
    state: 'old',
    data: def
  }

  if( hasNew ){
    ret.state = 'new';
    ret.data = success;
  }

  return ret;
}

app.use('/row', (req, res) => {
  let ret = {};
  let hasNew = false;
  let success = [];
  
  // read file line by line
  // http://stackoverflow.com/questions/6156501/read-a-file-one-line-at-a-time-in-node-js
  
  // read the whole file
  fileRows = fs.readFileSync('poem.txt', { encoding: 'UTF-8' }).toString().split('|');
  hasNew = idx < fileRows.length;
  if( hasNew ){
    success = fileRows[idx++];
  }
  ret = formatForPoller(hasNew, null, success);

  // return only one line
  res.send( ret );
});

app.listen(port);

console.log(`Listening on localhost:${ port }`);