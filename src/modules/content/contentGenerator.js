// Content Generation Module for Zama Twitter Automation - Using xAI Grok
import { config } from '../../config/config.js';

class ContentGenerator {
  constructor() {
    // Validate xAI API configuration
    if (!config.grok.apiKey) {
      throw new Error('XAI_API_KEY is required. Please set it in your environment variables.');
    }

    this.grokConfig = config.grok;

    // Influencer-style content templates focused only on Zama
    this.contentTemplates = [
      // Tech Innovation & Zama's breakthrough
      {
        type: 'innovation',
        prompt: `
Write an article-style post about @zama's breakthrough in blockchain privacy and encryption technology.

Format requirements:
- Write as a short article with proper line breaks between paragraphs
- No title or headings, just the article content
- Use double line breaks (\n\n) between paragraphs for readability
- Keep conversational but informative tone
- Include @zama exactly once in the article
- Make it feel like an educational but engaging article
- Write comprehensive, detailed articles (no character limit)

Content structure:
- Opening hook about blockchain privacy challenges
- Introduction to @zama's solution
- Key benefits of their technology
- Brief conclusion about the future

Background: @zama is revolutionizing blockchain with Fully Homomorphic Encryption (FHE), allowing encrypted data to be processed without ever being decrypted. This enables confidential smart contracts, private DeFi, and secure transactions on any blockchain while maintaining verifiability.
        `,
      },

      // Privacy focus with Zama solution
      {
        type: 'privacy',
        prompt: `
Write an article-style post about blockchain privacy challenges and how @zama is providing the solution.

Format requirements:
- Write as a short article with proper line breaks between paragraphs
- No title or headings, just the article content
- Use double line breaks (\n\n) between paragraphs for readability
- Write with authority but make it accessible to readers
- Include @zama exactly once in the article
- Make it educational about privacy importance
- Write comprehensive, detailed articles (no character limit)

Content structure:
- Start with the privacy problem in current blockchains
- Explain why transparency can be a security risk
- Introduce @zama's privacy-preserving solution
- Briefly explain the benefits of confidential transactions
- Conclude with thoughts on privacy's importance

Background: Most blockchains expose everything publicly - a fundamental privacy flaw. @zama uses FHE to keep all transactions and smart contracts completely private while still being verifiable. This enables confidential DeFi, private trading, and enterprise adoption where privacy is critical.
        `,
      },

      // DeFi transformation with Zama
      {
        type: 'defi',
        prompt: `
Write an article-style post about how @zama is transforming DeFi with privacy technology.

Format requirements:
- Write as a short article with proper line breaks between paragraphs
- No title or headings, just the article content
- Use double line breaks (\n\n) between paragraphs for readability
- Use appropriate DeFi terminology but keep it accessible
- Include @zama exactly once in the article
- Sound knowledgeable about current DeFi limitations
- Write comprehensive, detailed articles (no character limit)

Content structure:
- Start with current DeFi privacy challenges
- Explain why privacy is preventing mainstream adoption
- Introduce @zama's solution for private DeFi
- Mention specific benefits (private trading, lending, yield farming)
- Brief conclusion about DeFi's future with privacy

Background: DeFi can't go mainstream without privacy. @zama's FHE technology enables confidential trading, private lending, and anonymous yield farming - everything users want but can't get on public blockchains. This unlocks institutional adoption and protects user privacy while maintaining transparency where needed.
        `,
      },

      // Developer opportunity with Zama
      {
        type: 'developer',
        prompt: `
Write an article-style post for developers about the opportunities @zama is creating for building privacy-first applications.

Format requirements:
- Write as a short article with proper line breaks between paragraphs
- No title or headings, just the article content
- Use double line breaks (\n\n) between paragraphs for readability
- Write for fellow developers with appropriate terminology
- Include @zama exactly once in the article
- Make it technical but accessible to all devs
- Write comprehensive, detailed articles (no character limit)

Content structure:
- Start with current limitations in blockchain development
- Introduce @zama's FHE libraries for developers
- Explain what kind of applications become possible
- Mention the benefits of confidential smart contracts
- Brief call to action for developer community

Background: @zama provides FHE libraries that let developers build confidential smart contracts on any blockchain. This opens up entirely new categories of privacy-first applications that were impossible before, including confidential DeFi protocols, private NFT marketplaces, and enterprise blockchain solutions.
        `,
      },

      // Future vision with Zama
      {
        type: 'vision',
        prompt: `
Write an article-style post about how @zama is shaping the future of blockchain technology and privacy.

Format requirements:
- Write as a short article with proper line breaks between paragraphs
- No title or headings, just the article content
- Use double line breaks (\n\n) between paragraphs for readability
- Write with visionary but grounded perspective
- Include @zama exactly once in the article
- Sound knowledgeable about blockchain's trajectory
- Write comprehensive, detailed articles (no character limit)

Content structure:
- Start with current state of blockchain transparency
- Explain why privacy is becoming essential
- Introduce @zama's role in the privacy revolution
- Paint a picture of the privacy-first blockchain future
- Brief conclusion about this technological evolution

Background: @zama is not just solving privacy - they're enabling the next evolution of blockchain where confidentiality is the standard. Their FHE technology will power private enterprise blockchains, confidential DeFi protocols, and secure Web3 applications that were previously impossible due to transparency constraints.
        `,
      },
    ];
  }

