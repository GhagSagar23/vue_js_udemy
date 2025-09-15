const fs = require('fs');
const path = require('path');

class ProgressTracker {
  constructor() {
    this.modules = [
      { name: 'HTML Fundamentals', topics: 12 },
      { name: 'CSS Styling & Design', topics: 15 },
      { name: 'JavaScript Fundamentals', topics: 9 },
      { name: 'JavaScript DOM', topics: 12 }
    ];
  }

  countCompletedTopics(content) {
    // Ensure content is a string
    if (typeof content !== 'string') {
      console.warn('Warning: content is not a string, converting...');
      content = String(content || '');
    }

    const completed = (content.match(/✅/g) || []).length;
    const total = (content.match(/[⬜✅]/g) || []).length;
    return { completed, total };
  }

  updateProgressBadges(content, percentage) {
    // Ensure content is a string
    if (typeof content !== 'string') {
      content = String(content || '');
    }

    const color = this.getProgressColor(percentage);

    // Update progress badges with color
    content = content.replace(
      /Progress-\d+%-\w+/g,
      `Progress-${percentage}%-${color}`
    );

    // Also update simple progress badges
    content = content.replace(
      /Progress-\d+%/g,
      `Progress-${percentage}%`
    );

    return content;
  }

  getProgressColor(percentage) {
    if (percentage === 0) return 'red';
    if (percentage < 25) return 'orange';
    if (percentage < 50) return 'yellow';
    if (percentage < 75) return 'yellowgreen';
    if (percentage < 100) return 'green';
    return 'brightgreen';
  }

  updateREADME() {
    const readmePath = path.join(__dirname, '..', 'README.md');

    if (!fs.existsSync(readmePath)) {
      console.error('❌ README.md not found');
      return { completed: 0, total: 0, percentage: 0 };
    }

    let content = fs.readFileSync(readmePath, 'utf8');

    const progress = this.countCompletedTopics(content);
    const percentage = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;

    content = this.updateProgressBadges(content, percentage);

    fs.writeFileSync(readmePath, content);

    console.log(`✅ Updated README.md - ${progress.completed}/${progress.total} topics completed (${percentage}%)`);

    return { completed: progress.completed, total: progress.total, percentage };
  }

  updateIndexHTML(progress) {
    const indexPath = path.join(__dirname, '..', 'index.html');

    if (!fs.existsSync(indexPath)) {
      console.warn('⚠️  index.html not found, skipping HTML update');
      return;
    }

    let content = fs.readFileSync(indexPath, 'utf8');

    // Update overall progress text
    content = content.replace(
      /<div class="progress-text">\d+%<\/div>/g,
      `<div class="progress-text">${progress.percentage}%</div>`
    );

    // Update progress circle background
    const angle = progress.percentage * 3.6;
    content = content.replace(
      /conic-gradient\([^)]+\)/g,
      `conic-gradient(#4CAF50 0deg ${angle}deg, #e0e0e0 ${angle}deg 360deg)`
    );

    // Update module progress bars (if they exist)
    const modules = content.match(/<div class="progress-fill" style="width: \d+%"><\/div>/g);
    if (modules && modules.length >= 4) {
      // Calculate individual module progress (simplified - you can enhance this)
      const moduleProgress = Math.floor(progress.percentage / 4);
      content = content.replace(
        /<div class="progress-fill" style="width: \d+%"><\/div>/g,
        `<div class="progress-fill" style="width: ${moduleProgress}%"></div>`
      );
    }

    fs.writeFileSync(indexPath, content);

