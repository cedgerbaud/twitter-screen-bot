import Twitter from './clients/TwitterClient'
import Redis from './clients/RedisClient'
import dotenv from 'dotenv'
import screener from './utils/screener'

dotenv.config()

console.log('Bearer', process.env.TWITTER_BEARER)

console.log('Hello nodemon')

const client = new Twitter({ bearer: process.env.TWITTER_BEARER ?? '' })
const redis = new Redis();

async function init() {
  await redis.asyncSet('lastTweet', 1232645211321)
  const lastTweetId = await redis.asyncGet('lastTweet')
  console.log(lastTweetId)

  const user = await client.getUserByUserName("screenThisTweet")
  console.log(user)

  const user2 = await client.getUserMentions(process.env.TWITTER_BOT_ID ?? '')
  console.log(user2)

  console.log('TEST SCREENER he ho')
  // await screener()
}

(async () => await init())()