// Image Management Module for Zama Twitter Bot
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import https from 'https';
import { config } from '../../config/config.js';

class ImageManager {
  constructor() {
    this.downloadDir = config.images.downloadDir;
    this.maxCachedImages = config.images.maxCachedImages;
    this.minFileSize = config.images.minFileSize;
    this.usedImages = new Set();

    this.ensureDownloadDir();
  }

  // Ensure download directory exists
  ensureDownloadDir() {
    if (!fs.existsSync(this.downloadDir)) {
      fs.mkdirSync(this.downloadDir, { recursive: true });
      console.log(`✅ Created download directory: ${this.downloadDir}`);
    }
  }

  // Download image from URL with proper headers
  async downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(filepath);

      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      };

      https
        .get(url, options, (response) => {
          if (response.statusCode !== 200) {
            reject(new Error(`Failed to download image: ${response.statusCode}`));
            return;
          }

          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve(filepath);
          });
        })
        .on('error', (err) => {
          fs.unlink(filepath, () => {}); // Delete partial file
          reject(err);
        });
    });
  }

  // Download from Pexels
  async downloadFromPexels() {
    const { pexels } = config.imageSources;
    if (!pexels.enabled || pexels.images.length === 0) {
      throw new Error('Pexels source not available');
    }

    const randomImage = pexels.images[Math.floor(Math.random() * pexels.images.length)];
    const filename = `zama_pexels_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.jpg`;
    const filepath = path.join(this.downloadDir, filename);

    console.log(`📸 Downloading from Pexels: ${path.basename(randomImage)}`);
    await this.downloadImage(randomImage, filepath);

    this.validateImage(filepath);
    console.log(`✅ Pexels success: ${filename}`);
    return filepath;
  }

  // Download from Pixabay
  async downloadFromPixabay() {
    const { pixabay } = config.imageSources;
    if (!pixabay.enabled || pixabay.images.length === 0) {
      throw new Error('Pixabay source not available');
    }

    const randomImage = pixabay.images[Math.floor(Math.random() * pixabay.images.length)];
    const filename = `zama_pixabay_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.jpg`;
    const filepath = path.join(this.downloadDir, filename);

    console.log(`📸 Downloading from Pixabay: ${path.basename(randomImage)}`);
    await this.downloadImage(randomImage, filepath);

    this.validateImage(filepath);
    console.log(`✅ Pixabay success: ${filename}`);
    return filepath;
  }

  // Download from Lorem Picsum
  async downloadFromLoremPicsum() {
    const { loremPicsum } = config.imageSources;
    if (!loremPicsum.enabled) {
      throw new Error('Lorem Picsum source not available');
    }

    const randomId = Math.floor(Math.random() * 1000);
    const { width, height } = config.images.dimensions;
    const loremUrl = `${loremPicsum.baseUrl}/${width}/${height}?random=${randomId}`;

    const filename = `zama_lorem_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.jpg`;
    const filepath = path.join(this.downloadDir, filename);

    console.log(`📸 Downloading from Lorem Picsum: ${randomId}`);
    await this.downloadImage(loremUrl, filepath);

    this.validateImage(filepath);
    console.log(`✅ Lorem Picsum success: ${filename}`);
    return filepath;
  }

  // Download from Unsplash
  async downloadFromUnsplash() {
    const { unsplash } = config.imageSources;
    if (!unsplash.enabled) {
      throw new Error('Unsplash source not available');
    }

    const searchTerm = config.zamaSearchTerms[Math.floor(Math.random() * config.zamaSearchTerms.length)];
    const { width, height } = config.images.dimensions;
    const unsplashUrl = `${unsplash.baseUrl}/${width}x${height}/?${encodeURIComponent(searchTerm)}&sig=${crypto.randomBytes(8).toString('hex')}`;

    const filename = `zama_unsplash_${Date.now()}_${crypto.randomBytes(4).toString('hex')}.jpg`;
    const filepath = path.join(this.downloadDir, filename);

    console.log(`📸 Downloading from Unsplash with term: ${searchTerm}`);
    await this.downloadImage(unsplashUrl, filepath);

    this.validateImage(filepath);
    console.log(`✅ Unsplash success: ${filename}`);
    return filepath;
  }

  // Validate downloaded image
  validateImage(filepath) {
    const stats = fs.statSync(filepath);
    if (stats.size < this.minFileSize) {
      fs.unlinkSync(filepath);
      throw new Error(`Downloaded file too small: ${stats.size} bytes`);
    }
    return stats;
  }

  // Clean up old cached images
  cleanupOldImages() {
    try {
      const cachedFiles = fs
        .readdirSync(this.downloadDir)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .map((f) => ({
          name: f,
          path: path.join(this.downloadDir, f),
          time: fs.statSync(path.join(this.downloadDir, f)).mtime,
        }))
        .sort((a, b) => b.time - a.time);

      if (cachedFiles.length > this.maxCachedImages) {
        const filesToDelete = cachedFiles.slice(this.maxCachedImages);
        filesToDelete.forEach((file) => {
          fs.unlinkSync(file.path);
          console.log(`🗑️ Cleaned up old image: ${file.name}`);
        });
      }
    } catch (error) {
      console.error('⚠️ Error cleaning up old images:', error.message);
    }
  }

  // Get cached image if available
  getCachedImage() {
    try {
      const cachedFiles = fs
        .readdirSync(this.downloadDir)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

      if (cachedFiles.length > 0) {
        const randomImage = cachedFiles[Math.floor(Math.random() * cachedFiles.length)];
        const imagePath = path.join(this.downloadDir, randomImage);
        console.log(`📎 Using cached image: ${randomImage}`);
        return imagePath;
      }
    } catch (error) {
      console.error('❌ Error accessing cached images:', error.message);
    }
    return null;
  }

  // Main method to get Zama-related image
  async getZamaImage() {
    this.cleanupOldImages();

    const downloadMethods = [
      { name: 'Pexels', func: () => this.downloadFromPexels() },
      { name: 'Pixabay', func: () => this.downloadFromPixabay() },
      { name: 'Lorem Picsum', func: () => this.downloadFromLoremPicsum() },
      { name: 'Unsplash', func: () => this.downloadFromUnsplash() },
    ];

    // Try to download a fresh image
    for (const method of downloadMethods) {
      try {
        console.log(`🔄 Trying ${method.name}...`);
        const imagePath = await method.func();
        return imagePath;
      } catch (error) {
        console.log(`❌ ${method.name} failed: ${error.message}`);
        continue;
      }
    }

    // Fallback to cached images
    console.error('❌ Failed to download new image, checking cache...');
    const cachedImage = this.getCachedImage();
    if (cachedImage) {
      return cachedImage;
    }

    // No image available
    console.log('🚫 No image available, will post text only');
    return null;
  }

  // Get cached images count
  getCachedImagesCount() {
    try {
      return fs
        .readdirSync(this.downloadDir)
        .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
        .length;
    } catch {
      return 0;
    }
  }

  // Get image file info
  getImageInfo(filepath) {
    if (!filepath || !fs.existsSync(filepath)) {
      return null;
    }

    try {
      const stats = fs.statSync(filepath);
      return {
        path: filepath,
        name: path.basename(filepath),
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
      };
    } catch (error) {
      console.error('❌ Error getting image info:', error.message);
      return null;
    }
  }
}

export default ImageManager;