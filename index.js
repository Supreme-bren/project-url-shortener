require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://osunkbr:Rtx3080FE@cluster0.jmlmiz9.mongodb.net/?retryWrites=true&w=majority");

const User = require('./server')
let originalUrls = [];
let shortUrls = [];

app.post('/api/shorturl', bodyParser.urlencoded({extended: false}), (req, res) =>{

  const url = req.body.url

  const indexSpot = originalUrls.indexOf(url)

  if(!url.includes("https://" || !url.includes("http://"))){
    res.json({
      error: 'invalid url'
    })
  }

  if(indexSpot < 0){
    originalUrls.push(url)
    shortUrls.push(shortUrls.length)
    res.json({
      original_url: url,
      short_url: shortUrls.length - 1
    })
  }
  else{
    res.json({
      original_url: url,
      short_url: shortUrls[indexSpot] 
    })
  }
  
})
app.get('/api/shorturl/:shorturl', (req, res) =>{
  const shortUrl = parseInt(req.params.shorturl)
  const newIndexSpot = shortUrls.indexOf(shortUrl)
  if(newIndexSpot < 0){
    res.json({
      error: "No short URL found for the given input"
    })
  }
  else{
    res.redirect(originalUrls[newIndexSpot])
  }
})
