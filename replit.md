# TelegramTwitterBot

## Overview
A Node.js bot that monitors a Telegram channel for new messages and automatically posts them to Twitter. The bot includes screenshot functionality to capture message images and post them alongside the text.

## Project Structure
- `tg-tw.js` - Main bot application with Telegram monitoring and Twitter posting
- `package.json` - Node.js dependencies and scripts
- Node.js application using ES modules

## Dependencies
- `twitter-api-v2` - Twitter API integration
- `telegram` - Telegram client library  
- `puppeteer` - Web scraping for screenshot capture
- `dotenv` - Environment variable management
- `input` - Interactive command line input

## Configuration Requirements

### Required Environment Variables
The following secrets must be configured in Replit's environment:

**Twitter API Credentials:**
- `TWITTER_APP_KEY` - Twitter App/Consumer Key
- `TWITTER_APP_SECRET` - Twitter App/Consumer Secret  
- `TWITTER_ACCESS_TOKEN` - Twitter Access Token
- `TWITTER_ACCESS_SECRET` - Twitter Access Token Secret

**Telegram API Credentials:**
- `TG_API_ID` - Telegram API ID (from https://my.telegram.org)
- `TG_API_HASH` - Telegram API Hash (from https://my.telegram.org)
- `TG_SESSION` - Telegram session string (generated on first run)

### Setup Instructions
1. Get Twitter API credentials from https://developer.twitter.com
2. Get Telegram API credentials from https://my.telegram.org
3. Add all environment variables to Replit secrets
4. Run the bot - it will prompt for phone verification on first setup
5. The session string will be saved automatically for future runs

## Current State
- ✅ Dependencies installed and configured
- ✅ Puppeteer configured for Replit environment
- ✅ Workflow configured for console output
- ⚠️ Environment variables need to be set before running
- ⚠️ First run requires interactive Telegram authentication

## Architecture Notes
- Bot runs as a console application (not a web frontend)
- Uses event-driven architecture to monitor Telegram messages
- Includes rate limiting (15 seconds between posts)
- Duplicate message detection to prevent spam
- Screenshot functionality currently commented out but configured for Replit environment

## Recent Changes
- 2025-09-26: Initial Replit environment setup
- 2025-09-26: Configured Puppeteer with Replit-compatible flags
- 2025-09-26: Set up workflow for console application