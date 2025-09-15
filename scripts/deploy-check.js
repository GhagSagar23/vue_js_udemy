const fs = require('fs');
const path = require('path');

class DeploymentChecker {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  checkFileExists(filePath, required = true) {
    const exists = fs.existsSync(filePath);
    if (!exists) {
      if (required) {
        this.errors.push(`Missing required file: ${filePath}`);
      } else {
        this.warnings.push(`Missing optional file: ${filePath}`);
      }
    }
    return exists;
  }

  checkHtmlStructure(filePath) {
    if (!this.checkFileExists(filePath)) return;

    const content = fs.readFileSync(filePath, 'utf8');

    // Check for DOCTYPE
    if (!content.includes('<!DOCTYPE html>')) {
      this.errors.push(`${filePath}: Missing DOCTYPE declaration`);
    }

    // Check for meta viewport
    if (!content.includes('viewport')) {
      this.warnings.push(`${filePath}: Missing viewport meta tag`);
    }

    // Check for title
    if (!content.includes('<title>')) {
      this.errors.push(`${filePath}: Missing title tag`);
    }
  }

  checkImageOptimization() {
    const imagesDir = path.join(__dirname, '..', 'assets', 'images');
    if (!fs.existsSync(imagesDir)) {
      this.warnings.push('No images directory found');
      return;
    }

    const files = fs.readdirSync(imagesDir);
    files.forEach(file => {
      const filePath = path.join(imagesDir, file);
      const stats = fs.statSync(filePath);
      const sizeInMB = stats.size / (1024 * 1024);

      if (sizeInMB > 5) {
        this.warnings.push(`Large image file: ${file} (${sizeInMB.toFixed(2)}MB)`);
      }
    });
  }

  run() {
    console.log('🔍 Running deployment checks...\n');

    // Check essential files
    this.checkFileExists('index.html');
    this.checkFileExists('README.md');
    this.checkFileExists('.gitignore', false);

    // Check HTML structure
    this.checkHtmlStructure('index.html');

    // Check for common issues
    this.checkImageOptimization();

    // Check module structure
    const modulesDir = path.join(__dirname, '..', 'modules');
    if (fs.existsSync(modulesDir)) {
      const modules = fs.readdirSync(modulesDir);
      modules.forEach(module => {
        const moduleReadme = path.join(modulesDir, module, 'README.md');
        this.checkFileExists(moduleReadme, false);
      });
    }

    // Report results
    console.log('\n📊 Deployment Check Results:');

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('✅ All checks passed! Ready for deployment.');
    } else {
      if (this.errors.length > 0) {
        console.log(`\n❌ Errors (${this.errors.length}):`);
        this.errors.forEach(error => console.log(`   - ${error}`));
      }

      if (this.warnings.length > 0) {
        console.log(`\n⚠️  Warnings (${this.warnings.length}):`);
        this.warnings.forEach(warning => console.log(`   - ${warning}`));
      }

      if (this.errors.length > 0) {
        console.log('\n❌ Deployment not recommended. Fix errors first.');
        process.exit(1);
      } else {
        console.log('\n⚠️  Deployment possible with warnings.');
      }
    }
  }
}

// Run checks
const checker = new DeploymentChecker();
checker.run();