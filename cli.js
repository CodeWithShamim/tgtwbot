#!/usr/bin/env node

// CLI Utility for Zama Twitter Automation Management
import ZamaTwitterAutomation from './src/zamaAutomation.js';

// Parse command line arguments
const args = process.argv.slice(2);
const command = args[0];

async function showHelp() {
  console.log(`
🚀 Zama Twitter Automation CLI - Available Commands:

  start         Start the automation (default)
  stop          Stop the automation
  status        Show automation status
  test          Test all components
  post          Post immediately
  post-innovation  Post innovation-focused content
  post-privacy  Post privacy-focused content
  post-defi     Post DeFi-focused content
  post-developer Post developer-focused content
  post-vision   Post vision-focused content
  help          Show this help message

Examples:
  node cli.js start
  node cli.js status
  node cli.js post-innovation
  node cli.js test
`);
}

async function handleCommand() {
  const zama = new ZamaTwitterAutomation();

  try {
    switch (command) {
      case 'help':
      case '--help':
      case '-h':
        await showHelp();
        break;

      case 'status':
        console.log('📊 Getting Zama automation status...\n');
        await zama.initialize();
        const status = zama.getStatus();

        console.log(`Version: ${status.version}`);
        console.log(`Initialized: ${status.initialized ? '✅' : '❌'}`);
        console.log(`Running: ${status.running ? '✅' : '❌'}`);
        console.log(`Active Jobs: ${status.scheduledJobs}`);
        console.log(`Cached Images: ${status.cachedImages}`);

        if (status.nextPosts && status.nextPosts.length > 0) {
          console.log('\n📅 Next Posts:');
          status.nextPosts.forEach((post, index) => {
            console.log(`   ${index + 1}. ${post.timeString}`);
          });
        }

        console.log(`\n📝 Content Types: ${status.contentTypes.join(', ')}`);
        break;

      case 'test':
        console.log('🧪 Testing Zama components...\n');
        await zama.initialize();
        await zama.scheduler.testComponents();
        break;

      case 'post':
        console.log('⚡ Posting immediately...\n');
        await zama.initialize();
        const result1 = await zama.postNow();
        if (result1.success) {
          console.log('✅ Post completed successfully');
        } else {
          console.log('❌ Post failed:', result1.error);
        }
        break;

      case 'post-innovation':
        console.log('⚡ Posting innovation content...\n');
        await zama.initialize();
        const result2 = await zama.postNow('innovation');
        if (result2.success) {
          console.log('✅ Innovation post completed successfully');
        } else {
          console.log('❌ Innovation post failed:', result2.error);
        }
        break;

      case 'post-privacy':
        console.log('⚡ Posting privacy content...\n');
        await zama.initialize();
        const result3 = await zama.postNow('privacy');
        if (result3.success) {
          console.log('✅ Privacy post completed successfully');
        } else {
          console.log('❌ Privacy post failed:', result3.error);
        }
        break;

      case 'post-defi':
        console.log('⚡ Posting DeFi content...\n');
        await zama.initialize();
        const result4 = await zama.postNow('defi');
        if (result4.success) {
          console.log('✅ DeFi post completed successfully');
        } else {
          console.log('❌ DeFi post failed:', result4.error);
        }
        break;

      case 'post-developer':
        console.log('⚡ Posting developer content...\n');
        await zama.initialize();
        const result5 = await zama.postNow('developer');
        if (result5.success) {
          console.log('✅ Developer post completed successfully');
        } else {
          console.log('❌ Developer post failed:', result5.error);
        }
        break;

      case 'post-vision':
        console.log('⚡ Posting vision content...\n');
        await zama.initialize();
        const result6 = await zama.postNow('vision');
        if (result6.success) {
          console.log('✅ Vision post completed successfully');
        } else {
          console.log('❌ Vision post failed:', result6.error);
        }
        break;

      case 'start':
      case undefined:
        console.log('🚀 Starting Zama Twitter Automation...\n');
        zama.setupGracefulShutdown();
        await zama.start();
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