// safeBot.js
import { TwitterApi } from "twitter-api-v2";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
dotenv.config();

// ==== Twitter API ====
const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY,
  appSecret: process.env.TWITTER_APP_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// ==== Telegram API ====
const apiId = parseInt(process.env.TG_API_ID);
const apiHash = process.env.TG_API_HASH;
const stringSession = new StringSession(process.env.TG_SESSION || "");
const tgClient = new TelegramClient(stringSession, apiId, apiHash, {
  connectionRetries: 5,
});

// ==== Duplicate message tracking ====
const postedMessages = new Set();
const RATE_LIMIT_MS = 15000; // 15 seconds between posts

// ==== Puppeteer screenshot function (cropped) ====
async function captureMessageScreenshot(messageText) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://web.telegram.org/k/", { waitUntil: "networkidle2" });
  console.log("Log in manually if needed within 15s...");
  // await page.waitForTimeout(15000); // 15 seconds
  await new Promise((r) => setTimeout(r, 15000));

  await page.waitForSelector(".message");

  const [messageElement] = await page.$x(
    `//div[contains(@class,'message') and contains(text(),'${messageText}')]`
  );

  if (!messageElement) {
    console.log("Message not found for screenshot");
    await browser.close();
    return null;
  }

  // Crop screenshot to just the message content
  const box = await messageElement.boundingBox();
  const screenshotBuffer = await page.screenshot({
    clip: { x: box.x, y: box.y, width: box.width, height: box.height },
  });

  await browser.close();
  return screenshotBuffer;
}

// ==== Main Telegram Listener ====
(async () => {
  console.log("Connecting to Telegram...");
  await tgClient.start({
    phoneNumber: async () => await input.text("Enter your Telegram number: "),
    password: async () => await input.text("Enter password: "),
    phoneCode: async () => await input.text("Enter code: "),
    onError: (err) => console.log(err),
  });

  console.log("✅ Telegram connected");
  console.log("Session string:", tgClient.session.save());

  const channel = await tgClient.getEntity("@NewListingsFeed");

  let lastPostTime = 0;

  // captureMessageScreenshot("NEW LISIING FEED");

  tgClient.addEventHandler(async (update) => {
    try {
      if (
        update.message &&
        update.message.peerId?.channelId?.equals(channel.id)
      ) {
        const text = update.message.message;

        // Skip duplicates
        if (postedMessages.has(text)) return;
        postedMessages.add(text);

        // Rate limiting
        const now = Date.now();
        if (now - lastPostTime < RATE_LIMIT_MS) return;
        lastPostTime = now;

        console.log("New Telegram message detected:", text);

        // Capture screenshot
        // const screenshot = await captureMessageScreenshot(text);
        // if (!screenshot) return;

        // // Upload to Twitter
        // const mediaId = await twitterClient.v1.uploadMedia(screenshot, {
        //   type: "png",
        // });

        // // add
        // console.log({ mediaId });

        // await twitterClient.v1.tweet(text, { media_ids: mediaId });
        await twitterClient.v2.tweet(text);

        console.log("✅ Posted to Twitter safely (text + image)");
      }
    } catch (err) {
      console.error("Error posting:", err);
    }
  });
})();
