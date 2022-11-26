import { ETwitterStreamEvent, TwitterApi } from 'twitter-api-v2';
import * as dotenv from 'dotenv';
dotenv.config();

const client = new TwitterApi(process.env.BEARER_TOKEN);

console.log('Made it passed credentials');

// Delete any existing rules
const rules = await client.v2.streamRules();
if (rules.data?.length) {
  await client.v2.updateStreamRules({
    delete: { ids: rules.data.map(rule => rule.id) },
  });
}
// add new rules
await client.v2.updateStreamRules({
  add: [{ value: 'Supercalifragilisticexpialidocious' }],
});

console.log('added rules');

// Create stream with new rules
const stream = await client.v2.searchStream({
  'tweet.fields': ['referenced_tweets', 'author_id'],
  expansions: ['referenced_tweets.id'],
});

console.log('stream is on')
// Enable auto reconnect
stream.autoReconnect = true;


// Turn stream on and start listening
stream.on(ETwitterStreamEvent.Data, async tweet => {

  console.log('attempt to tweet');
  // Reply to tweet
  await client.v1.tweet('TEST WORKED MFERS', tweet.data.id);
  console.log('Tweet sent!');
});