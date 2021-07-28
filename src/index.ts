import Twitter from './clients/TwitterClient'
import Redis from './clients/RedisClient'
import dotenv from 'dotenv'
import screener from './services/screener'
import TweetHandler from './services/tweetsHandler'

dotenv.config()

const twitter = new Twitter({ bearer: process.env.TWITTER_BEARER ?? '' })
const redis = new Redis();
const cronConfig = '*/5 * * * * *'
const handler = new TweetHandler({ twitter, redis, cronConfig })

handler.start()

async function init() {
  // await redis.asyncSet('lastTweet', 1232645211321)
  // const lastTweetId = await redis.asyncGet('lastTweet')
  // console.log(lastTweetId)

  // const user = await client.getUserByUserName("screenThisTweet")
  // console.log(user)

  // const user2 = await client.getUserMentions(process.env.TWITTER_BOT_ID ?? '')
  // console.log(user2)

  // console.log('TEST SCREENER he ho')
  // const tweetTest = await client.getTweet('1381512139119165442')
  // console.log(tweetTest)
  // // await screener()
}

(async () => await init())()

