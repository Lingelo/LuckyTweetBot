import Twit from "twit";
import { logger } from "./utils/logs";
import dotenv from "dotenv";

dotenv.config();

const T = new Twit({
    consumer_key: process.env.YOUR_CONSUMER_KEY,
    consumer_secret: process.env.YOUR_CONSUMER_SECRET,
    access_token: process.env.YOUR_ACCESS_TOKEN,
    access_token_secret: process.env.YOUR_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional HTTP request timeout to apply to all requests.
});

const stream = T.stream('statuses/filter', {track: '#CONCOURS'});

stream.on('tweet', function (tweet) {
    // check if tweet contains contest details
    if (tweet.text.indexOf('CONCOURS') !== -1) {
        // follow user who posted the tweet
        T.post('friendships/create', {screen_name: tweet.user.screen_name}, function(err, data, response) {
            logger.info(data)
        })

        // like tweet
        T.post('favorites/create', {id: tweet.id_str}, function(err, data, response) {
            logger.info(data)
        })

        // retweet tweet
        T.post('statuses/retweet/:id', {id: tweet.id_str}, function(err, data, response) {
            logger.info(data)
        })
    }
})
