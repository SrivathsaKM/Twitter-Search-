import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Tweets from './Tweets';
import { io } from 'socket.io-client';

import { Badge, TextField, Button } from '@material-ui/core';
import NotificationsNoneIcon from '@material-ui/icons/NotificationsNone';

const socket = io('http://localhost:3333');

function App() {
  const [data, setData] = useState([]);
  const [tweetCount, setTweetCount] = useState(25);
  const [searchData, setSearchData] = useState('');
  const [newTweetCount, setNewTweetCount] = useState(0);

  const getTweets = (tweetCount) => {
    axios.get(`http://localhost:3333/api/${searchData}/count/${tweetCount}`).then((response) => {
      //console.log(response['data']['statuses']);
      setData(response['data']['statuses']);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    getTweets(tweetCount);
    socket.emit('initial_data', searchData);
  };

  const handleShowMoreTweet = () => {
    setTweetCount(tweetCount + 25);
  };

  useEffect(() => {
    if (tweetCount > 25) {
      getTweets(tweetCount);
    }
    socket.on('get_data', (tweetCount) => {
      //console.log('datasocket', tweetCount);
      setNewTweetCount(tweetCount);
    });
  }, [tweetCount]);

  return (
    <div className='App'>
      <h1>
        <u>Twitter Search App</u>
      </h1>
      <Badge badgeContent={newTweetCount} color='primary' style={{ marginTop: '2rem' }}>
        <NotificationsNoneIcon />
      </Badge>

      <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
        <TextField id='outlined-basic' label='Search Tweet' variant='outlined' type='text' value={searchData} onChange={(e) => setSearchData(e.target.value)} />

        <Button variant='contained' size='small' color='primary' type='submit' style={{ height: '3.5rem', marginLeft: '1rem' }}>
          Search
        </Button>
      </form>

      {data.length > 0 && <Tweets data={data} handleShowMoreTweet={handleShowMoreTweet} />}
    </div>
  );
}
export default App;
