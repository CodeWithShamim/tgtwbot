// Content Generation Module for Zama Twitter Automation - Using xAI Grok
import { config } from "../../config/config.js";

class ContentGenerator {
  constructor() {
    // Validate xAI API configuration
    if (!config.grok.apiKey) {
      throw new Error(
        "XAI_API_KEY is required. Please set it in your environment variables."
      );
    }

    this.grokConfig = config.grok;

    // Influencer-style content templates focused only on Zama
    this.contentTemplates = [
      // Developer opportunity with Zama
      {
        type: "developer",
        prompt: `
Write a casual, engaging article-style post for developers about the exciting opportunities @zama is creating for building privacy-first applications. Make it sound like a real developer sharing their excitement about new tech.

Format requirements:
- Write in a conversational, human-like tone (like a dev blog post)
- Use double line breaks (\n\n) between paragraphs for readability
- Include @zama exactly once in the article
- Make it feel authentic and genuinely enthusiastic
- Use some developer slang/jargon naturally
- Focus on the "wow factor" of what's now possible

Content structure:
- Start with a relatable developer pain point about privacy limitations
- Share the excitement about @zama's recent Series A funding and fhEVM launch
- Explain what kinds of apps you can now build that were impossible before
- Talk about confidential smart contracts in practical terms
- End with an encouraging call to action for fellow devs

Background: @zama just raised in Series B funding and launched the world's first fhEVM mainnet beta. They provide FHEVM libraries for Solidity developers to build confidential smart contracts with end-to-end encryption. Their $ZAMA token manages fees and staking, testnet is live now, with Ethereum mainnet coming Q4 2025. The protocol processes 20+ TPS today, targeting 500-1000 TPS with GPUs, and 100,000+ TPS with FHE ASICs. This enables confidential DeFi, tokenized real-world assets, sealed-bid auctions, and private governance while maintaining public verifiability.
        `,
      },
      // Tech Innovation & Zama's breakthrough
      {
        type: "innovation",
        prompt: `
Write an exciting, human-like article-style post about @zama's game-changing breakthrough in blockchain privacy technology. Make it sound like someone who's genuinely amazed by this innovation.

Format requirements:
- Write in an enthusiastic, "mind-blown" tone (like discovering something incredible)
- Use double line breaks (\n\n) between paragraphs for readability
- Include @zama exactly once in the article
- Make it feel like you're sharing a "holy grail" moment in crypto
- Use natural excitement and wonder
- Focus on why this changes everything we thought was possible

Content structure:
- Start with a "can you believe this?" hook about privacy problems
- Share the excitement about @zama's fhEVM launch and major partnerships
- Explain why FHE is like magic for blockchain privacy
- Talk about real-world use cases that become possible
- End with thoughts about how this reshapes blockchain's future

Background: @zama's breakthrough protocol enables true end-to-end encryption on public blockchains using Fully Homomorphic Encryption. Their fhEVM maintains composability while keeping transaction inputs and state completely private from node operators. With $73M in Series B funding, testnet live, and mainnet coming January 2026, they're solving blockchain's confidentiality dilemma. The technology supports confidential DeFi, sealed-bid auctions, private governance, and tokenized real-world assets while maintaining public verifiability and 128-bit post-quantum security.
        `,
      },

      // Privacy focus with Zama solution
      {
        type: "privacy",
        prompt: `
Write a relatable, human-like article-style post about blockchain privacy problems and how @zama is finally solving them. Make it sound like someone who's been frustrated with lack of privacy and found the solution.

Format requirements:
- Write in a "finally, someone gets it" tone
- Use double line breaks (\n\n) between paragraphs for readability
- Include @zama exactly once in the article
- Make it relatable to anyone who's felt exposed on blockchain
- Use conversational, slightly passionate language about privacy
- Focus on the relief and excitement of having real privacy

Content structure:
- Start with personal frustration about blockchain transparency
- Explain why "everything public" is actually dangerous
- Share the excitement about @zama's privacy-preserving breakthrough
- Talk about what confidential transactions mean for regular users
- End with why this matters for the future of crypto adoption

Background: Most blockchains expose everything publicly - a fundamental flaw that prevents mainstream adoption. @zama's protocol solves this with end-to-end encryption using FHE, so node operators never see your data while maintaining public verifiability. With testnet live and mainnet coming Q4 2025, they enable confidential payments, private governance, sealed-bid auctions, and tokenized real-world assets. Their $ZAMA token handles fees and staking, while the protocol targets 100,000+ TPS with FHE ASICs. This is the privacy solution blockchain has needed.
        `,
      },

      // DeFi transformation with Zama
      {
        type: "defi",
        prompt: `
Write an exciting, insider-style article-style post about how @zama is completely transforming DeFi with privacy. Make it sound like a DeFi native who's seen the problems firsthand and is excited about the solution.

Format requirements:
- Write in an enthusiastic "DeFi insider" tone (like sharing alpha with the community)
- Use double line breaks (\n\n) between paragraphs for readability
- Include @zama exactly once in the article
- Use natural DeFi terminology but explain it accessibly
- Make it feel like sharing game-changing information
- Focus on the "this is what we've been waiting for" vibe

Content structure:
- Start with relatable DeFi frustration about front-running and privacy issues
- Get excited about @zama's recent DEX integration and partnerships
- Explain how private DeFi changes everything for traders and protocols
- Talk about specific benefits like confidential trading and private yield farming
- End with why this brings institutions and mainstream adoption to DeFi

Background: DeFi is crippled by front-running, MEV, and complete transparency that scares away institutions and traders. @zama's confidential DeFi solves this with end-to-end encryption - your trades, positions, and strategies stay private while remaining publicly verifiable. Their protocol enables confidential trading, sealed-bid auctions, private lending, and anonymous yield farming. With $73M in funding and mainnet coming Q4 2025, this is DeFi's privacy breakthrough for institutional adoption and protecting regular users from predatory MEV.
        `,
      },

      // Future vision with Zama
      {
        type: "vision",
        prompt: `
Write an inspiring, forward-looking article-style post about how @zama is creating the future of blockchain with privacy. Make it sound like someone who's genuinely optimistic about where this technology is heading.

Format requirements:
- Write in an inspiring, "future is here" tone
- Use double line breaks (\n\n) between paragraphs for readability
- Include @zama exactly once in the article
- Make it feel like you're witnessing a historical moment
- Use visionary language but keep it grounded and exciting
- Focus on the transformative potential of what's coming

Content structure:
- Start with the realization that current blockchain transparency isn't sustainable
- Share excitement about @zama's momentum (funding, partnerships, fhEVM launch)
- Paint a picture of what blockchain becomes with privacy as the default
- Talk about the massive adoption this enables (institutions, regular people)
- End with why this is just the beginning of the privacy revolution

Background: We're witnessing blockchain's privacy revolution with @zama's end-to-end encryption protocol. After raising $73M in Series B, they've launched testnet and have mainnet coming Q4 2025. Their fhEVM maintains composability while keeping all transaction data private from node operators, enabling confidential DeFi, private governance, sealed-bid auctions, and tokenized real-world assets. With $ZAMA token for fees/staking and a roadmap targeting 100,000+ TPS, they're making confidentiality the standard for blockchain's next evolution toward mainstream adoption.
        `,
      },
    ];
  }

