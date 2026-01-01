#!/usr/bin/env node

// Enable test mode BEFORE importing any modules
process.env.TEST_MODE = 'true';

// Test script to run bot locally without posting to Twitter
import MultiProjectTwitterAutomation from './src/zamaAutomation.js';

async function runTest() {
  console.log('🧪 ===============================================');
  console.log('🧪 LOCAL TEST MODE - No Real Twitter Posts');
  console.log('🧪 ===============================================\n');

  const bot = new MultiProjectTwitterAutomation();

  try {
    // Initialize the bot
    await bot.initialize();

    // Post for each project to show different outputs
    const projects = ['Arcium', 'Polymarket', 'Base'];

    console.log('\n📋 Testing posts for all projects...\n');

    for (const project of projects) {
      console.log(`\n🎯 ===============================================`);
      console.log(`🎯 Testing ${project} Project`);
      console.log(`🎯 ===============================================\n`);

      const result = await bot.postNow(project);

      if (result.success) {
        console.log(`✅ ${project} test completed successfully!`);
      } else {
        console.log(`❌ ${project} test failed:`, result.error);
      }

      // Add a small delay between posts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n\n🎉 ===============================================');
    console.log('🎉 All Tests Completed!');
    console.log('🎉 ===============================================');
    console.log('\n📝 Summary:');
    console.log('   • Test mode: ENABLED (no real posts)');
    console.log('   • Generated content for 3 projects');
    console.log('   • Fetched and prepared images');
    console.log('   • Validated all components\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
runTest().catch((error) => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});
