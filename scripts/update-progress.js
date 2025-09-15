const fs = require('fs');
const path = require('path');

class TableBasedProgressTracker {
  constructor() {
    this.modules = [
      { name: 'HTML Fundamentals', number: 1, expectedTopics: 12, icon: '📄' },
      { name: 'CSS Styling & Design', number: 2, expectedTopics: 15, icon: '🎨' },
      { name: 'JavaScript Fundamentals', number: 3, expectedTopics: 9, icon: '⚡' },
      { name: 'JavaScript DOM Manipulation', number: 4, expectedTopics: 12, icon: '🌐' }
    ];
  }

  parseModuleTables(content) {
    const modules = [];

    this.modules.forEach(module => {
      // Find module section
      const modulePattern = new RegExp(
        `### Module ${module.number}: ${module.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?(?=### Module ${module.number + 1}:|$)`,
        'i'
      );

      const moduleMatch = content.match(modulePattern);

      if (moduleMatch) {
        const moduleContent = moduleMatch[0];

        // Extract table rows (skip header and separator)
        const tablePattern = /\|.*?\|.*?\|.*?\|.*?\|/g;
        const tableRows = moduleContent.match(tablePattern) || [];

        // Filter out header and separator rows
        const dataRows = tableRows.filter(row =>
          !row.includes('Topic | Status | Description') &&
          !row.includes('----') &&
          row.trim() !== ''
        );

        let completed = 0;
        let notStarted = 0;
        const topics = [];

        dataRows.forEach(row => {
          const cells = row.split('|').map(cell => cell.trim());
          if (cells.length >= 4 && cells[1]) { // Ensure we have topic name and status
            const topic = cells[1];
            const status = cells[2];

            topics.push({ topic, status });

            if (status.includes('✅') || status.includes('Complete')) {
              completed++;
            } else if (status.includes('⬜') || status.includes('Not Started')) {
              notStarted++;
            }
          }
        });

        const total = completed + notStarted;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        modules.push({
          ...module,
          completed,
          notStarted,
          total,
          percentage,
          topics,
          content: moduleContent
        });

        console.log(`📊 Module ${module.number}: ${completed}/${total} topics completed (${percentage}%)`);
      } else {
        console.warn(`⚠️  Module ${module.number} section not found`);
        modules.push({
          ...module,
          completed: 0,
          notStarted: 0,
          total: 0,
          percentage: 0,
          topics: [],
          content: ''
        });
      }
    });

    return modules;
  }

  updateModuleProgress(content, modules) {
    let updatedContent = content;

    modules.forEach(module => {
      if (module.total > 0) {
        // Update progress line: **Progress: X/Y Topics**
        const progressPattern = new RegExp(
          `(### Module ${module.number}: ${module.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?\\*\\*Progress: )\\d+/(\\d+) Topics\\*\\*`,
          'i'
        );

        updatedContent = updatedContent.replace(progressPattern,
          `$1${module.completed}/$2 Topics**`
        );

        // Update progress badge
        const badgePattern = new RegExp(
          `(### Module ${module.number}: ${module.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?Progress-)(\\d+)(%25-)(\\w+)(\\))`
        );

        const color = this.getProgressColor(module.percentage);
        updatedContent = updatedContent.replace(badgePattern,
          `$1${module.percentage}$3${color}$5`
        );

        console.log(`✅ Updated Module ${module.number} progress: ${module.completed}/${module.total} (${module.percentage}%)`);
      }
    });

    return updatedContent;
  }

  calculateOverallProgress(modules) {
    const totalCompleted = modules.reduce((sum, module) => sum + module.completed, 0);
    const totalTasks = modules.reduce((sum, module) => sum + module.total, 0);
    const overallPercentage = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

    return {
      completed: totalCompleted,
      total: totalTasks,
      percentage: overallPercentage
    };
  }

  updateOverallProgress(content, overall) {
    let updatedContent = content;

    // Update main course progress badge (usually at the top)
    const mainBadgePattern = /(\!\[Course Progress\]\(https:\/\/img\.shields\.io\/badge\/Progress-)\d+(%25-)(\w+)(\))/;
    const color = this.getProgressColor(overall.percentage);

    updatedContent = updatedContent.replace(mainBadgePattern,
      `$1${overall.percentage}$2${color}$4`
    );

    return updatedContent;
  }

