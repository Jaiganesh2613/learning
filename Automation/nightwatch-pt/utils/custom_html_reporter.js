const fs = require('fs');
const path = require('path');

class CustomHtmlReporter {
    constructor() {
        this.results = [];
    }

    writeReport(results, options, done) {
        const reportDir = path.join(__dirname, 'reports');
        const reportPath = path.join(reportDir, 'custom-report.html');
        const reportHtml = this.generateHtml(results);

        // Ensure the directory exists
        if (!fs.existsSync(reportDir)) {
            fs.mkdirSync(reportDir, { recursive: true });
        }

        fs.writeFile(reportPath, reportHtml, (err) => {
            if (err) throw err;
            console.log('Report saved to', reportPath);
            done();
        });
    }

    generateHtml(results) {
        const currentDateTime = new Date().toLocaleString();

        let html = `
<html>
<head>
  <meta charset="UTF-8">
  <title>Nightwatch Test Report</title>
  <style>
    body { 
      font-family: Arial, sans-serif; 
      color: #333; 
      margin: 0; 
      padding: 20px; 
    }
    h2 { 
      color: #000000; 
      text-align: center; 
      background-color: #1895d2; /* Light blue background for heading */
      padding: 10px; 
      border-radius: 5px; 
    }
    p { 
      color: #666; 
      text-align: center; 
    }
    table { 
      width: 100%; 
      border-collapse: collapse; 
      margin: 20px auto; 
      background-color: #fff; 
      box-shadow: 0 0 10px rgba(0,0,0,0.1); 
    }
    th, td { 
      border: 1px solid #ddd; 
      padding: 12px; 
      text-align: left; 
    }
    th { 
      background-color: #f2f2f2; 
      color: #333; 
    }
    tr:nth-child(even) { 
      background-color: #f9f9f9; 
    }
    .passed { 
      color: green; 
      font-weight: bold; 
    }
    .failed { 
      color: red; 
      font-weight: bold; 
    }
    img { 
      max-width: 300px; 
    }
    .icon-passed::before { 
      content: '✔'; 
      color: green; 
      font-weight: bold; 
    }
    .icon-failed::before { 
      content: '✘'; 
      color: red; 
      font-weight: bold; 
    }
    .assertions { 
      display: none; /* Initially hidden */
      margin: 10px 0; 
      padding: 10px; 
      border: 1px solid #ddd; 
      text-align: left; /* Align text to the left */
    }
    .assertions p { 
      margin: 0; /* Remove default margins */
      padding: 5px 0; /* Add some padding for better readability */
      line-height: 1.5; /* Improve readability */
      text-align: left; /* Ensure text alignment is left */
    }
    .toggle-btn {
      cursor: pointer;
      color: #1895d2;
      text-decoration: underline;
    }
    .test-case { 
      cursor: pointer; 
    }
  </style>
  <script>
    function toggleAssertions(testId) {
      var assertionsDiv = document.getElementById('assertions-' + testId);
      if (assertionsDiv.style.display === 'none' || assertionsDiv.style.display === '') {
        assertionsDiv.style.display = 'block';
      } else {
        assertionsDiv.style.display = 'none';
      }
    }
  </script>
</head>
<body>
  <h2>Nightwatch Test Report</h2>
  <p>Generated on: ${currentDateTime}</p>
  <table>
    <tr>
      <th><span>Status</span></th>
      <th><span>Test</span></th>
      <th><span>Passed</span></th>
      <th><span>Failed</span></th>
      <th><span>Errors</span></th>
      <th><span>Skipped</span></th>
      <th><span>Duration</span></th>
      <th><span>Screenshot</span></th>
    </tr>
`;

        results.forEach((result, index) => {
            const screenshotHtml = result.screenshot
                ? `<img src="${result.screenshot}" alt="Screenshot">`
                : 'N/A';

            html += `
    <tr class="${result.status}">
      <td><span><i class="icon-${result.status}"></i></span></td>
      <td><span class="test-case" onclick="toggleAssertions(${index})">${result.testName}</span></td>
      <td><span>${result.passed || 0}</span></td>
      <td><span>${result.failed || 0}</span></td>
      <td><span>${result.errors || 0}</span></td>
      <td><span>${result.skipped || 0}</span></td>
      <td><span>${result.duration || 'N/A'}</span></td>
      <td>${screenshotHtml}</td>
    </tr>
`;

            if (result.assertions && result.assertions.length > 0) {
                // Filter assertions to exclude specific unwanted messages
                const filteredAssertions = result.assertions.map(assertion => {
                    return {
                        ...assertion,
                        message: this.processAssertionMessage(assertion.message)
                    };
                });

                if (filteredAssertions.length > 0) {
                    html += `
    <tr>
      <td colspan="8">
        <div id="assertions-${index}" class="assertions">
`;

                    filteredAssertions.forEach(assertion => {
                        const assertionClass = result.status === 'failed' && assertion.failure ? 'failed' : 'passed';
                        html += `
          <p class="${assertionClass}">${assertion.failure ? 'Failure: ' : 'Assertion: '}${assertion.message}</p>
`;
                    });

                    html += `
        </div>
      </td>
    </tr>
`;
                }
            }
        });

        html += `
  </table>
</body>
</html>
`;

        return html;
    }

    processAssertionMessage(message) {
        // Remove everything after the first hyphen (including the hyphen itself)
        const parts = message.split(' - ');
        return parts[0].trim();
    }

    onEnd(results, done) {
        this.writeReport(this.results, {}, done);
    }
}

module.exports = CustomHtmlReporter;