    console.log(`✅ Updated index.html with ${progress.percentage}% progress`);
  }

  generateProgressReport() {
    const readmePath = path.join(__dirname, '..', 'README.md');

    if (!fs.existsSync(readmePath)) {
      console.error('❌ README.md not found, skipping progress report');
      return;
    }

    const content = fs.readFileSync(readmePath, 'utf8');

    let report = "# 📊 Course Progress Report\n\n";
    report += `**Generated:** ${new Date().toISOString().split('T')[0]}\n\n`;

    // Overall progress
    const overall = this.countCompletedTopics(content);
    const overallPercentage = overall.total > 0 ? Math.round((overall.completed / overall.total) * 100) : 0;

    report += `## 🎯 Overall Progress: ${overallPercentage}%\n\n`;
    report += `- **Completed Topics:** ${overall.completed}\n`;
    report += `- **Total Topics:** ${overall.total}\n`;
    report += `- **Remaining:** ${overall.total - overall.completed}\n\n`;

    // Module breakdown
    report += "## 📚 Module Breakdown\n\n";

    this.modules.forEach((module, index) => {
      const moduleNum = index + 1;

      // More flexible regex pattern to find module sections
      const modulePatterns = [
        new RegExp(`### Module ${moduleNum}:[\\s\\S]*?(?=### Module ${moduleNum + 1}:|## |$)`, 'i'),
        new RegExp(`## Module ${moduleNum}:[\\s\\S]*?(?=## Module ${moduleNum + 1}:|## |$)`, 'i'),
        new RegExp(`# Module ${moduleNum}:[\\s\\S]*?(?=# Module ${moduleNum + 1}:|# |$)`, 'i')
      ];

      let moduleContent = null;
      let matchedContent = '';

      for (const pattern of modulePatterns) {
        moduleContent = content.match(pattern);
        if (moduleContent && moduleContent[0]) {
          matchedContent = moduleContent[0];
          break;
        }
      }

      if (matchedContent) {
        const moduleProgress = this.countCompletedTopics(matchedContent);
        const modulePercentage = module.topics > 0 ? Math.round((moduleProgress.completed / module.topics) * 100) : 0;

        report += `### Module ${moduleNum}: ${module.name}\n`;
        report += `- Progress: ${modulePercentage}% (${moduleProgress.completed}/${module.topics})\n`;
        report += `- Status: ${this.getModuleStatus(modulePercentage)}\n\n`;
      } else {
        // Module not found in content
        report += `### Module ${moduleNum}: ${module.name}\n`;
        report += `- Progress: 0% (0/${module.topics})\n`;
        report += `- Status: 🔴 Not Started\n\n`;
      }
    });

    // Achievement tracking
    report += "## 🏆 Achievement Status\n\n";
    const achievements = [
      { name: "First Steps", condition: overall.completed >= 1 },
      { name: "Quarter Way", condition: overallPercentage >= 25 },
      { name: "Halfway Hero", condition: overallPercentage >= 50 },
      { name: "Three Quarters", condition: overallPercentage >= 75 },
      { name: "Course Graduate", condition: overallPercentage >= 100 }
    ];

    achievements.forEach(achievement => {
      const status = achievement.condition ? "🔓 Unlocked" : "🔒 Locked";
      report += `- **${achievement.name}**: ${status}\n`;
    });

    // Next steps
    report += "\n## 🎯 Next Steps\n\n";
    if (overallPercentage === 0) {
      report += "- 🚀 Get started with Module 1: HTML Fundamentals\n";
      report += "- 📝 Set up your development environment\n";
      report += "- 📖 Read through the course overview\n";
    } else if (overallPercentage < 100) {
      report += "- ⏭️ Continue with your current module\n";
      report += "- 🔄 Review completed topics if needed\n";
      report += "- 💪 Keep up the great work!\n";
    } else {
      report += "- 🎉 Congratulations! You've completed the course!\n";
      report += "- 🌟 Consider building advanced projects\n";
      report += "- 📚 Explore advanced web development topics\n";
    }

    // Study tips
    report += "\n## 💡 Study Tips\n\n";
    report += "- 🕐 **Consistency**: Code a little every day\n";
    report += "- 🛠️ **Practice**: Build projects while learning\n";
    report += "- 🤝 **Community**: Ask questions and help others\n";
    report += "- 🔄 **Review**: Revisit topics you find challenging\n";

    // Save report
    const reportPath = path.join(__dirname, '..', 'progress-report.md');
    fs.writeFileSync(reportPath, report);

    console.log(`📊 Generated progress report: progress-report.md`);
  }

  getModuleStatus(percentage) {
    if (percentage === 0) return "🔴 Not Started";
    if (percentage < 25) return "🟡 Just Started";
    if (percentage < 50) return "🟠 In Progress";
    if (percentage < 75) return "🟢 Making Progress";
    if (percentage < 100) return "🔵 Almost Done";
    return "✅ Complete";
  }

  // Helper method to create sample progress for testing
  createSampleProgress() {
    const readmePath = path.join(__dirname, '..', 'README.md');

    if (!fs.existsSync(readmePath)) {
      console.log('📝 Creating sample README.md for testing...');

      const sampleContent = `# Web Design Course

![Course Progress](https://img.shields.io/badge/Progress-0%25-red)

## Learning Path

### Module 1: HTML Fundamentals
- ✅ Topic 1: Setup & Environment
- ✅ Topic 2: HTML Anatomy
- ⬜ Topic 3: Essential Tags
- ⬜ Topic 4: Content Tags
- ⬜ Topic 5: Self-closing Tags
- ⬜ Topic 6: Attributes & Classes

### Module 2: CSS Styling
- ⬜ Topic 1: CSS Introduction
- ⬜ Topic 2: Selectors
- ⬜ Topic 3: Box Model

### Module 3: JavaScript
- ⬜ Topic 1: Variables
- ⬜ Topic 2: Functions

### Module 4: DOM
- ⬜ Topic 1: Element Selection
- ⬜ Topic 2: Event Handling
`;

      fs.writeFileSync(readmePath, sampleContent);
      console.log('✅ Sample README.md created');
    }
  }

  run() {
    console.log("🚀 Starting progress update...\n");

    try {
      // Create sample content if README doesn't exist
      this.createSampleProgress();

      // Update progress
      const progress = this.updateREADME();
      this.updateIndexHTML(progress);
      this.generateProgressReport();

      console.log("\n🎉 Progress update completed successfully!");
      console.log(`📈 Current Progress: ${progress.percentage}% (${progress.completed}/${progress.total} topics)`);

    } catch (error) {
      console.error('\n❌ Error during progress update:');
      console.error(error.message);
      console.error('\n🔧 Troubleshooting tips:');
      console.error('1. Make sure you have a README.md file in your project root');
      console.error('2. Check that your README.md contains ✅ and ⬜ symbols for progress tracking');
      console.error('3. Verify file permissions and that Node.js can read/write files');
    }
  }
}

// Export for testing
module.exports = ProgressTracker;

// Run if called directly
if (require.main === module) {
  const tracker = new ProgressTracker();
  tracker.run();
}