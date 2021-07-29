import dotenv from 'dotenv'
import Application from './Application'
import Redis from './clients/RedisClient'
import Twitter from './clients/TwitterClient'

import { image } from './test.base64'

import screener from './services/screener'

dotenv.config()

const twitterCredentials = {
  bearer: process.env.TWITTER_BEARER ?? '',
  accessTokenKey: process.env.TWITTER_ACCESS_TOKEN_KEY ?? '',
  accessTokenSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET ?? '',
  consumerKey: process.env.TWITTER_CONSUMER_KEY ?? '',
  consumerSecret: process.env.TWITTER_CONSUMER_SECRET ?? '',
}

const twitter = new Twitter(twitterCredentials)
const redis = new Redis({ port: +(process.env.REDIS_PORT ?? 6379) });
const cronConfig = '*/5 * * * * *'
const botId = process.env.TWITTER_BOT_ID ?? ''

const app = new Application({ twitter, redis, cronConfig, botId })

// app.start()
// app.handler()

const testTweetUrl = 'https://twitter.com/ValeYellow46/status/1420730636311138311';

(async () => {
  const uploadedMedia = await twitter.uploadImage(image)
  console.log('this the end')
})()

