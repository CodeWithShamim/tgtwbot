// Twitter API Management Module for Zama Twitter Bot
import { TwitterApi } from "twitter-api-v2";
import { config } from "../../config/config.js";

class TwitterManager {
  constructor() {
    this.client = new TwitterApi({
      appKey: config.twitter.appKey,
      appSecret: config.twitter.appSecret,
      accessToken: config.twitter.accessToken,
      accessSecret: config.twitter.accessSecret,
    });

    this.isVerified = config.twitter.isVerified;
    this.testMode = config.bot.testMode; // Dry-run mode
  }

  // Upload media to Twitter
  async uploadMedia(imagePath) {
    try {
      if (!imagePath) {
        throw new Error("No image path provided");
      }

      console.log("📤 Uploading media to Twitter...");

      // Read image file
      const fs = await import("fs");
      const mediaData = fs.readFileSync(imagePath);

      // Upload media
      const mediaResponse = await this.client.v2.uploadMedia(mediaData, {
        media_category: "tweet_image",
      });

      if (!mediaResponse) {
        throw new Error("No media response received");
      }

      console.log("✅ Media uploaded successfully:", mediaResponse);
      return mediaResponse;
    } catch (error) {
      console.error("❌ Error uploading media:", error.message);
      throw error;
    }
  }

  // Post tweet with media
  async postTweetWithMedia(text, imagePath) {
    try {
      if (this.testMode) {
        console.log("\n🧪 TEST MODE - Would post tweet with media:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📝 Text:", text);
        console.log("🖼️  Image:", imagePath);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        return {
          data: {
            id: "test-mode-" + Date.now(),
            text: text,
          },
          testMode: true,
        };
      }

      console.log("🐦 Posting tweet with media...");

      // Upload media first
      const mediaId = await this.uploadMedia(imagePath);

      // Post tweet with media
      const tweet = await this.client.v2.tweet({
        text: text,
        media: {
          media_ids: [mediaId],
        },
      });

      console.log("✅ Tweet posted successfully with media:", tweet.data.id);
      return tweet;
    } catch (error) {
      console.error("❌ Error posting tweet with media:", error.message);
      throw error;
    }
  }

  // Post text-only tweet
  async postTweet(text) {
    try {
      if (this.testMode) {
        console.log("\n🧪 TEST MODE - Would post text-only tweet:");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📝 Text:", text);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
        return {
          data: {
            id: "test-mode-" + Date.now(),
            text: text,
          },
          testMode: true,
        };
      }

      console.log("🐦 Posting text-only tweet...");

      const tweet = await this.client.v2.tweet({
        text: text,
      });

      console.log("✅ Tweet posted successfully:", tweet.data.id);
      return tweet;
    } catch (error) {
      console.error("❌ Error posting tweet:", error.message);
      throw error;
    }
  }

  // Post tweet with fallback logic
  async postTweetWithFallback(text, imagePath = null) {
    try {
      if (imagePath) {
        // Try posting with media first
        return await this.postTweetWithMedia(text, imagePath);
      } else {
        // Post text-only
        return await this.postTweet(text);
      }
    } catch (error) {
      console.error("❌ Primary posting method failed:", error.message);

      if (imagePath) {
        // Fallback to text-only if media upload failed
        console.log("🔄 Attempting fallback to text-only post...");
        try {
          return await this.postTweet(text);
        } catch (fallbackError) {
          console.error("❌ Fallback also failed:", fallbackError.message);
          throw fallbackError;
        }
      }

      throw error;
    }
  }

  // Validate tweet text
  validateTweetText(text) {
    if (!text || typeof text !== "string") {
      return {
        valid: false,
        error: "Tweet text is required and must be a string",
      };
    }

    if (text.trim().length === 0) {
      return { valid: false, error: "Tweet text cannot be empty" };
    }

    const maxLength = this.isVerified ? 10000 : config.content.maxTweetLength; // Verified accounts have higher limits

    if (text.length > maxLength) {
      return {
        valid: false,
        error: `Tweet text exceeds ${maxLength} characters (current: ${text.length})`,
      };
    }

    return { valid: true };
  }

  // Get user information
  async getUserInfo() {
    try {
      console.log("👤 Getting user information...");
      const user = await this.client.v2.me();
      console.log("✅ User info retrieved:", user.data.username);
      return user;
    } catch (error) {
      console.error("❌ Error getting user info:", error.message);
      throw error;
    }
  }

  // Check rate limits
  async checkRateLimits() {
    try {
      console.log("📊 Checking rate limits...");
      const rateLimits = await this.client.v2.rateLimits();
      console.log("✅ Rate limits retrieved");
      return rateLimits;
    } catch (error) {
      console.error("❌ Error checking rate limits:", error.message);
      throw error;
    }
  }

  // Get recent tweets
  async getRecentTweets(count = 5) {
    try {
      console.log("📜 Getting recent tweets...");
      const user = await this.getUserInfo();
      const tweets = await this.client.v2.userTimeline(user.data.id, {
        max_results: Math.min(count, 100),
        "tweet.fields": ["created_at", "public_metrics"],
      });

      console.log(
        `✅ Retrieved ${tweets.data.data?.length || 0} recent tweets`
      );
      return tweets;
    } catch (error) {
      console.error("❌ Error getting recent tweets:", error.message);
      throw error;
    }
  }

  // Delete a tweet (for cleanup purposes)
  async deleteTweet(tweetId) {
    try {
      console.log(`🗑️ Deleting tweet: ${tweetId}`);
      const response = await this.client.v2.deleteTweet(tweetId);
      console.log("✅ Tweet deleted successfully");
      return response;
    } catch (error) {
      console.error("❌ Error deleting tweet:", error.message);
      throw error;
    }
  }

  // Test Twitter connection
  async testConnection() {
    try {
      console.log("🔌 Testing Twitter connection...");
      const user = await this.getUserInfo();
      console.log(
        `✅ Twitter connection successful. Logged in as: @${user.data.username}`
      );
      return true;
    } catch (error) {
      console.error("❌ Twitter connection failed:", error.message);
      return false;
    }
  }
}

export default TwitterManager;