  updateIndexHTML(overall, modules) {
    const indexPath = path.join(__dirname, '..', 'index.html');

    if (!fs.existsSync(indexPath)) {
      console.warn('⚠️  index.html not found, skipping HTML update');
      return;
    }

    let content = fs.readFileSync(indexPath, 'utf8');

    // Update overall progress text
    content = content.replace(
      /<div class="progress-text">\d+%<\/div>/g,
      `<div class="progress-text">${overall.percentage}%</div>`
    );

    // Update progress circle background
    const angle = overall.percentage * 3.6;
    content = content.replace(
      /conic-gradient\(#4CAF50 0deg [\d.]+deg, #e0e0e0 [\d.]+deg 360deg\)/g,
      `conic-gradient(#4CAF50 0deg ${angle}deg, #e0e0e0 ${angle}deg 360deg)`
    );

    // Update individual module progress bars and stats
    const moduleCards = [
      { selector: 'HTML Fundamentals', index: 0 },
      { selector: 'CSS Styling & Design', index: 1 },
      { selector: 'JavaScript Fundamentals', index: 2 },
      { selector: 'JavaScript DOM', index: 3 }
    ];

    moduleCards.forEach(card => {
      const module = modules[card.index];
      if (module && module.total > 0) {
        // Update progress bar width
        const progressBarPattern = new RegExp(
          `(<div class="module-title">${card.selector}</div>[\\s\\S]*?<div class="progress-fill" style="width: )\\d+(%"><\/div>)`
        );
        content = content.replace(progressBarPattern,
          `$1${module.percentage}$2`
        );

        // Update module stats
        const statsPattern = new RegExp(
          `(<div class="module-title">${card.selector}</div>[\\s\\S]*?<span>)\\d+/\\d+ Topics Complete(<\/span>[\\s\\S]*?<span>)\\d+% Complete(<\/span>)`
        );
        content = content.replace(statsPattern,
          `$1${module.completed}/${module.expectedTopics} Topics Complete$2${module.percentage}% Complete$3`
        );
      }
    });

    // Update achievements based on progress
    content = this.updateAchievements(content, overall, modules);

    fs.writeFileSync(indexPath, content);
    console.log(`✅ Updated index.html with ${overall.percentage}% overall progress and individual module progress`);
  }

  updateAchievements(content, overall, modules) {
    // Define achievement criteria
    const achievements = [
      {
        name: 'First Steps',
        condition: overall.completed >= 1,
        selector: 'First Steps'
      },
      {
        name: 'Style Master',
        condition: modules[1] && modules[1].completed >= 3, // 3+ CSS topics
        selector: 'Style Master'
      },
      {
        name: 'Interactive Wizard',
        condition: modules[2] && modules[2].completed >= 2, // 2+ JS topics
        selector: 'Interactive Wizard'
      },
      {
        name: 'DOM Manipulator',
        condition: modules[3] && modules[3].completed >= 1, // 1+ DOM topic
        selector: 'DOM Manipulator'
      },
      {
        name: 'Responsive Designer',
        condition: modules[1] && modules[1].completed >= 10, // Advanced CSS topics
        selector: 'Responsive Designer'
      },
      {
        name: 'Deployment Pro',
        condition: overall.completed >= 12, // Completed basic deployment
        selector: 'Deployment Pro'
      },
      {
        name: 'Course Graduate',
        condition: overall.percentage >= 100,
        selector: 'Course Graduate'
      },
      {
        name: 'Portfolio Ready',
        condition: overall.percentage >= 75,
        selector: 'Portfolio Ready'
      }
    ];

    achievements.forEach(achievement => {
      if (achievement.condition) {
        // Add 'unlocked' class to achievement
        const achievementPattern = new RegExp(
          `(<div class="achievement">([\\s\\S]*?<h3>${achievement.selector}</h3>[\\s\\S]*?)<\/div>)`
        );
        content = content.replace(achievementPattern,
          `<div class="achievement unlocked">$2</div>`
        );
      } else {
        // Ensure 'unlocked' class is removed if condition not met
        const achievementPattern = new RegExp(
          `(<div class="achievement unlocked">([\\s\\S]*?<h3>${achievement.selector}</h3>[\\s\\S]*?)<\/div>)`
        );
        content = content.replace(achievementPattern,
          `<div class="achievement">$2</div>`
        );
      }
    });

    return content;
  }

  getProgressColor(percentage) {
    if (percentage === 0) return 'red';
    if (percentage < 15) return 'orange';
    if (percentage < 35) return 'yellow';
    if (percentage < 65) return 'yellowgreen';
    if (percentage < 85) return 'green';
    return 'brightgreen';
  }

  generateProgressReport(modules, overall) {
    let report = "# 📊 Course Progress Report\n\n";
    report += `**Generated:** ${new Date().toISOString().split('T')[0]} at ${new Date().toISOString().split('T')[1].split('.')[0]}\n\n`;

    // Overall progress
    report += `## 🎯 Overall Course Progress: ${overall.percentage}%\n\n`;
    report += `- **Completed Topics:** ${overall.completed}\n`;
    report += `- **Total Topics:** ${overall.total}\n`;
    report += `- **Remaining:** ${overall.total - overall.completed}\n`;
    report += `- **Completion Rate:** ${overall.percentage}%\n\n`;

    // Progress visualization
    const progressBar = '█'.repeat(Math.floor(overall.percentage / 2)) + '░'.repeat(50 - Math.floor(overall.percentage / 2));
    report += `### Progress Visualization\n\`\`\`\n${progressBar} ${overall.percentage}%\n\`\`\`\n\n`;

    // Module breakdown table
    report += "## 📚 Module Progress Breakdown\n\n";
    report += "| Module | Progress | Completed | Total | Percentage | Status |\n";
    report += "|--------|----------|-----------|-------|------------|--------|\n";

    modules.forEach(module => {
      const status = this.getModuleStatus(module.percentage);
      report += `| Module ${module.number}: ${module.name} | ${module.completed}/${module.total} | ${module.completed} | ${module.total} | ${module.percentage}% | ${status} |\n`;
    });

    report += "\n";

    // Achievement status
    report += "## 🏆 Achievement Status\n\n";
    const achievements = [
      { name: "First Steps", condition: overall.completed >= 1, icon: "🎯", desc: "Complete your first topic" },
      { name: "Getting Started", condition: overall.completed >= 5, icon: "🚀", desc: "Complete 5 topics" },
      { name: "Quarter Progress", condition: overall.percentage >= 25, icon: "📈", desc: "Reach 25% completion" },
      { name: "Halfway Hero", condition: overall.percentage >= 50, icon: "⭐", desc: "Reach 50% completion" },
      { name: "Three Quarters", condition: overall.percentage >= 75, icon: "🌟", desc: "Reach 75% completion" },
      { name: "Course Graduate", condition: overall.percentage >= 100, icon: "🎓", desc: "Complete entire course" }
    ];

    achievements.forEach(achievement => {
      const status = achievement.condition ? "🔓 **Unlocked**" : "🔒 Locked";
      report += `- ${achievement.icon} **${achievement.name}**: ${status} - ${achievement.desc}\n`;
    });

    // Save report
    const reportPath = path.join(__dirname, '..', 'progress-report.md');
    fs.writeFileSync(reportPath, report);

    console.log('📊 Generated comprehensive progress report: progress-report.md');
  }

  getModuleStatus(percentage) {
    if (percentage === 0) return "🔴 Not Started";
    if (percentage < 25) return "🟡 Just Started";
    if (percentage < 50) return "🟠 In Progress";
    if (percentage < 75) return "🟢 Good Progress";
    if (percentage < 100) return "🔵 Almost Done";
    return "✅ Complete";
  }

  createSampleContent() {
    const readmePath = path.join(__dirname, '..', 'README.md');

    const sampleContent = `# 🚀 Quick Starting Guide for Modern Web Design

![Course Progress](https://img.shields.io/badge/Progress-0%25-red)

## 🗺️ Learning Path & Progress Tracking

### Module 1: HTML Fundamentals
**Progress: 0/12 Topics** ![Progress](https://img.shields.io/badge/Progress-0%25-red)

**Topics Covered:**

| Topic | Status | Description | Hands-on Project |
|-------|--------|-------------|------------------|
| Setup & Environment | ✅ Complete | Editor setup, creating HTML files | Create first HTML file |
| HTML Anatomy | ✅ Complete | Elements, tags, attributes structure | Build basic page template |
| Essential Tags | ✅ Complete | \`<html>\`, \`<head>\`, \`<title>\`, \`<body>\` | Complete page structure |
| Content Tags | ⬜ Not Started | \`<h1>\`, \`<p>\`, \`<div>\`, \`<span>\` | Text content layout |
| Self-closing Tags | ⬜ Not Started | \`<hr>\`, \`<br>\`, proper usage | Line breaks and dividers |
| Attributes & Classes | ⬜ Not Started | \`id\`, \`class\`, \`style\` attributes | Styled elements |
| Hyperlinks | ⬜ Not Started | \`<a>\` tags, navigation between pages | Multi-page website |
| Images | ⬜ Not Started | \`<img>\` tags, alt text, optimization | Image gallery |
| Lists | ⬜ Not Started | \`<ul>\`, \`<ol>\`, \`<li>\` for content organization | Navigation menu |
| Tables | ⬜ Not Started | \`<table>\`, \`<tr>\`, \`<td>\`, \`<th>\` structure | Data presentation |
| Semantic Elements | ⬜ Not Started | \`<nav>\`, \`<header>\`, \`<section>\`, \`<article>\`, \`<aside>\`, \`<footer>\` | Professional page layout |
| GitHub Pages Deploy | ⬜ Not Started | Going live with your HTML site | Live website deployment |

**Milestone Project:** Personal Portfolio Website (HTML only)

---

### Module 2: CSS Styling & Design
**Progress: 0/15 Topics** ![Progress](https://img.shields.io/badge/Progress-0%25-red)

**Topics Covered:**

| Topic | Status | Description | Hands-on Project |
|-------|--------|-------------|------------------|
| CSS Integration | ⬜ Not Started | Adding CSS to HTML: inline, internal, external | Styled HTML template |
| CSS Syntax | ⬜ Not Started | Selectors, declarations, properties | Basic styling rules |
| Element Selection | ⬜ Not Started | Tag, ID, class selectors | Targeted styling |
| Colors & Backgrounds | ⬜ Not Started | Named colors, HEX, RGB, RGBA, background properties | Colorful webpage |
| Box Model | ⬜ Not Started | Borders, margins, padding, height, width | Layout understanding |
| Typography | ⬜ Not Started | Text styling, font properties, Google Fonts | Typography showcase |
| Link Styling | ⬜ Not Started | Pseudo-classes: \`:hover\`, \`:visited\`, \`:active\` | Interactive navigation |
| Display Properties | ⬜ Not Started | \`inline\`, \`block\`, \`none\` display types | Element positioning |
| Positioning | ⬜ Not Started | \`static\`, \`relative\`, \`fixed\`, \`absolute\`, \`sticky\` | Positioned elements |
| Float & Clear | ⬜ Not Started | Float layouts, clearing floats | Multi-column layout |
| CSS Combinators | ⬜ Not Started | Child selectors, descendant selectors | Advanced selection |
| Pseudo Elements | ⬜ Not Started | \`::first-line\`, \`::first-letter\`, \`::after\` | Enhanced styling |
| Responsive Design | ⬜ Not Started | Media queries, mobile-first approach | Mobile-friendly site |
| CSS Grid | ⬜ Not Started | \`display: grid\`, \`grid-template-areas\` | Grid-based layout |
| CSS Flexbox | ⬜ Not Started | Flexible box layout, axes, alignment | Flexible components |

**Milestone Project:** Responsive Portfolio Website with Modern Design

---

### Module 3: JavaScript Fundamentals
**Progress: 0/9 Topics** ![Progress](https://img.shields.io/badge/Progress-0%25-red)

**Topics Covered:**

| Topic | Status | Description | Hands-on Project |
|-------|--------|-------------|------------------|
| JavaScript Introduction | ⬜ Not Started | \`alert()\`, \`prompt()\`, adding JS to HTML | Interactive alerts |
| Variables | ⬜ Not Started | \`let\`, \`const\`, variable declarations | Data storage |
| Data Types | ⬜ Not Started | Strings, numbers, booleans, undefined, null | Type exploration |
| Operators | ⬜ Not Started | Arithmetic, comparison, logical operators | Calculator function |
| Arrays | ⬜ Not Started | Array creation, methods, manipulation | Data collections |
| Objects | ⬜ Not Started | Object literals, properties, methods | User profiles |
| Functions | ⬜ Not Started | Function declarations, parameters, return values | Reusable code blocks |
| Conditions | ⬜ Not Started | \`if\`, \`else if\`, \`else\`, \`switch\` statements | Decision making |
| Loops | ⬜ Not Started | \`for\`, \`while\`, \`do-while\`, \`forEach\` loops | Iteration practice |

**Milestone Project:** Interactive Web Calculator

---

### Module 4: JavaScript DOM Manipulation
**Progress: 0/12 Topics** ![Progress](https://img.shields.io/badge/Progress-0%25-red)

**Topics Covered:**

| Topic | Status | Description | Hands-on Project |
|-------|--------|-------------|------------------|
| DOM Introduction | ⬜ Not Started | Document Object Model understanding | DOM tree visualization |
| Element Selection | ⬜ Not Started | \`getElementById\`, \`querySelector\`, \`querySelectorAll\` | Element targeting |
| Multiple Selection | ⬜ Not Started | \`getElementsByClassName\`, \`getElementsByTagName\` | Bulk element handling |
| Element Manipulation | ⬜ Not Started | Changing content, attributes, properties | Dynamic content |
| Style Manipulation | ⬜ Not Started | Modifying CSS properties via JavaScript | Dynamic styling |
| Event Listeners | ⬜ Not Started | Click, mouse, keyboard event handling | Interactive elements |
| Input Handling | ⬜ Not Started | Form inputs, value extraction | Form validation |
| Element Creation | ⬜ Not Started | \`createElement\`, \`appendChild\`, \`removeChild\` | Dynamic HTML |
| Animation | ⬜ Not Started | CSS transitions, JavaScript animations | Moving elements |
| Window Events | ⬜ Not Started | Load, resize, scroll events | Page-level interactions |
| Document Events | ⬜ Not Started | DOM content loaded, ready states | Loading management |
| Keyboard Events | ⬜ Not Started | Key press tracking, input monitoring | Keyboard shortcuts |

**Milestone Project:** Dynamic Task Management App
`;

    fs.writeFileSync(readmePath, sampleContent);
    console.log('✅ Created sample README.md with table-based progress format');
  }

  run() {
    console.log("🚀 Starting table-based progress tracking...\n");

    try {
      const readmePath = path.join(__dirname, '..', 'README.md');

      // Create sample if README doesn't exist
      if (!fs.existsSync(readmePath)) {
        console.log('📝 Creating sample README.md...');
        this.createSampleContent();
      }

      const content = fs.readFileSync(readmePath, 'utf8');

      // Parse module tables
      console.log('🔍 Parsing module progress tables...');
      const modules = this.parseModuleTables(content);

      // Calculate overall progress
      const overall = this.calculateOverallProgress(modules);

      // Update README content
      console.log('\n📝 Updating README.md...');
      let updatedContent = this.updateModuleProgress(content, modules);
      updatedContent = this.updateOverallProgress(updatedContent, overall);

      // Save updated README
      fs.writeFileSync(readmePath, updatedContent);

      // Update HTML visualization
      console.log('📊 Updating index.html visualization...');
      this.updateIndexHTML(overall, modules);

      // Generate comprehensive report
      this.generateProgressReport(modules, overall);

      // Summary
      console.log('\n🎉 Progress update completed successfully!');
      console.log(`📊 Overall Progress: ${overall.percentage}% (${overall.completed}/${overall.total} topics)`);

      console.log('\n📋 Module Summary:');
      modules.forEach(module => {
        if (module.total > 0) {
          console.log(`   Module ${module.number}: ${module.completed}/${module.total} (${module.percentage}%)`);
        }
      });

      console.log('\n💡 To update progress:');
      console.log('   1. Complete a topic');
      console.log('   2. Change "⬜ Not Started" to "✅ Complete" in the table');
      console.log('   3. Run: npm run progress');

    } catch (error) {
      console.error('\n❌ Error during progress update:');
      console.error(error.message);
      console.error('\n🔧 Troubleshooting:');
      console.error('1. Ensure README.md has the correct table format');
      console.error('2. Check that table rows have proper | separators');
      console.error('3. Verify Status column contains "✅ Complete" or "⬜ Not Started"');
    }
  }
}

// Export for testing
module.exports = TableBasedProgressTracker;

// Run if called directly
if (require.main === module) {
  const tracker = new TableBasedProgressTracker();
  tracker.run();
}