  // Generate influencer-style content using xAI Grok (Cost-effective)
  async generateContent(template = null) {
    try {
      // Select a random template if none provided
      const selectedTemplate =
        template ||
        this.contentTemplates[
          Math.floor(Math.random() * this.contentTemplates.length)
        ];

      console.log(
        `🤖 Generating ${selectedTemplate.type} content with Grok...`
      );

      // Make request to xAI Grok API
      const response = await fetch(`https://api.x.ai/v1/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.grokConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: this.grokConfig.model,
          messages: [
            {
              role: "system",
              content:
                "You are writing article-style Twitter content for a blockchain privacy focus. Create short articles with proper paragraph breaks using double newlines (\\n\\n) between paragraphs. Write naturally but informatively, include 'Zama' and include @zama mention exactly once per article, and structure articles with clear opening, body, and conclusion. Focus on being educational yet engaging with comprehensive details.",
            },
            {
              role: "user",
              content: selectedTemplate.prompt,
            },
          ],
          temperature: this.grokConfig.temperature,
          max_tokens: this.grokConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `xAI API error: ${response.status} - ${
            errorData.error?.message || response.statusText
          }`
        );
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error("No content generated from Grok API");
      }

      console.log(
        `✅ Generated ${
          selectedTemplate.type
        } content with Grok: ${content.substring(0, 100)}...`
      );
      return {
        content,
        type: selectedTemplate.type,
        model: this.grokConfig.model,
      };
    } catch (error) {
      console.error("❌ Error generating content with Grok:", error.message);

      // Provide helpful error message for common issues
      if (error.message.includes("401")) {
        console.error("💡 Check your XAI_API_KEY in the .env file");
      } else if (error.message.includes("429")) {
        console.error("💡 Rate limit reached. Please wait and try again.");
      }

      throw error;
    }
  }

  // Normalize and limit text for Twitter
  normalizeText(text) {
    if (config.twitter.isVerified) {
      return text; // Verified accounts have higher character limits
    }

    if (!text) return "";

    let normalized = text
      .replace(/\r\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    // Remove extra spaces
    normalized = normalized.replace(/[ \t]{2,}/g, " ");

    // Check length
    if (normalized.length <= config.content.maxTweetLength) {
      return normalized;
    }

    // Try to cut at sentence boundary
    const cut = normalized.slice(0, config.content.maxTweetLength);
    const lastPunct = cut.lastIndexOf(". ");

    if (lastPunct > 50) {
      return cut.slice(0, lastPunct + 1).trimEnd();
    }

    return cut.trimEnd();
  }

  // Get content by type
  async getContentByType(type) {
    const template = this.contentTemplates.find((t) => t.type === type);
    if (!template) {
      throw new Error(`Content type '${type}' not found`);
    }

    return await this.generateContent(template);
  }

  // Get random content
  async getRandomContent() {
    return await this.generateContent();
  }

  // Get all available content types
  getContentTypes() {
    return this.contentTemplates.map((t) => t.type);
  }

  // Validate content
  validateContent(content) {
    if (!content || typeof content !== "string") {
      return {
        valid: false,
        error: "Content is required and must be a string",
      };
    }

    if (content.length === 0) {
      return { valid: false, error: "Content cannot be empty" };
    }

    if (
      content.length > config.content.maxTweetLength &&
      !config.twitter.isVerified
    ) {
      return {
        valid: false,
        error: `Content exceeds ${config.content.maxTweetLength} characters`,
      };
    }

    return { valid: true };
  }
}

export default ContentGenerator;
