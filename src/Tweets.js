import React from 'react';
import EachTweets from './EachTweets';

import { Button } from '@material-ui/core';
const Tweets = (props) => {
  const { data, handleShowMoreTweet } = props;

  const handleTweet = () => {
    handleShowMoreTweet();
  };

  return (
    <>
      <div>
        <h1>Total Tweets - ({data.length})</h1>
        {data.length > 0 &&
          data.map((ele) => {
            return <EachTweets {...ele} key={ele.id} />;
          })}
      </div>
      <Button onClick={handleTweet} variant='contained' size='small' color='secondary' style={{ marginTop: '2rem' }}>
        Load more
      </Button>
    </>
  );
};

export default Tweets;
