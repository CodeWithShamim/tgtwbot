// safeBot.js
import { TwitterApi } from "twitter-api-v2";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";

dotenv.config();

const TWITTERVERIED = true;

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
// const tgClient = new TelegramClient(stringSession, apiId, apiHash, {
//   connectionRetries: 5,
// });

// // ==== Duplicate message tracking ====
// const postedMessages = new Set();
// const RATE_LIMIT_MS = 15000; // 15 seconds between posts

// message generate by openAI
async function generateHumanContent(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // human-like responses, fast
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85, // adds natural creativity
      presence_penalty: 0.6, // encourages new ideas
      frequency_penalty: 0.4, // reduces repetition
      max_tokens: 400, // allow longer, richer responses
    });

    return response.choices[0].message.content.trim();
  } catch (err) {
    console.error("Error generating human content:", err);
  }
}

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
async function postTweet(promptCap, promptType = "news") {
  const tweet = await generateHumanContent(promptCap);
  if (!tweet) return;

  try {
    const tweetText = normalizeAndLimit(tweet);
    console.log("Found tweet text:-----", tweetText);

    const mediaIds = [
      "public/image.png",
      "public/image1.png",
      "public/image3.jpeg",
      "public/image4.jpg",
      "public/image5.jpg",
      "public/6.jpg",
      "public/7.webp",
      "public/8.webp",
      "public/9.png",
      "public/10.jpg",
      "public/11.jpg",
      "public/12.png",
      "public/13.jpeg",
      "public/14.png",
      "public/15.jpg",
      "public/16.jpg",
      "public/17.jpg",
      "public/18.jpeg",
    ];

    function getRandomMediaId() {
      return mediaIds[Math.floor(Math.random() * mediaIds.length)];
    }

    const syncFS = promptType == "custom" ? getRandomMediaId() : "image.png";

    const mediaData = fs.readFileSync(syncFS);

    const mediaResponse = await twitterClient.v2.uploadMedia(mediaData, {
      media_category: "tweet_image",
    });

    // check media key
    if (!mediaResponse) {
      console.error("❌ Media upload failed", mediaResponse);
      return;
    }

    // console.log({ mediaResponse });

    await twitterClient.v2.tweet({
      text: tweetText,
      media: {
        media_ids: [mediaResponse],
      },
    });
    console.log("✅ Posted:", tweetText);
  } catch (err) {
    console.error("❌ Error posting tweet:", err);
  }
}

// === Safe scheduler: 5 random posts/day ===
function schedulePosts() {
  // const promptForKite = ` Write a natural, human-like tweet thread about @GoKiteAI.
  //       It should article type , don't use "—" it , don't use "in the rapidly, with no title or headings.

  //       Use knowledge from https://gokite.ai/ but do not include or share the link in the output.

  //       Requirements:
  //       - Always tag @GoKiteAI just one time.
  //       - Keep the tone professional, informative, always unique post and concise.
  //       - Use proper punctuation, spacing, and line breaks for readability.
  //       - Do not use emojis.
  //       - Avoid generic or AI-generated sounding phrases.
  //       `;

  const openingStyles = [
    "Ask a thought-provoking question.",
    "Begin with a vivid image or metaphor.",
    "Start with a bold statement.",
    "Open with a personal reflection or universal truth.",
    "Use a poetic or philosophical sentence to draw attention.",
  ];

  const promptForKite = ` ${
    openingStyles[Math.floor(Math.random() * openingStyles.length)]
  } Write a natural, human-like tweet thread about @GoKiteAI.

            Your writing should embody the spirit of the "Wind Runner" initiative — authentic, insightful, and human. 
            Avoid sounding like marketing or AI-generated content. Write with the tone of a genuine creator who contributes meaningfully to the Kite AI ecosystem.

            Draw inspiration from the "Kite AI: Wind Runner" philosophy:
            - It honors creators who help build community culture through original, high-quality ideas.
            - It values authenticity, creativity, long-term thinking, and human originality over volume or self-promotion.
            - It celebrates those who shape the wind — not chase it — by pushing the boundaries of thought in AI, reputation, and agentic systems.

            Guidelines:
            - Mention @GoKiteAI exactly once.
            - Do NOT use any "—" characters, emojis, hashtags, or links.
            - Avoid phrases like "in a" or “in the rapidly changing world” or “revolutionizing the future.”
            - Focus on one strong, clear idea that connects with Kite AI’s vision — such as agentic payments, authentic creation, community culture, trustless collaboration, or reputation systems.
            - Use professional, reflective, and poetic tone — a balance between intellect and emotion.
            - Keep it concise but meaningful, with natural line breaks between thoughts.
            - Every output must feel original, as if written by a thinker, not an algorithm.

            The goal: create a daily thread that feels like a contribution to the Wind Runner movement — a spark of insight that helps Kite AI soar higher.
            `;

  const hours = [9, 11, 16, 18, 21, 22];

  // postTweet(promptForKite, "custom");

  hours.forEach((hour) => {
    // add random delay (0–20 min) to look human
    const delay = Math.floor(Math.random() * 20);
    const now = new Date();
    const target = new Date();

    target.setHours(hour, delay, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);

    const msUntilPost = target - now;
    setTimeout(function run() {
      postTweet(promptForKite, "custom");
      setTimeout(run, 24 * 60 * 60 * 1000); // repeat daily
    }, msUntilPost);
  });
}

