// safeBot.js - Optimized for Zama
import { TwitterApi } from "twitter-api-v2";
import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";

import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import https from "https";
import crypto from "crypto";

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

// // ==== Image cache and online fetching ====
const DOWNLOADED_IMAGES_DIR = "downloaded_images";
const MAX_CACHED_IMAGES = 20;
const usedImages = new Set();

// Ensure downloaded images directory exists
if (!fs.existsSync(DOWNLOADED_IMAGES_DIR)) {
  fs.mkdirSync(DOWNLOADED_IMAGES_DIR, { recursive: true });
}

// Download image from URL with proper headers
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);

    const options = {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    };

    https
      .get(url, options, (response) => {
        // Check if response is successful
        if (response.statusCode !== 200) {
          reject(new Error(`Failed to download image: ${response.statusCode}`));
          return;
        }

        response.pipe(file);
        file.on("finish", () => {
          file.close();
          resolve(filepath);
        });
      })
      .on("error", (err) => {
        fs.unlink(filepath, () => {}); // Delete partial file
        reject(err);
      });
  });
}

// Zama-related image search terms
const zamaSearchTerms = [
  "blockchain cryptography privacy security",
  "homomorphic encryption technology data protection",
  "secure data computation cloud privacy",
  "blockchain confidentiality anonymous transactions",
  "zero knowledge proof cryptography",
  "encrypted smart contracts defi privacy",
  "FHE fully homomorphic encryption",
  "private blockchain transactions security",
  "secure decentralized finance privacy",
  "quantum computing cryptography security",
  "cryptographic algorithms mathematical security",
  "data encryption cybersecurity privacy",
  "privacy technology blockchain security",
  "secure computation cloud encryption",
  "cryptographic protocols data protection",
];

// Search and download Zama-related image from multiple sources
async function searchAndDownloadZamaImage() {
  const searchTerm =
    zamaSearchTerms[Math.floor(Math.random() * zamaSearchTerms.length)];
  console.log(`Searching for image with term: ${searchTerm}`);

  const methods = [
    { name: "Pexels", func: downloadFromPexels },
    { name: "Pixabay", func: downloadFromPixabay },
    { name: "Lorem Picsum", func: downloadFromLoremPicsum },
    { name: "Unsplash", func: downloadFromUnsplash },
  ];

  for (const method of methods) {
    try {
      console.log(`🔄 Trying ${method.name}...`);
      const imagePath = await method.func(searchTerm);
      return imagePath;
    } catch (error) {
      console.log(`❌ ${method.name} failed: ${error.message}`);
      continue;
    }
  }

  throw new Error("All image sources failed");
}

// Download from Pexels (with variety)
async function downloadFromPexels(searchTerm) {
  const pexelsImages = [
    "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cyber security
    "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Blockchain technology
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cryptocurrency
    "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Code security
    "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Technology data
    "https://images.pexels.com/photos/1108571/pexels-photo-1108571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Network security
    "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Digital security
  ];

  const randomImage =
    pexelsImages[Math.floor(Math.random() * pexelsImages.length)];
  const filename = `zama_pexels_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}.jpg`;
  const filepath = path.join(DOWNLOADED_IMAGES_DIR, filename);

  console.log(`Downloading from Pexels: ${randomImage}`);
  await downloadImage(randomImage, filepath);

  const stats = fs.statSync(filepath);
  if (stats.size < 5000) {
    fs.unlinkSync(filepath);
    throw new Error("Pexels download too small");
  }

  console.log(`✅ Pexels success: ${filename} (${stats.size} bytes)`);
  return filepath;
}

