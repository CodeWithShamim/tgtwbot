// Configuration management for Zama Twitter Bot
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  // Twitter API Configuration
  twitter: {
    appKey: process.env.TWITTER_APP_KEY,
    appSecret: process.env.TWITTER_APP_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
    isVerified: process.env.TWITTER_VERIFIED === 'true' || true,
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
    postsPerDay: 5,
    postingHours: [9, 12, 15, 18, 21],
    randomDelayMinutes: 20,
    // Zama-focused configuration
    twitterHandle: "@zama",
    brandName: "Zama",
  },

  // Bot Configuration
  bot: {
    name: "Zama",
    version: "2.0.0",
    logLevel: "info",
  },

  // Zama-specific search terms for image fetching
  zamaSearchTerms: [
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
  ],

  // Image sources configuration
  imageSources: {
    pexels: {
      enabled: true,
      images: [
        "https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cyber security
        "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Blockchain technology
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Cryptocurrency
        "https://images.pexels.com/photos/844124/pexels-photo-844124.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Code security
        "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Technology data
        "https://images.pexels.com/photos/1108571/pexels-photo-1108571.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Network security
        "https://images.pexels.com/photos/3861972/pexels-photo-3861972.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", // Digital security
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
    'TWITTER_APP_KEY',
    'TWITTER_APP_SECRET',
    'TWITTER_ACCESS_TOKEN',
    'TWITTER_ACCESS_SECRET',
    'XAI_API_KEY' // Using xAI Grok instead of OpenAI for cost efficiency
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  return true;
}

export default config;