schedulePosts();
console.log("Bot started / posts 6 times daily with safe timing.");

// --------------------------------------------------------------------------------

// ==== Main Telegram Listener ====
// (async () => {
//   console.log("Connecting to Telegram...");
//   await tgClient.start({
//     phoneNumber: async () => await input.text("Enter your Telegram number: "),
//     password: async () => await input.text("Enter password: "),
//     phoneCode: async () => await input.text("Enter code: "),
//     onError: (err) => console.log(err),
//   });

//   console.log("✅ Telegram connected");
//   // tgClient.session.save();
//   console.log(tgClient.session.save());
//   const entitiy = process.env.ENTITY;

//   const channel = await tgClient.getEntity(
//     `@${entitiy ? entitiy : "tgtwitterbts"}`
//   );
//   // const channel = await tgClient.getEntity("@tgtwitterbts");

//   let lastPostTime = 0;

//   // captureMessageScreenshot("NEW LISIING FEED");

//   tgClient.addEventHandler(async (update) => {
//     try {
//       if (
//         update.message &&
//         update.message.peerId?.channelId?.equals(channel.id)
//       ) {
//         const text = update.message.message;

//         // Skip duplicates
//         if (postedMessages.has(text)) return;
//         postedMessages.add(text);

//         // Rate limiting
//         const now = Date.now();
//         if (now - lastPostTime < RATE_LIMIT_MS) return;
//         lastPostTime = now;

//         console.log("New Telegram message detected:", text);

//         // Capture screenshot
//         // const screenshot = await captureMessageScreenshot(text);
//         // if (!screenshot) return;

//         // // Upload to Twitter
//         // const mediaId = await twitterClient.v1.uploadMedia(screenshot, {
//         //   type: "png",
//         // });

//         // // add
//         // console.log({ mediaId });

//         // await twitterClient.v1.tweet(text, { media_ids: mediaId });
//         // Generate human-like content
//         const promptForNews = `
//         Rewrite the following text as a natural, don't use "we have a" text, human-like tweet that is engaging, readable, and professional.
//         - Do NOT use emojis.
//         - must be Use proper punctuation, spacing, and line breaks for readability.
//         - Include relevant hashtags.
//         - Make sure the text is 280 characters or less.
//         - Avoid making it look AI-generated.

//         Original text: "${text}"
//         `;

//         postTweet(promptForNews);
//       }
//     } catch (err) {
//       console.error("Error posting:", err);
//     }
//   });
// })();
