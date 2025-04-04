// nightwatch/commands/customScreenshot.js
const path = require('path');

exports.command = function (filenamePrefix) {
    const now = new Date();
    const timestamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}-${String(now.getMinutes()).padStart(2, '0')}-${String(now.getSeconds()).padStart(2, '0')}`;
    const testName = this.currentTest.results.failed ? 'FAILED' : 'PASSED';
    const filename = `${filenamePrefix}_${testName}_${timestamp}.png`;
    const screenshotPath = path.join('tests_output/screenshots', filename);

    this.saveScreenshot(screenshotPath, function() {
        console.log(`Screenshot saved as: ${filename}`);
    });

    return this;
};