// Download from Pixabay (with variety)
async function downloadFromPixabay(searchTerm) {
  const pixabayImages = [
    "https://cdn.pixabay.com/photo/2018/05/14/14/39/cyber-security-3400649_1280.jpg", // Cyber security
    "https://cdn.pixabay.com/photo/2017/08/07/15/18/blockchain-2607229_1280.jpg", // Blockchain
    "https://cdn.pixabay.com/photo/2016/11/19/15/40/cryptography-1839751_1280.jpg", // Cryptography
    "https://cdn.pixabay.com/photo/2018/02/04/17/39/blockchain-3130166_1280.jpg", // Blockchain technology
    "https://cdn.pixabay.com/photo/2018/09/12/12/17/bitcoin-3671287_1280.jpg", // Cryptocurrency
    "https://cdn.pixabay.com/photo/2017/01/25/11/44/cyber-2008269_1280.jpg", // Network security
    "https://cdn.pixabay.com/photo/2018/05/08/08/26/blockchain-3383807_1280.jpg", // Blockchain network
  ];

  const randomImage =
    pixabayImages[Math.floor(Math.random() * pixabayImages.length)];
  const filename = `zama_pixabay_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}.jpg`;
  const filepath = path.join(DOWNLOADED_IMAGES_DIR, filename);

  console.log(`Downloading from Pixabay: ${randomImage}`);
  await downloadImage(randomImage, filepath);

  const stats = fs.statSync(filepath);
  if (stats.size < 5000) {
    fs.unlinkSync(filepath);
    throw new Error("Pixabay download too small");
  }

  console.log(`✅ Pixabay success: ${filename} (${stats.size} bytes)`);
  return filepath;
}

// Download from Lorem Picsum
async function downloadFromLoremPicsum(searchTerm) {
  const loremUrl = `https://picsum.photos/1200/630?random=${Math.floor(
    Math.random() * 1000
  )}`;

  const filename = `zama_lorem_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}.jpg`;
  const filepath = path.join(DOWNLOADED_IMAGES_DIR, filename);

  console.log(`Downloading from Lorem Picsum: ${loremUrl}`);
  await downloadImage(loremUrl, filepath);

  const stats = fs.statSync(filepath);
  if (stats.size < 5000) {
    fs.unlinkSync(filepath);
    throw new Error("Lorem Picsum download too small");
  }

  console.log(`✅ Lorem Picsum success: ${filename} (${stats.size} bytes)`);
  return filepath;
}

// Download from Unsplash (last resort)
async function downloadFromUnsplash(searchTerm) {
  const unsplashUrl = `https://source.unsplash.com/1200x630/?${encodeURIComponent(
    searchTerm
  )}&sig=${crypto.randomBytes(8).toString("hex")}`;

  const filename = `zama_unsplash_${Date.now()}_${crypto
    .randomBytes(4)
    .toString("hex")}.jpg`;
  const filepath = path.join(DOWNLOADED_IMAGES_DIR, filename);

  console.log(`Downloading from Unsplash: ${unsplashUrl}`);
  await downloadImage(unsplashUrl, filepath);

  const stats = fs.statSync(filepath);
  if (stats.size < 5000) {
    fs.unlinkSync(filepath);
    throw new Error("Unsplash download too small");
  }

  console.log(`✅ Unsplash success: ${filename} (${stats.size} bytes)`);
  return filepath;
}

// Clean up old cached images to manage storage
function cleanupOldImages() {
  try {
    const cachedFiles = fs
      .readdirSync(DOWNLOADED_IMAGES_DIR)
      .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
      .map((f) => ({
        name: f,
        path: path.join(DOWNLOADED_IMAGES_DIR, f),
        time: fs.statSync(path.join(DOWNLOADED_IMAGES_DIR, f)).mtime,
      }))
      .sort((a, b) => b.time - a.time);

    // Keep only the most recent MAX_CACHED_IMAGES files
    if (cachedFiles.length > MAX_CACHED_IMAGES) {
      const filesToDelete = cachedFiles.slice(MAX_CACHED_IMAGES);
      filesToDelete.forEach((file) => {
        fs.unlinkSync(file.path);
        console.log(`🗑️ Cleaned up old image: ${file.name}`);
      });
    }
  } catch (error) {
    console.error("⚠️ Error cleaning up old images:", error.message);
  }
}