  // Generate influencer-style content using xAI Grok (Cost-effective)
  async generateContent(template = null) {
    try {
      // Select a random template if none provided
      const selectedTemplate = template || this.contentTemplates[Math.floor(Math.random() * this.contentTemplates.length)];

      console.log(`🤖 Generating ${selectedTemplate.type} content with Grok...`);

      // Make request to xAI Grok API
      const response = await fetch(`https://api.x.ai/v1/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.grokConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.grokConfig.model,
          messages: [
            {
              role: 'system',
              content: 'You are writing article-style Twitter content for a blockchain privacy focus. Create short articles with proper paragraph breaks using double newlines (\\n\\n) between paragraphs. Write naturally but informatively, include @zama mention exactly once per article, and structure articles with clear opening, body, and conclusion. Focus on being educational yet engaging with comprehensive details.'
            },
            {
              role: 'user',
              content: selectedTemplate.prompt
            }
          ],
          temperature: this.grokConfig.temperature,
          max_tokens: this.grokConfig.maxTokens,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`xAI API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content?.trim();

      if (!content) {
        throw new Error('No content generated from Grok API');
      }

      console.log(`✅ Generated ${selectedTemplate.type} content with Grok: ${content.substring(0, 100)}...`);
      return {
        content,
        type: selectedTemplate.type,
        model: this.grokConfig.model,
      };

    } catch (error) {
      console.error('❌ Error generating content with Grok:', error.message);

      // Provide helpful error message for common issues
      if (error.message.includes('401')) {
        console.error('💡 Check your XAI_API_KEY in the .env file');
      } else if (error.message.includes('429')) {
        console.error('💡 Rate limit reached. Please wait and try again.');
      }

      throw error;
    }
  }

  // Normalize and limit text for Twitter
  normalizeText(text) {
    if (config.twitter.isVerified) {
      return text; // Verified accounts have higher character limits
    }

    if (!text) return '';

    let normalized = text
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();

    // Remove extra spaces
    normalized = normalized.replace(/[ \t]{2,}/g, ' ');

    // Check length
    if (normalized.length <= config.content.maxTweetLength) {
      return normalized;
    }

    // Try to cut at sentence boundary
    const cut = normalized.slice(0, config.content.maxTweetLength);
    const lastPunct = cut.lastIndexOf('. ');

    if (lastPunct > 50) {
      return cut.slice(0, lastPunct + 1).trimEnd();
    }

    return cut.trimEnd();
  }

  // Get content by type
  async getContentByType(type) {
    const template = this.contentTemplates.find(t => t.type === type);
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
    return this.contentTemplates.map(t => t.type);
  }

  // Validate content
  validateContent(content) {
    if (!content || typeof content !== 'string') {
      return { valid: false, error: 'Content is required and must be a string' };
    }

    if (content.length === 0) {
      return { valid: false, error: 'Content cannot be empty' };
    }

    if (content.length > config.content.maxTweetLength && !config.twitter.isVerified) {
      return {
        valid: false,
        error: `Content exceeds ${config.content.maxTweetLength} characters`
      };
    }

    return { valid: true };
  }
}

export default ContentGenerator;