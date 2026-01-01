// Configuration management for Multi-Project Twitter Bot
import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Twitter API Configuration
  twitter: {
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
    isVerified: process.env.TWITTER_VERIFIED === "true" || true,
  },

  // xAI Grok Configuration (Cost-effective alternative to OpenAI)
  grok: {
    apiKey: process.env.XAI_API_KEY,
    model: "grok-2-latest", // Best model for influencer-style writing, cost-effective
    temperature: 0.85, // High creativity for human-like content
    maxTokens: 250, // Optimized for Twitter length, cost-efficient
    baseUrl: "https://api.x.ai/v1", // xAI API endpoint
  },

  // Image Configuration
  images: {
    downloadDir: "downloaded_images",
    maxCachedImages: 20,
    minFileSize: 5000, // 5KB minimum
    dimensions: {
      width: 1200,
      height: 630,
    },
  },

  // Content Configuration
  content: {
    maxTweetLength: 280,
    postsPerDay: 3,
    postingHours: [13, 20, 1], // 9 AM, 3 PM, 9 PM
    randomDelayMinutes: 20,
  },

  // Bot Configuration
  bot: {
    name: "MultiProjectTwitterBot",
    version: "3.0.0",
    logLevel: "info",
    testMode: process.env.TEST_MODE === "true" || false, // When true, don't actually post to Twitter
  },

  // Project configurations
  projects: [
    {
      name: "Arcium",
      twitterHandle: "@Arcium",
      website: "https://www.arcium.com",
      description: "The encrypted supercomputer.",
      searchTerms: [
        "encrypted computing technology",
        "secure cloud computing infrastructure",
        "data privacy cloud security",
        "cryptographic computation network",
        "secure data processing technology",
        "privacy-preserving computation",
        "encrypted cloud infrastructure",
        "secure computation protocols",
        "data protection technology",
        "cryptography cloud services",
      ],
      images: [
        "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://cdn.pixabay.com/photo/2018/05/14/14/39/cyber-security-3400649_1280.jpg",
        "https://cdn.pixabay.com/photo/2016/11/19/15/40/cryptography-1839751_1280.jpg",
      ],
    },
    {
      name: "Polymarket",
      twitterHandle: "@Polymarket",
      website: "https://polymarket.com",
      description:
        "The World's Largest Prediction Market. Trade politics, news, culture, sports & tech.",
      searchTerms: [
        "prediction market trading platform",
        "blockchain betting derivatives",
        "decentralized prediction markets",
        "crypto trading analytics",
        "politics prediction trading",
        "sports betting blockchain",
        "financial forecasting tools",
        "market prediction platforms",
        "trading data visualization",
        "derivatives trading crypto",
      ],
      images: [
        "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/4808267/pexels-photo-4808267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://cdn.pixabay.com/photo/2019/09/03/14/34/bitcoin-4451346_1280.jpg",
        "https://cdn.pixabay.com/photo/2021/10/19/10/56/bitcoin-6726298_1280.png",
      ],
    },
    {
      name: "Base",
      twitterHandle: "@base",
      website: "https://www.base.org/",
      description:
        "A global economy built by all of us. Built on Ethereum, built on the Superchain. Base is beginning to explore a network token.",
      searchTerms: [
        "ethereum layer 2 blockchain",
        "base network crypto",
        "decentralized finance infrastructure",
        "superchain ecosystem",
        "ethereum scaling solutions",
        "defi trading platform",
        "blockchain technology network",
        "crypto global economy",
        "web3 infrastructure development",
        "ethereum ecosystem growth",
      ],
      images: [
        "https://images.pexels.com/photos/8369835/pexels-photo-8369835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/30885763/pexels-photo-30885763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        "https://cdn.pixabay.com/photo/2017/08/07/15/18/blockchain-2607229_1280.jpg",
        "https://cdn.pixabay.com/photo/2018/05/08/08/26/blockchain-3383807_1280.jpg",
      ],
    },
  ],

  // Image sources configuration (generic tech/blockchain images)
  imageSources: {
    pexels: {
      enabled: true,
      images: [
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cyber security
        "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Blockchain technology
        "https://images.pexels.com/photos/4808267/pexels-photo-4808267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cryptocurrency
        "https://images.pexels.com/photos/8369835/pexels-photo-8369835.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Code security
        "https://images.pexels.com/photos/30885763/pexels-photo-30885763.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Technology data
        "https://images.pexels.com/photos/1148820/pexels-photo-1148820.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Network security
        "https://images.pexels.com/photos/577585/pexels-photo-577585.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Digital security
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Data analytics
        "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cryptocurrency charts
        "https://images.pexels.com/photos/6804082/pexels-photo-6804082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Digital finance
      ],
    },
    pixabay: {
      enabled: true,
      images: [
        "https://cdn.pixabay.com/photo/2018/05/14/14/39/cyber-security-3400649_1280.jpg", // Cyber security
        "https://cdn.pixabay.com/photo/2017/08/07/15/18/blockchain-2607229_1280.jpg", // Blockchain
        "https://cdn.pixabay.com/photo/2016/11/19/15/40/cryptography-1839751_1280.jpg", // Cryptography
        "https://cdn.pixabay.com/photo/2018/02/04/17/39/blockchain-3130166_1280.jpg", // Blockchain technology
        "https://cdn.pixabay.com/photo/2018/09/12/12/17/bitcoin-3671287_1280.jpg", // Cryptocurrency
        "https://cdn.pixabay.com/photo/2017/01/25/11/44/cyber-2008269_1280.jpg", // Network security
        "https://cdn.pixabay.com/photo/2018/05/08/08/26/blockchain-3383807_1280.jpg", // Blockchain network
        "https://cdn.pixabay.com/photo/2021/10/19/10/56/bitcoin-6726298_1280.png", // Crypto trading
        "https://cdn.pixabay.com/photo/2022/04/13/12/24/crypto-7130777_1280.png", // Digital finance
        "https://cdn.pixabay.com/photo/2019/09/03/14/34/bitcoin-4451346_1280.jpg", // Bitcoin
      ],
    },
    loremPicsum: {
      enabled: true,
      baseUrl: "https://picsum.photos",
    },
    unsplash: {
      enabled: true,
      baseUrl: "https://source.unsplash.com",
    },
  },
};

// Validate required environment variables
export function validateConfig() {
  const required = [
    "TWITTER_APP_KEY",
    "TWITTER_APP_SECRET",
    "TWITTER_ACCESS_TOKEN",
    "TWITTER_ACCESS_SECRET",
    "XAI_API_KEY", // Using xAI Grok instead of OpenAI for cost efficiency
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  return true;
}

export default config;
