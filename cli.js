#!/usr/bin/env node

// CLI Utility for Multi-Project Twitter Automation Management
import MultiProjectTwitterAutomation from './src/zamaAutomation.js';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];
const projectArg = args[1];

async function showHelp() {
  console.log(`
🚀 Multi-Project Twitter Automation CLI - Available Commands:

  start                Start the automation (default)
  stop                 Stop the automation
  status               Show automation status
  test                 Test all components
  post                 Post immediately (rotates through projects)
  post <project>       Post for a specific project
  help                 Show this help message

Available Projects:
  Arcium               - The encrypted supercomputer
  Polymarket           - The World's Largest Prediction Market
  Base                 - A global economy built by all of us

Examples:
  node cli.js start
  node cli.js status
  node cli.js post Arcium
  node cli.js post Polymarket
  node cli.js post Base
  node cli.js test
`);
}

async function handleCommand() {
  const bot = new MultiProjectTwitterAutomation();

  try {
    switch (command) {
      case 'help':
      case '--help':
      case '-h':
        await showHelp();
        break;

      case 'status':
        console.log('📊 Getting Multi-Project automation status...\n');
        await bot.initialize();
        const status = bot.getStatus();

        console.log(`Version: ${status.version}`);
        console.log(`Initialized: ${status.initialized ? '✅' : '❌'}`);
        console.log(`Running: ${status.running ? '✅' : '❌'}`);
        console.log(`Active Jobs: ${status.scheduledJobs}`);
        console.log(`Cached Images: ${status.cachedImages}`);
        console.log(`\n📋 Managing Projects: ${status.projects.join(', ')}`);

        if (status.nextPosts && status.nextPosts.length > 0) {
          console.log('\n📅 Next Posts:');
          status.nextPosts.forEach((post, index) => {
            const projectIndex = index % status.projects.length;
            const project = status.projects[projectIndex];
            console.log(`   ${index + 1}. ${post.timeString} (${project})`);
          });
        }

        console.log(`\n📝 Available Projects: ${status.projectList.join(', ')}`);
        break;

      case 'test':
        console.log('🧪 Testing Multi-Project components...\n');
        await bot.initialize();
        await bot.scheduler.testComponents();
        break;

      case 'post':
        console.log(`⚡ Posting immediately${projectArg ? ` for ${projectArg}` : ''}...\n`);
        await bot.initialize();
        const result1 = await bot.postNow(projectArg);
        if (result1.success) {
          console.log('✅ Post completed successfully');
        } else {
          console.log('❌ Post failed:', result1.error);
        }
        break;

      case 'start':
      case undefined:
        console.log('🚀 Starting Multi-Project Twitter Automation...\n');
        bot.setupGracefulShutdown();
        await bot.start();
        break;

      default:
        console.log(`❌ Unknown command: ${command}\n`);
        await showHelp();
        process.exit(1);
    }

  } catch (error) {
    console.error('❌ Command failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  process.exit(1);
});

// Execute command
handleCommand();