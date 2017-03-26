const express = require('express');
const bp = require('body-parser');
const fs = require('fs');
const app = express();
const port = 8001;
let fileRows = []; // lines of the poem
let idx = 0; // index of the last row sent

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

const parse = (body) => {
  let res = {};
  for( let key in body ){
    res = JSON.parse(key);
  }
  return res;
}

app.use('/row', (req, res) => {
  let ret = {};
  let hasNew = false;
  let success = [];
  const params = parse( req.body );

  if( !params.newOnly ){
    idx = 0;
  }
  
  // read the whole file
  fileRows = fs.readFileSync('poem.txt', { encoding: 'UTF-8' }).toString().split('\n');
  hasNew = idx < fileRows.length - 1;

  if( !params.newOnly ){
    success = fileRows;
  } else if( hasNew ){
    // the client expects an array
    success = [fileRows[fileRows.length - 1]];
  }
  
  idx = fileRows.length - 1;

  ret = formatForPoller(hasNew, null, success);

  res.send( ret );
});

app.listen(port);

console.log(`Listening on localhost:${ port }`);