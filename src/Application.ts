import type RedisClient from './clients/RedisClient'
import type TwitterClient from './clients/TwitterClient'
import { CronJob, CronJobParameters } from 'cron'
import screener from './services/screener'

interface IApplication {
  redis: RedisClient
  twitter: TwitterClient
  cronConfig: string
  botId: string
}

class Application {
  private redis: RedisClient
  private twitter: TwitterClient
  private cron: CronJob
  private botId: string
  private isProcessing: boolean = false

  constructor(params: IApplication) {
    const { redis, twitter, cronConfig, botId } = params

    this.redis = redis;
    this.twitter = twitter;
    this.botId = botId;

    this.cron = new CronJob(cronConfig, async () => {
      this.isProcessing = true;
      
      await this.testCron()

      this.isProcessing = false;
    })
  }

  private async testCron(): Promise<void> {
    console.log('Cron called')
  }
  
  public async handler(): Promise<void> {
    if (this.isProcessing) return;

    const lastTweetId = await this.redis.asyncGet('lastTweetId') ?? 0;

    for (let t of await this.twitter.getUserMentions(this.botId, '1417776303902797824')) {
      console.log('On y est')
      await this.processMention(t);
    }

    return
  }

  private async processMention(mention: any): Promise<void> {
    if (!!(await this.redis.asyncGet(mention.id))) return;

    await this.redis.asyncSet(mention.id, false)

    // Check if really mention or tweet
    if (!mention.in_reply_to_user_id) {
      await this.redis.asyncSet(mention.id, true)
    } else {
      const tweetId = mention.conversation_id
      const tweetUrl = await this.twitter.getTweetUrl(tweetId);

      await screener(tweetUrl)
      await this.redis.asyncSet(mention.id, true)
    }
    // Get screen

    // Upload media

    // Upload new tweet with media

    // Redis -> tweetId / true

    // Redis -> lastTweet / tweetId
    // await this.redis.asyncSet('lastTweetId', mention.id)

    return
  }

  public start() {
    this.cron.start()
  }
}

export default Application;