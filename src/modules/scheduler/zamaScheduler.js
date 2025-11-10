// Zama Scheduler Module for Zama Twitter Automation
import { config } from '../../config/config.js';

class ZamaScheduler {
  constructor(contentGenerator, imageManager, twitterManager) {
    this.contentGenerator = contentGenerator;
    this.imageManager = imageManager;
    this.twitterManager = twitterManager;
    this.scheduledJobs = new Map();
    this.isRunning = false;
  }

  // Schedule posts throughout the day
  scheduleDailyPosts() {
    console.log('📅 Setting up daily posting schedule...');

    const { postingHours, postsPerDay, randomDelayMinutes } = config.content;

    postingHours.forEach((hour, index) => {
      // Add random delay to look more human
      const delay = Math.floor(Math.random() * randomDelayMinutes);
      const now = new Date();
      const targetTime = new Date();

      targetTime.setHours(hour, delay, 0, 0);

      // If target time has passed today, schedule for tomorrow
      if (targetTime < now) {
        targetTime.setDate(targetTime.getDate() + 1);
      }

      const msUntilPost = targetTime - now;

      // Create unique job ID
      const jobId = `daily-post-${index + 1}-${hour}`;

      // Clear existing job if it exists
      if (this.scheduledJobs.has(jobId)) {
        clearTimeout(this.scheduledJobs.get(jobId));
      }

      // Schedule the job
      const job = setTimeout(() => {
        this.executePost(jobId, index);
        // Schedule to repeat daily
        this.scheduleRecurringPost(jobId, index, 24 * 60 * 60 * 1000);
      }, msUntilPost);

      this.scheduledJobs.set(jobId, job);

      console.log(`⏰ Scheduled post ${index + 1} for ${targetTime.toLocaleString()} (${jobId})`);
    });

    this.isRunning = true;
    console.log(`✅ Scheduled ${postsPerDay} posts per day at hours: [${postingHours.join(', ')}]`);
  }

  // Schedule recurring post
  scheduleRecurringPost(jobId, index, interval) {
    const job = setInterval(() => {
      this.executePost(jobId, index);
    }, interval);

    this.scheduledJobs.set(jobId, job);
  }

  // Execute a post
  async executePost(jobId, templateIndex) {
    try {
      console.log(`\n🚀 Executing scheduled post: ${jobId}`);
      console.log(`⏰ Time: ${new Date().toLocaleString()}`);

      // Generate content
      const contentResult = await this.contentGenerator.generateContent();
      if (!contentResult || !contentResult.content) {
        console.error('❌ Failed to generate content');
        return;
      }

      // Normalize content for Twitter
      const tweetText = this.contentGenerator.normalizeText(contentResult.content);
      console.log(`📝 Generated ${contentResult.type} content: ${tweetText.substring(0, 100)}...`);

      // Get image
      console.log('🖼️ Fetching image...');
      const imagePath = await this.imageManager.getZamaImage();

      // Post to Twitter with fallback logic
      if (imagePath) {
        console.log('📸 Image available, posting with media...');
        await this.twitterManager.postTweetWithFallback(tweetText, imagePath);
      } else {
        console.log('📝 No image available, posting text only...');
        await this.twitterManager.postTweetWithFallback(tweetText);
      }

      console.log(`✅ Post completed successfully: ${jobId}`);

    } catch (error) {
      console.error(`❌ Error executing post ${jobId}:`, error.message);

      // Try to post a simple fallback message
      try {
        const fallbackText = "Exploring how #privacy and #encryption are reshaping blockchain technology. The future of confidential transactions is here.";
        await this.twitterManager.postTweetWithFallback(fallbackText);
        console.log('✅ Fallback post completed');
      } catch (fallbackError) {
        console.error('❌ Even fallback post failed:', fallbackError.message);
      }
    }
  }

  // Schedule a single immediate post (for testing)
  async scheduleImmediatePost(templateType = null) {
    try {
      console.log('⚡ Scheduling immediate post...');

      let contentResult;
      if (templateType) {
        contentResult = await this.contentGenerator.getContentByType(templateType);
      } else {
        contentResult = await this.contentGenerator.getRandomContent();
      }

      if (!contentResult || !contentResult.content) {
        throw new Error('Failed to generate content');
      }

      const tweetText = this.contentGenerator.normalizeText(contentResult.content);
      console.log(`📝 Generated content: ${tweetText.substring(0, 100)}...`);

      const imagePath = await this.imageManager.getZamaImage();

      if (imagePath) {
        await this.twitterManager.postTweetWithFallback(tweetText, imagePath);
      } else {
        await this.twitterManager.postTweetWithFallback(tweetText);
      }

      console.log('✅ Immediate post completed');
      return { success: true, content: contentResult };

    } catch (error) {
      console.error('❌ Error in immediate post:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Stop all scheduled jobs
  stopAllJobs() {
    console.log('🛑 Stopping all scheduled jobs...');

    this.scheduledJobs.forEach((job, jobId) => {
      clearTimeout(job);
      clearInterval(job);
      console.log(`⏹️ Stopped job: ${jobId}`);
    });

    this.scheduledJobs.clear();
    this.isRunning = false;

    console.log('✅ All scheduled jobs stopped');
  }

  // Get scheduler status
  getStatus() {
    return {
      isRunning: this.isRunning,
      activeJobs: this.scheduledJobs.size,
      jobIds: Array.from(this.scheduledJobs.keys()),
      scheduledHours: config.content.postingHours,
      postsPerDay: config.content.postsPerDay,
    };
  }

  // Test all components
  async testComponents() {
    console.log('\n🧪 Testing Zama components...');

    const results = {
      content: false,
      image: false,
      twitter: false,
    };

    try {
      // Test content generation
      console.log('\n📝 Testing content generation...');
      const content = await this.contentGenerator.getRandomContent();
      if (content && content.content) {
        console.log('✅ Content generation working');
        results.content = true;
      }
    } catch (error) {
      console.error('❌ Content generation failed:', error.message);
    }

    try {
      // Test image fetching
      console.log('\n🖼️ Testing image fetching...');
      const image = await this.imageManager.getZamaImage();
      if (image) {
        console.log('✅ Image fetching working');
        results.image = true;
      }
    } catch (error) {
      console.error('❌ Image fetching failed:', error.message);
    }

    try {
      // Test Twitter connection
      console.log('\n🐦 Testing Twitter connection...');
      const connected = await this.twitterManager.testConnection();
      if (connected) {
        console.log('✅ Twitter connection working');
        results.twitter = true;
      }
    } catch (error) {
      console.error('❌ Twitter connection failed:', error.message);
    }

    console.log('\n📊 Test Results:', results);
    return results;
  }

  // Get next scheduled post times
  getNextPostTimes() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextTimes = config.content.postingHours.map(hour => {
      const scheduledTime = new Date(today);
      scheduledTime.setHours(hour, Math.floor(Math.random() * config.content.randomDelayMinutes), 0, 0);

      if (scheduledTime <= now) {
        scheduledTime.setDate(scheduledTime.getDate() + 1);
      }

      return {
        hour,
        time: scheduledTime,
        timeString: scheduledTime.toLocaleString(),
        msUntil: scheduledTime - now,
      };
    });

    return nextTimes.sort((a, b) => a.msUntil - b.msUntil);
  }
}

export default ZamaScheduler;