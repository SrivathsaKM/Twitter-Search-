const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const Twit = require('twit');
const server = require('http').createServer(app);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});
let sum = 0;
io.on('connection', (socket) => {
  socket.on('initial_data', (searchData) => {
    const stream = T.stream('statuses/filter', { track: searchData });
    stream.on('tweet', function (tweet) {
      // console.log(Object.keys(tweet).length);
      sum += Object.keys(tweet).length;
      io.sockets.emit('get_data', sum);
    });
  });
});

const port = 3333;

const T = new Twit({
  consumer_key: 'your_cosumer_key',
  consumer_secret: 'your_consumer_secret',
  access_token: 'your_access_token',
  access_token_secret: 'your_token_secret',
});

app.get('/api/:searchData/count/:tweetCount', (req, res) => {
  const searchData = req.params.searchData;
  const tweetCount = req.params.tweetCount;
  T.get('search/tweets', { q: searchData, count: tweetCount }, (err, data, response) => {
    //console.log(data);
    res.send(data);
  });
});

app.get('/api/search/stream/:searchData', (req, res) => {
  const searchData = req.params.searchData;
  const stream = T.stream('statuses/filter', { track: searchData });
  stream.on('tweet', function (tweet) {
    //console.log(Object.keys(tweet).length);
    //console.log(length);
    res.send(tweet);
  });
});

server.listen(port, () => {
  console.log('Server is listening to port', port);
});
