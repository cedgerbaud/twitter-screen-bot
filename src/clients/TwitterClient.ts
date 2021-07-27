import needle from 'needle';

export interface ITwitterClient {
  bearer: string
}

class TwitterClient {
  private credentials: ITwitterClient
  private baseUrl: string = "https://api.twitter.com/2/"

  constructor(credentials: ITwitterClient) {
    this.credentials = credentials;
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
      console.log('Twitter client Error')
    }
  }

  public async getUserByUserName(userName: string): Promise<any> {
    return this.get(`users/by/username/${userName}`)
  }

  public async getUserById(id: string): Promise<any> {
    return this.get(`users/${id}`)
  }

  public async getUserMentions(userId: string): Promise<Array<any>> {
    const params = {
      max_results: '100',
      'tweet.fields': 'created_at,in_reply_to_user_id,conversation_id,entities'
    }

    return this.get(`users/${userId}/mentions`, params)
  }

  public async getTweetUrl(tweetId: string, userId: string): Promise<string> {
    const user = await this.getUserById(userId);
    return `https://twitter.com/${user.username}/status/${tweetId}`
  }
}

export default TwitterClient;
