import needle from 'needle';

export interface ITwitterClient {
  bearer: string
  accessTokenKey: string
  accessTokenSecret: string
  consumerKey: string
  consumerSecret: string
}

class TwitterClient {
  private credentials: ITwitterClient
  private baseUrl: string = "https://api.twitter.com/2/"
  private mediaBaseUrl: string = "https://api.https://upload.twitter.com/1.1/media/upload.json.com"

  constructor(credentials: ITwitterClient) {
    this.credentials = credentials;
  }

  private get oauth() {
    return {
      consumer_key: this.credentials.consumerKey,
      consumer_secret: this.credentials.consumerSecret,
      token: this.credentials.accessTokenKey,
      token_secret: this.credentials.accessTokenSecret,
    }
  }

  private get options() {
    return {
      access_token_key: null,
      access_token_secret: null,
      bearer_token: null,
      rest_base: 'https://api.twitter.com/1.1',
      stream_base: 'https://stream.twitter.com/1.1',
      user_stream_base: 'https://userstream.twitter.com/1.1',
      site_stream_base: 'https://sitestream.twitter.com/1.1',
      media_base: 'https://upload.twitter.com/1.1',
      request_options: {
        headers: {
          Accept: '*/*',
          Connection: 'close',
          'User-Agent': 'v2UserLookupJS'
        }
      },
      ...this.oauth,
    }
  }

  private get baseOptions() {
    return {
      headers: {
        "User-Agent": "v2UserLookupJS",
        "authorization": `Bearer ${this.credentials.bearer}`
      }
    }
  }

  private async get(endpoint: string, params: Record<string, any> = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const res = await needle('get', url, params, this.baseOptions)
      return res.body?.data
    } catch (err) {
      console.error('Twitter client Error: ' + err)
    }
  }

  public async getUserByUserName(userName: string): Promise<any> {
    return this.get(`users/by/username/${userName}`)
  }

  public async getUserById(id: string): Promise<any> {
    return this.get(`users/${id}`)
  }

  public async getUserMentions(userId: string, lastTweetId: string): Promise<Array<any>> {
    const params = {
      since_id: lastTweetId,
      max_results: '100',
      'tweet.fields': 'created_at,in_reply_to_user_id,conversation_id',
      expansions: 'in_reply_to_user_id'
    }

    return this.get(`users/${userId}/mentions`, params)
  }

  public async getTweetUrl(tweetId: string): Promise<string> {
    const userId = (await this.get(`tweets/${tweetId}`, { 'tweet.fields': 'author_id' })).author_id
    const user = await this.getUserById(userId);
    return `https://twitter.com/${user.username}/status/${tweetId}`
  }

  public async getTweet(id: string): Promise<any> {
    const tweet = await this.get(`tweets/${id}`, { 'user.fields': 'username', expansions: 'author_id' })
    return tweet
  }

  public async uploadImage(base64Image: string): Promise<any> {
    const url = 'https://upload.twitter.com/1.1/media/upload.json'

    try {
      const response = await needle.post(
        url,
        {
          // ...this.baseOptions,
          // name: 'test',
          // command: 'INIT',
          media_category: 'tweet_image',
          media_data: base64Image,
        },
        {
          headers: {
            authorization: 'OAuth',
            
          }
        }
      )

      return response
    } catch (e) {
      console.error(`Twitter Upload ERROR: ${e.message}`)
    }

  }
}

export default TwitterClient;
