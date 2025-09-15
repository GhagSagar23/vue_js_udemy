const fs = require('fs');
const path = require('path');
const { HtmlValidate } = require('html-validate');

const htmlValidate = new HtmlValidate({
  rules: {
    "doctype-html5": "error",
    "no-trailing-whitespace": "warn",
    "attribute-quotes": "error",
    "close-order": "error",
    "void-content": "error"
  }
});

function validateHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  let errorCount = 0;
  let fileCount = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.')) {
      const subErrors = validateHtmlFiles(filePath);
      errorCount += subErrors;
    } else if (file.endsWith('.html')) {
      fileCount++;
      console.log(`Validating: ${filePath}`);

      const content = fs.readFileSync(filePath, 'utf8');
      const report = htmlValidate.validateString(content);

      if (!report.valid) {
        console.error(`❌ ${file}: ${report.results[0].messages.length} errors`);
        report.results[0].messages.forEach(msg => {
          console.error(`   Line ${msg.line}: ${msg.message}`);
        });
        errorCount += report.results[0].messages.length;
      } else {
        console.log(`✅ ${file}: Valid`);
      }
    }
  });

  if (fileCount > 0) {
    console.log(`\n📊 Validation Summary:`);
    console.log(`   Files checked: ${fileCount}`);
    console.log(`   Total errors: ${errorCount}`);

    if (errorCount === 0) {
      console.log(`🎉 All HTML files are valid!`);
    }
  }

  return errorCount;
}

// Run validation
const rootDir = path.join(__dirname, '..');
validateHtmlFiles(rootDir);