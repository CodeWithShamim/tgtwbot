# Zama Twitter Automation v2.0 - Influencer Style

A professional Twitter automation for Zama that posts influencer-style content about blockchain privacy, homomorphic encryption, and confidential DeFi. Every post includes @zama tagging and uses GPT-4 for authentic, human-like writing.

## 🚀 Features

- **🎭 Influencer-Style Content**: Uses GPT-4 to generate authentic, engaging tweets that sound like real crypto influencers
- **🏷️ @zama Tagging**: Every post naturally includes @zama for maximum brand visibility
- **🖼️ Dynamic Image Fetching**: Downloads relevant images from multiple sources (Pexels, Pixabay, Lorem Picsum, Unsplash)
- **⏰ Smart Scheduling**: Posts exactly 5 times daily at optimal hours with human-like random delays
- **🏗️ Modular Architecture**: Clean, maintainable codebase with separated concerns
- **🛡️ Safety Features**: Multiple fallback mechanisms and error handling
- **📊 CLI Management**: Easy command-line interface for automation management

## 📁 Project Structure

```
TgTwitter/
├── src/
│   ├── config/
│   │   └── config.js           # Configuration management
│   ├── modules/
│   │   ├── image/
│   │   │   └── imageManager.js # Image downloading & caching
│   │   ├── content/
│   │   │   └── contentGenerator.js # AI content generation
│   │   ├── twitter/
│   │   │   └── twitterManager.js  # Twitter API operations
│   │   └── scheduler/
│   │       └── zamaScheduler.js   # Post scheduling logic
│   └── zamaAutomation.js         # Main automation controller
├── zama.js                      # Entry point
├── cli.js                       # CLI utility
├── downloaded_images/           # Cached images
├── public/                      # Empty (old images removed)
├── .env                         # Environment variables
├── tg-tw.js                     # Legacy version (preserved)
└── package.json                 # Dependencies & scripts
```

## ⚙️ Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   # Copy and edit the .env file with your API keys
   TWITTER_APP_KEY=your_app_key
   TWITTER_APP_SECRET=your_app_secret
   TWITTER_ACCESS_TOKEN=your_access_token
   TWITTER_ACCESS_SECRET=your_access_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

3. **Start the bot**:
   ```bash
   npm start
   ```

## 🎮 CLI Commands

```bash
# Start the automation
npm start

# Check automation status
npm run status

# Test all components
npm run test

# Post immediately
npm run post

# Post specific influencer-style content
npm run post-innovation  # Innovation breakthrough content
npm run post-privacy     # Privacy advocate content
npm run post-defi        # DeFi enthusiast content
npm run post-developer  # Developer opportunity content
npm run post-vision      # Visionary future content

# Show help
npm run help

# Run legacy version
npm run legacy
```

## 📅 Posting Schedule

The bot posts 5 times daily at these hours (with random delays):
- 9:00 AM ± 20 minutes
- 12:00 PM ± 20 minutes
- 3:00 PM ± 20 minutes
- 6:00 PM ± 20 minutes
- 9:00 PM ± 20 minutes

## 🖼️ Image Sources

The bot fetches images from multiple sources to ensure variety:

1. **Pexels**: Curated tech and cybersecurity images
2. **Pixabay**: Blockchain and cryptography visuals
3. **Lorem Picsum**: Random high-quality placeholders
4. **Unsplash**: Search-based images using Zama-related terms

## 📝 Influencer Content Types

The automation generates 5 different influencer-style content types, all including @zama:

- **🚀 Innovation**: Tech breakthrough content - "Mind-blowing what @zama is doing with FHE!"
- **🔒 Privacy**: Privacy advocate content - "Finally, @zama is fixing blockchain's transparency problem"
- **💰 DeFi**: DeFi enthusiast content - "This is why @zama will unlock the next wave of DeFi adoption"
- **👨‍💻 Developer**: Developer opportunity content - "Dev community, you need to see what @zama just dropped"
- **🔮 Vision**: Future vision content - "The future is private, and @zama is building it"

## 🛡️ Safety Features

- **Multiple Fallbacks**: If image fetching fails, posts text-only
- **Error Handling**: Comprehensive error logging and recovery
- **Rate Limiting**: Respectful timing to avoid platform restrictions
- **Content Validation**: Ensures content meets Twitter requirements
- **Graceful Shutdown**: Clean process termination

## 🔧 Configuration

Main configuration is in `src/config/config.js`:

- Posting schedule and frequency
- Image source preferences
- Content generation parameters
- Twitter API settings
- File size and caching limits

## 🚨 Error Handling

The bot includes comprehensive error handling:

- **Network Failures**: Automatic retries with fallback sources
- **API Errors**: Graceful degradation to text-only posts
- **File System Errors**: Cleanup and recovery mechanisms
- **Configuration Errors**: Validation and clear error messages

## 📊 Monitoring

Use the CLI to monitor bot health:

```bash
npm run status
```

This shows:
- Active scheduled jobs
- Cached image count
- Next posting times
- Component status

## 🔄 Updates

The modular architecture makes it easy to:

- Add new image sources
- Create new content types
- Modify posting schedules
- Update API integrations
- Add new CLI commands

## 📝 Logs

The bot provides detailed logging:

- 🚀 Initialization status
- 📝 Content generation details
- 🖼️ Image download progress
- 🐦 Twitter posting results
- ❌ Error details and recovery

## 🆘 Troubleshooting

**Bot won't start**:
- Check environment variables in `.env`
- Verify API keys are correct
- Run `npm run test` to check components

**No images posting**:
- Check internet connection
- Verify image sources are accessible
- Check `downloaded_images/` directory permissions

**Content not generating**:
- Verify OpenAI API key
- Check OpenAI API quota
- Run `npm run test` for component status

## 📄 License

ISC License - See package.json for details.
