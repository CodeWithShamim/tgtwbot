// Main Multi-Project Twitter Automation - Modular Architecture v3.0
import ImageManager from './modules/image/imageManager.js';
import ContentGenerator from './modules/content/contentGenerator.js';
import TwitterManager from './modules/twitter/twitterManager.js';
import MultiProjectScheduler from './modules/scheduler/zamaScheduler.js';
import { config, validateConfig } from './config/config.js';

class MultiProjectTwitterAutomation {
  constructor() {
    this.imageManager = null;
    this.contentGenerator = null;
    this.twitterManager = null;
    this.scheduler = null;
    this.isInitialized = false;
  }

  // Initialize automation components
  async initialize() {
    try {
      console.log(`🚀 Initializing Multi-Project Twitter Automation v${config.bot.version}...`);
      console.log(`📋 Configuration loaded for ${config.bot.name}`);
      console.log(`📋 Managing ${config.projects.length} projects: ${config.projects.map(p => p.name).join(', ')}`);

      // Validate configuration
      validateConfig();
      console.log('✅ Configuration validated');

      // Initialize components
      this.imageManager = new ImageManager();
      console.log('✅ Image Manager initialized');

      this.contentGenerator = new ContentGenerator();
      console.log('✅ Content Generator initialized');

      this.twitterManager = new TwitterManager();
      console.log('✅ Twitter Manager initialized');

      this.scheduler = new MultiProjectScheduler(
        this.contentGenerator,
        this.imageManager,
        this.twitterManager
      );
      console.log('✅ Multi-Project Scheduler initialized');

      this.isInitialized = true;
      console.log('🎉 Multi-Project initialization complete!');

    } catch (error) {
      console.error('❌ Multi-Project initialization failed:', error.message);
      throw error;
    }
  }

  // Start the automation
  async start() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log('\n🏃 Starting Multi-Project Twitter Automation...');

      // Test components first
      const testResults = await this.scheduler.testComponents();
      const failedComponents = Object.entries(testResults)
        .filter(([_, success]) => !success)
        .map(([component]) => component);

      if (failedComponents.length > 0) {
        console.warn(`⚠️ Some components failed tests: ${failedComponents.join(', ')}`);
        console.log('⚠️ Automation will start but may have limited functionality');
      }

      // Schedule daily posts
      this.scheduler.scheduleDailyPosts();

      // Show next post times
      const nextPosts = this.scheduler.getNextPostTimes();
      console.log('\n📅 Next scheduled posts:');
      nextPosts.forEach((post, index) => {
        const projectIndex = index % config.projects.length;
        const project = config.projects[projectIndex];
        console.log(`   ${index + 1}. ${post.timeString} (${project.name}) (${Math.round(post.msUntil / 1000 / 60)} minutes from now)`);
      });

      console.log('\n✅ Multi-Project automation is now running! Press Ctrl+C to stop.');
      console.log(`📊 Status: ${this.scheduler.getStatus().activeJobs} scheduled jobs`);

    } catch (error) {
      console.error('❌ Failed to start automation:', error.message);
      throw error;
    }
  }

  // Stop the automation
  stop() {
    console.log('\n🛑 Stopping Multi-Project Twitter Automation...');

    if (this.scheduler) {
      this.scheduler.stopAllJobs();
    }

    console.log('✅ Multi-Project automation stopped successfully');
  }

  // Post immediately (for testing)
  async postNow(projectName = null) {
    if (!this.isInitialized) {
      throw new Error('Multi-Project bot not initialized. Call initialize() first.');
    }

    try {
      console.log('⚡ Posting immediately...');
      const result = await this.scheduler.scheduleImmediatePost(projectName);
      return result;
    } catch (error) {
      console.error('❌ Immediate post failed:', error.message);
      throw error;
    }
  }

  // Get automation status
  getStatus() {
    if (!this.isInitialized) {
      return {
        initialized: false,
        running: false,
        message: 'Multi-Project bot not initialized',
      };
    }

    const schedulerStatus = this.scheduler.getStatus();
    const cachedImages = this.imageManager.getCachedImagesCount();

    return {
      initialized: true,
      running: schedulerStatus.isRunning,
      version: config.bot.version,
      projects: config.projects.map(p => p.name),
      scheduledJobs: schedulerStatus.activeJobs,
      cachedImages,
      nextPosts: this.scheduler.getNextPostTimes().slice(0, 3), // Next 3 posts
      projectList: this.contentGenerator.getProjects(),
    };
  }

  // Handle graceful shutdown
  setupGracefulShutdown() {
    const shutdown = (signal) => {
      console.log(`\n📡 Received ${signal}. Shutting down gracefully...`);
      this.stop();
      process.exit(0);
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  }
}

// Export for use in other files
export default MultiProjectTwitterAutomation;

// Auto-start if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const bot = new MultiProjectTwitterAutomation();

  // Setup graceful shutdown
  bot.setupGracefulShutdown();

  // Start the automation
  bot.start().catch((error) => {
    console.error('❌ Failed to start Multi-Project automation:', error.message);
    process.exit(1);
  });
}