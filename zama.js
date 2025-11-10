#!/usr/bin/env node

// Entry point for Zama Twitter Automation v2.0
import ZamaTwitterAutomation from './src/zamaAutomation.js';

async function main() {
  try {
    console.log('🎯 Starting Zama Twitter Automation v2.0 - Influencer Style');
    console.log('=' .repeat(60));

    // Create and start automation
    const zama = new ZamaTwitterAutomation();

    // Setup graceful shutdown handlers
    zama.setupGracefulShutdown();

    // Start the automation
    await zama.start();

    // Keep the process running
    console.log('\n🔄 Zama automation is running. Monitoring scheduled tasks...');

    // Optional: Add periodic status updates
    setInterval(() => {
      const status = zama.getStatus();
      if (status.running) {
        console.log(`💓 Zama alive - ${status.scheduledJobs} active jobs, ${status.cachedImages} cached images`);
      }
    }, 60 * 60 * 1000); // Every hour

  } catch (error) {
    console.error('💥 Fatal error:', error.message);
    console.error('Stack trace:', error.stack);
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

// Start the application
main();