// Get Zama-related image (download new if needed)
async function getZamaImage() {
  // Clean up old images first
  cleanupOldImages();

  try {
    // Download a fresh image for each post
    const imagePath = await searchAndDownloadZamaImage();
    return imagePath;
  } catch (error) {
    console.error("❌ Failed to download new image, checking cache...");

    // Fallback to cached images if any exist
    try {
      const cachedFiles = fs
        .readdirSync(DOWNLOADED_IMAGES_DIR)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

      if (cachedFiles.length > 0) {
        const randomImage =
          cachedFiles[Math.floor(Math.random() * cachedFiles.length)];
        const imagePath = path.join(DOWNLOADED_IMAGES_DIR, randomImage);
        console.log(`📎 Using cached image: ${randomImage}`);
        return imagePath;
      }
    } catch (cacheError) {
      console.error("❌ No cached images available");
    }

    // Final fallback - create a simple placeholder
    console.log("⚠️ Creating fallback image...");
    return await createFallbackImage();
  }
}

// Create a simple fallback image
async function createFallbackImage() {
  // For now, we'll return null and let the bot post without an image
  // In a production environment, you might want to create a branded placeholder
  console.log("🚫 No image available, will post text only");
  return null;
}

// message generate by openAI
async function generateHumanContent(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini-2024-07-18", // human-like responses, fast
      messages: [{ role: "user", content: prompt }],
      temperature: 0.85, // adds natural creativity
      max_tokens: 200, // allow longer, richer responses
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
async function postTweet(promptCap, promptType = "zama") {
  console.log("🔄 Starting tweet generation process...");

  const tweet = await generateHumanContent(promptCap);
  if (!tweet) {
    console.log("❌ No tweet content generated");
    return;
  }

  try {
    const tweetText = normalizeAndLimit(tweet);
    console.log("📝 Generated tweet text:", tweetText);

    // Get Zama-related image dynamically
    console.log("🖼️ Fetching Zama-related image...");
    const imagePath = await getZamaImage();

    if (imagePath) {
      console.log("📎 Using image:", imagePath);

      try {
        // Read and upload media
        const mediaData = fs.readFileSync(imagePath);

        const mediaResponse = await twitterClient.v2.uploadMedia(mediaData, {
          media_category: "tweet_image",
        });

        // Check media key
        if (!mediaResponse) {
          console.error("❌ Media upload failed - no response");
          throw new Error("Media upload failed");
        }

        console.log("📤 Media uploaded successfully:", mediaResponse);

        await twitterClient.v2.tweet({
          text: tweetText,
          media: {
            media_ids: [mediaResponse],
          },
        });
        console.log("✅ Posted with image:", tweetText);
      } catch (mediaErr) {
        console.error("❌ Error with media upload:", mediaErr.message);
        // Fallback to text-only post
        await twitterClient.v2.tweet({
          text: tweetText,
        });
        console.log("✅ Posted (text fallback):", tweetText);
      }
    } else {
      console.log("📝 No image available, posting text only...");
      await twitterClient.v2.tweet({
        text: tweetText,
      });
      console.log("✅ Posted (text only):", tweetText);
    }
  } catch (err) {
    console.error("❌ Error posting tweet:", err.message);
    // Final fallback attempt
    try {
      await twitterClient.v2.tweet({
        text: tweetText,
      });
      console.log("✅ Emergency post successful:", tweetText);
    } catch (textErr) {
      console.error("❌ All posting attempts failed:", textErr.message);
    }
  }
}

// === Safe scheduler: Multiple Zama-focused prompts ===
function schedulePosts() {
  // Multiple Zama-focused prompts for variety
  const zamaPrompts = [
    // Privacy & Confidentiality focus
    `
Write a natural, educational post about blockchain privacy and confidentiality.

Focus on how Zama is solving the transparency problem in blockchain with their innovative approach.

Do not use any title or headings. Write in a conversational, thoughtful tone.

Requirements:
- No emojis, no hashtags, no bullet points
- Use natural line breaks for readability
- Sound like a privacy advocate sharing insights
- Mention how confidentiality is becoming essential in DeFi
- Reference Zama's mission without being promotional

Background: Zama brings confidentiality to DeFi using Fully Homomorphic Encryption (FHE), keeping onchain data encrypted even during processing.
`,

    // Technology & Innovation focus
    `
Share a technical insight about Fully Homomorphic Encryption (FHE) and blockchain.

Write as if you're explaining an exciting technological development to someone interested in crypto innovation.

Requirements:
- No emojis, no hashtags, no bullet points
- Use clear, accessible language
- Include natural line breaks
- Sound genuinely enthusiastic about the technology
- Focus on the innovation aspect of FHE
- Keep it concise and engaging

Background: Zama's FHE technology enables confidential smart contracts on any L1/L2, currently processing 20+ tps with potential for 10,000+ tps.
`,

    // DeFi & Applications focus
    `
Write about the future of private DeFi and confidential transactions.

Focus on why privacy matters in decentralized finance and how new technologies are making it possible.

Requirements:
- No emojis, no hashtags, no bullet points
- Write in a reflective, forward-looking tone
- Use natural line breaks for readability
- Sound like someone who understands DeFi deeply
- Focus on the practical benefits of confidential DeFi

Background: Zama enables confidential DeFi, payments, and tokens with zero-knowledge privacy and public verifiability through FHE.
`,

    // Community & Development focus
    `
Share thoughts about open-source development in the crypto privacy space.

Write about the importance of community-driven privacy solutions and developer-friendly tools.

Requirements:
- No emojis, no hashtags, no bullet points
- Sound like a developer or community member
- Use natural line breaks
- Be authentic and thoughtful
- Focus on the open-source aspect
- Keep it concise

Background: Zama is an open-source cryptography company with a developer-focused approach, building practical FHE solutions since 2018.
`,

    // Industry impact focus
    `
Write about the growing importance of privacy solutions in the blockchain industry.

Focus on how confidentiality is becoming a competitive advantage for blockchain projects.

Requirements:
- No emojis, no hashtags, no bullet points
- Sound like an industry observer
- Use natural line breaks
- Be insightful but accessible
- Focus on industry trends

Background: Zama's testnet is live with mainnet coming Q4 2024, showing the industry is moving toward privacy-focused solutions.
`,

    // Educational focus
    `
Explain a simple concept about blockchain privacy that more people should understand.

Write as if you're teaching someone something new and important about crypto.

Requirements:
- No emojis, no hashtags, no bullet points
- Use simple, clear language
- Include natural line breaks
- Sound educational but not condescending
- Focus on one key concept
- Keep it accessible

Background: Many people don't realize that blockchain transparency can be a security risk - companies like Zama are working to fix this with encryption.
`,
  ];

  const hours = [9, 12, 15, 18, 21]; // 5 posts per day

  hours.forEach((hour, index) => {
    // Add random delay (0–20 min) to look human
    const delay = Math.floor(Math.random() * 20);
    const now = new Date();
    const target = new Date();

    target.setHours(hour, delay, 0, 0);
    if (target < now) target.setDate(target.getDate() + 1);

    const msUntilPost = target - now;
    const selectedPrompt = zamaPrompts[index % zamaPrompts.length];

    setTimeout(function run() {
      postTweet(selectedPrompt, "zama");
      setTimeout(run, 24 * 60 * 60 * 1000); // repeat daily
    }, msUntilPost);
  });
}

schedulePosts();
console.log(
  "Zama bot started / posts 5 times daily with professional timing and image variety."
);
