import { promisify } from 'util';
import redis from 'redis';

class RedisClient extends redis.RedisClient {
  public asyncGet: any
  public asyncSet: any

  constructor(options: redis.ClientOpts = {}) {
    super(options);

    this.on('error', (err) => { console.error(err) });
    this.asyncGet = promisify(this.get).bind(this);
    this.asyncSet = promisify(this.set).bind(this);
  }
}

export default RedisClient;
