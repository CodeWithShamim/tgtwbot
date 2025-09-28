// safeBot.js
import { TwitterApi } from "twitter-api-v2";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import input from "input";
import puppeteer from "puppeteer";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const TWITTERVERIED = false;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// message generate by openAI
async function generateHumanContent(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // human-like responses, fast
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8, // makes it more creative
      max_tokens: 150,
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Error generating human content:", err);
  }
}

// ==== Puppeteer screenshot function (cropped) ====
// async function captureMessageScreenshot(messageText) {
//   const browser = await puppeteer.launch({
//     headless: true,
//     args: [
//       "--no-sandbox",
//       "--disable-setuid-sandbox",
//       "--disable-dev-shm-usage",
//       "--disable-accelerated-2d-canvas",
//       "--no-first-run",
//       "--no-zygote",
//       "--single-process",
//       "--disable-gpu",
//     ],
//   });
//   const page = await browser.newPage();

//   await page.goto("https://web.telegram.org/k/", { waitUntil: "networkidle2" });
//   console.log("Log in manually if needed within 15s...");
//   // await page.waitForTimeout(15000); // 15 seconds
//   await new Promise((r) => setTimeout(r, 15000));

//   await page.waitForSelector(".message");

//   const [messageElement] = await page.$x(
//     `//div[contains(@class,'message') and contains(text(),'${messageText}')]`
//   );

//   if (!messageElement) {
//     console.log("Message not found for screenshot");
//     await browser.close();
//     return null;
//   }

//   // Crop screenshot to just the message content
//   const box = await messageElement.boundingBox();
//   const screenshotBuffer = await page.screenshot({
//     clip: { x: box.x, y: box.y, width: box.width, height: box.height },
//   });

//   await browser.close();
//   return screenshotBuffer;
// }

// --------------------------------------------------------------------------------
function normalizeAndLimit(text) {
  if (TWITTERVERIED) return text;

  if (!text) return "";
  let t = text
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  t = t.replace(/[ \t]{2,}/g, " ");
  if (t.length <= 280) return t;
  // try to cut at sentence boundary, fallback safe truncation
  const cut = t.slice(0, 280);
  const lastPunct = cut.lastIndexOf(". ");
  return (lastPunct > 50 ? cut.slice(0, lastPunct + 1) : cut).trimEnd();
}

// === Post to Twitter safely ===
async function postTweet(promptCap) {
  const tweet = await generateHumanContent(promptCap);
  if (!tweet) return;

  try {
    const tweetText = normalizeAndLimit(tweet);
    console.log("Found tweet text:-----", tweetText);
    await twitterClient.v2.tweet({
      text: tweetText,
    });
    console.log("✅ Posted:", tweetText);
  } catch (err) {
    console.error("❌ Error posting tweet:", err);
  }
}

// === Safe scheduler: 5 random posts/day ===
function schedulePosts() {
  const promptForKite = ` Write a natural, human-like tweet thread about @GoKiteAI.  
        It should read like a short article-style post (longer than a single tweet), with no title or headings.  

        Use knowledge from https://gokite.ai/ but do not include or share the link in the output.  

        Requirements:  
        - Always tag @GoKiteAI.  
        - Keep the tone professional, informative, and concise.  
        - Use proper punctuation, spacing, and line breaks for readability.  
        - Do not use emojis.  
        - Avoid generic or AI-generated sounding phrases.    
        `;

  const hours = [9, 13, 17, 21, 1]; // base hours
  hours.forEach((hour) => {
    // add random delay (0–20 min) to look human
    const delay = Math.floor(Math.random() * 20);
    const now = new Date();
    const target = new Date();

    target.setHours(hour, delay, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);

    const msUntilPost = target - now;
    setTimeout(function run() {
      postTweet(promptForKite);
      setTimeout(run, 24 * 60 * 60 * 1000); // repeat daily
    }, msUntilPost);
  });
}

schedulePosts();
console.log("Bot started / posts 5 times daily with safe timing.");

// --------------------------------------------------------------------------------

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
  // tgClient.session.save();
  console.log(tgClient.session.save());
  const entitiy = process.env.ENTITY;

  const channel = await tgClient.getEntity(
    `@${entitiy ? entitiy : "tgtwitterbts"}`
  );
  // const channel = await tgClient.getEntity("@tgtwitterbts");

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
        // Generate human-like content
        const promptForNews = `
        Rewrite the following text as a natural, human-like tweet that is engaging, readable, and professional. 
        - Do NOT use emojis. 
        - must be Use proper punctuation, spacing, and line breaks for readability.
        - Include relevant hashtags.
        - Make sure the text is 280 characters or less.
        - Avoid making it look AI-generated.

        Original text: "${text}"
        `;

        postTweet(promptForNews);
      }
    } catch (err) {
      console.error("Error posting:", err);
    }
  });
})();
