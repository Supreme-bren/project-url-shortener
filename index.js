require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const urlSchema = new mongoose.Schema({
  original: {
    type: String,
    required: true
  },
  short: Number
});

const Url = mongoose.model('test', urlSchema);

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
let resObject = {};
app.post('/api/shorturl', bodyParser.urlencoded({extended: false}), function(req, res) {
  let inputUrl = req.body.url

  let regExpression = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/ig);

  if(!inputUrl.match(regExpression)){
    res.json({
      error: "invalid url"
    })
    return;
  }


  resObject['original_url'] = inputUrl;

  let shortInput = 1;
  Url.findOne({}).sort({short: 'desc'}).exec((error, result) =>{
    if(!error && result != undefined){
      shortInput = result.short + 1
    }
    if(!error){
      Url.findOneAndUpdate(
        {original: inputUrl},
        {original: inputUrl, short: shortInput},
        {new: true, upsert: true},
        (error, savedUrl)=> {
          if(!error){
            resObject['short_url'] = savedUrl.short;
            res.json(resObject);
          }
        }
      );
    }
  })
});

app.get('/api/shorturl/:input', (req, res) =>{
  let input = req.params.input;
  Url.findOne({short: input}, (err, result) =>{
    if(!err && result != undefined){
      res.redirect(result.original);
    }
    else{
      res.json({error: 'url not found'})
    }
  })
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
})
