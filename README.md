# Multi-Project Twitter Automation v3.0

A professional Twitter automation bot that manages multiple crypto projects, posting engaging content with dynamic image fetching. Currently configured for Arcium, Polymarket, and Base.

## 🚀 Features

- **🎯 Multi-Project Management**: Post content for multiple projects in rotation
- **🤖 AI-Generated Content**: Uses xAI Grok for authentic, engaging posts
- **🏷️ Project Tagging**: Each post includes the relevant project's Twitter handle
- **🖼️ Dynamic Image Fetching**: Downloads relevant images from multiple sources (Pexels, Pixabay, Lorem Picsum, Unsplash)
- **⏰ Smart Scheduling**: Posts 3 times daily at optimal hours with human-like random delays
- **🏗️ Modular Architecture**: Clean, maintainable codebase with separated concerns
- **🛡️ Safety Features**: Multiple fallback mechanisms and error handling
- **📊 CLI Management**: Easy command-line interface for automation management

## 📁 Project Structure

```
TgTwitter/
├── src/
│   ├── config/
│   │   └── config.js           # Configuration management (projects, API keys, settings)
│   ├── modules/
│   │   ├── image/
│   │   │   └── imageManager.js # Image downloading & caching
│   │   ├── content/
│   │   │   └── contentGenerator.js # AI content generation for each project
│   │   ├── twitter/
│   │   │   └── twitterManager.js  # Twitter API operations
│   │   └── scheduler/
│   │       └── zamaScheduler.js   # Post scheduling logic
│   └── zamaAutomation.js         # Main automation controller
├── main.js                      # Entry point
├── cli.js                       # CLI utility
├── downloaded_images/           # Cached images
├── .env                         # Environment variables
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
   XAI_API_KEY=your_xai_api_key
   ```

3. **Configure your projects**:
   Edit `src/config/config.js` to add or modify projects in the `projects` array.

4. **Start the bot**:
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

# Post immediately (rotates through projects)
npm run post

# Post for a specific project
npm run post-arciium
npm run post-polymarket
npm run post-base

# Show help
npm run help
```

## 📅 Posting Schedule

The bot posts 3 times daily at these hours (with random delays):

- 9:00 AM ± 20 minutes
- 3:00 PM ± 20 minutes
- 9:00 PM ± 20 minutes

Each post rotates through the configured projects (Arcium, Polymarket, Base).

## 🖼️ Image Sources

The bot fetches images from multiple sources to ensure variety:

1. **Pexels**: Curated tech and cybersecurity images
2. **Pixabay**: Blockchain and cryptography visuals
3. **Lorem Picsum**: Random high-quality placeholders
4. **Unsplash**: Search-based images using project-specific terms

## 📝 Managed Projects

### Arcium (@Arcium)

**Website**: https://www.arcium.com
**Description**: The encrypted supercomputer.

Content focuses on:

- Encrypted computing and secure cloud infrastructure
- Data privacy and computation
- Privacy-preserving technology

### Polymarket (@Polymarket)

**Website**: https://polymarket.com
**Description**: The World's Largest Prediction Market. Trade politics, news, culture, sports & tech.

Content focuses on:

- Prediction markets and trading on real-world events
- Decentralized forecasting
- Market sentiment and analytics

### Base (@base)

**Website**: https://www.base.org/
**Description**: A global economy built by all of us. Built on Ethereum, built on the Superchain.

Content focuses on:

- Layer 2 scaling solutions
- The Superchain ecosystem
- Mainstream blockchain adoption

## 🛡️ Safety Features

- **Multiple Fallbacks**: If image fetching fails, posts text-only
- **Error Handling**: Comprehensive error logging and recovery
- **Rate Limiting**: Respectful timing to avoid platform restrictions
- **Content Validation**: Ensures content meets Twitter requirements
- **Graceful Shutdown**: Clean process termination

## 🔧 Configuration

Main configuration is in `src/config/config.js`:

- **projects**: Array of project configurations (name, handle, description, search terms)
- **content**: Posting schedule and frequency
- **images**: Image source preferences
- **grok**: xAI Grok API settings
- **twitter**: Twitter API credentials

### Adding New Projects

To add a new project, add it to the `projects` array in `config.js`:

```javascript
{
  name: "YourProject",
  twitterHandle: "@YourHandle",
  website: "https://yourproject.com",
  description: "Brief description of the project",
  searchTerms: [
    "search term 1",
    "search term 2",
    // ... more search terms for images
  ],
}
```

Then add project-specific content prompts in `src/modules/content/contentGenerator.js` in the `createProjectPrompt()` method.

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
- Next posting times with project assignments
- Component status
- Available projects

## 🔄 Updates

The modular architecture makes it easy to:

- Add new image sources
- Add new projects
- Modify posting schedules
- Update API integrations
- Add new CLI commands

## 📝 Logs

The bot provides detailed logging:

- 🚀 Initialization status
- 📝 Content generation details (with project name)
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

- Verify XAI API key
- Check XAI API quota
- Run `npm run test` for component status

## 🚀 Future Enhancements

Potential improvements:

- Add more projects to the rotation
- Implement content analytics and optimization
- Add interaction automation (likes, retweets)
- Multi-language support
- Advanced image filtering and selection
- Content performance tracking

## 📄 License

ISC License - See package.json for details.
