import type RedisClient from '../clients/RedisClient'
import type TwitterClient from '../clients/TwitterClient'
import { CronJob, CronJobParameters } from 'cron'

interface ITweetHandler {
  redis: RedisClient
  twitter: TwitterClient
  cronConfig: string
}

class TweetHandler {
  redis: RedisClient
  twitter: TwitterClient
  cron: CronJob
  isProcessing: boolean

  constructor(params: ITweetHandler) {
    const { redis, twitter, cronConfig } = params

    this.redis = redis;
    this.twitter = twitter;
    this.cron = new CronJob(cronConfig, async () => { await this.testCron() })

    this.isProcessing = false;
  }

  async testCron(): Promise<void> {
    console.log('Cron called')
  }

  start() {
    this.cron.start()
  }

  async handler(): Promise<void> {
    
  }
}

export default TweetHandler;