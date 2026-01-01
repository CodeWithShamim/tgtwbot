// Content Generation Module for Multi-Project Twitter Bot - Using xAI Grok
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
    this.projects = config.projects;
    this.currentProjectIndex = 0;

    console.log(`✅ ContentGenerator initialized with ${this.projects.length} projects`);
  }

  // Get current project to post about
  getCurrentProject() {
    const project = this.projects[this.currentProjectIndex];
    // Move to next project for the next post
    this.currentProjectIndex = (this.currentProjectIndex + 1) % this.projects.length;
    return project;
  }

  // Generate content for a specific project
  async generateContent(project = null) {
    try {
      // Use provided project or get current project in rotation
      const selectedProject = project || this.getCurrentProject();

      console.log(
        `🤖 Generating content for ${selectedProject.name} (${selectedProject.twitterHandle})...`
      );

      // Create project-specific prompt
      const prompt = this.createProjectPrompt(selectedProject);

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
                "You are writing article-style Twitter content for crypto and blockchain projects. Create short articles with proper paragraph breaks using double newlines (\\n\\n) between paragraphs. Write naturally but informatively, include the project mention exactly once per article, and structure articles with clear opening, body, and conclusion. Focus on being educational yet engaging with comprehensive details.",
            },
            {
              role: "user",
              content: prompt,
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
        `✅ Generated ${selectedProject.name} content: ${content.substring(0, 100)}...`
      );
      return {
        content,
        project: selectedProject.name,
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

  // Create project-specific prompt
  createProjectPrompt(project) {
    const basePrompt = `
Write an engaging, authentic article-style post about ${project.name}. Make it sound like a genuine enthusiast sharing their excitement.

Format requirements:
- Write in a conversational, human-like tone
- Use double line breaks (\\n\\n) between paragraphs for readability
- Include ${project.twitterHandle} exactly once in the article
- Make it feel authentic and genuinely enthusiastic
- Focus on the value and innovation this project brings

Background: ${project.description}

Website: ${project.website}
`;

    // Add project-specific context
    let projectContext = "";

    switch (project.name) {
      case "Arcium":
        projectContext = `
Focus on:
- The power of encrypted computing and secure cloud infrastructure
- How Arcium is revolutionizing data privacy and computation
- The potential for privacy-preserving technology to transform industries
- The importance of secure data processing in today's digital world
        `;
        break;

      case "Polymarket":
        projectContext = `
Focus on:
- The excitement of prediction markets and trading on real-world events
- How Polymarket enables people to trade on politics, news, sports, and culture
- The power of decentralized forecasting and market sentiment
- The innovative approach to predicting future outcomes
        `;
        break;

      case "Base":
        projectContext = `
Focus on:
- Base's mission to build a global economy on Ethereum
- The Superchain ecosystem and Layer 2 scaling solutions
- How Base is enabling mainstream adoption of blockchain technology
- The growing community and developer ecosystem around Base
        `;
        break;

      default:
        projectContext = `
Focus on:
- What makes this project unique and innovative
- The problems it's solving in the crypto/blockchain space
- Why people should be excited about its potential
- The future possibilities this project enables
        `;
    }

    return basePrompt + projectContext;
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

  // Get content by project name
  async getContentByProject(projectName) {
    const project = this.projects.find((p) =>
      p.name.toLowerCase() === projectName.toLowerCase()
    );

    if (!project) {
      throw new Error(`Project '${projectName}' not found`);
    }

    return await this.generateContent(project);
  }

  // Get random content (uses rotation)
  async getRandomContent() {
    return await this.generateContent();
  }

  // Get all available projects
  getProjects() {
    return this.projects.map((p) => p.name);
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
