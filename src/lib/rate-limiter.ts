// rate-limiter.ts
export class RateLimiter {
    private queue: Array<() => Promise<any>> = [];
    private processing = false;
    private lastCallTime = 0;
    private readonly minDelay = 4000; // 4 seconds between calls (15 RPM limit)
  
    private async processQueue() {
      if (this.processing || this.queue.length === 0) return;
      this.processing = true;
  
      while (this.queue.length > 0) {
        const now = Date.now();
        const timeSinceLastCall = now - this.lastCallTime;
        if (timeSinceLastCall < this.minDelay) {
          await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastCall));
        }
  
        const task = this.queue.shift();
        if (task) {
          try {
            this.lastCallTime = Date.now();
            await task();
          } catch (error) {
            console.error('Error in rate-limited task:', error);
          }
        }
      }
  
      this.processing = false;
    }
  
    async schedule<T>(task: () => Promise<T>): Promise<T> {
      return new Promise((resolve, reject) => {
        this.queue.push(async () => {
          try {
            const result = await task();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
        this.processQueue();
      });
    }
  }
  
  export const geminiRateLimiter = new RateLimiter();