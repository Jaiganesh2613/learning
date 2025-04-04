const path = require('path');
const fs = require("fs");

function formatDateTime(date) {
  const options = {
    timeZone: 'Asia/Kolkata',
    month: 'short',
    day: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  };

  const formatter = new Intl.DateTimeFormat('en-US', options);
  const formattedParts = formatter.formatToParts(date);

  const parts = {};
  formattedParts.forEach(({ type, value }) => {
    parts[type] = value;
  });

  const month = parts.month;
  const day = parts.day;
  const year = parts.year;
  const hours = parts.hour;
  const minutes = parts.minute;
  const seconds = parts.second;

  const offset = -date.getTimezoneOffset();
  const sign = offset >= 0 ? '+' : '-';
  const offsetHours = String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0');
  const offsetMinutes = String(Math.abs(offset) % 60).padStart(2, '0');

  return `${month}-${day}-${year}-${hours}${minutes}${seconds}-GMT${sign}${offsetHours}${offsetMinutes}`;
}

module.exports = {
  src_folders: ['test'],
  page_objects_path: ['nightwatch/page-objects'],
  output_folder: 'tests_output',
  custom_commands_path: '',
  custom_assertions_path: '',
  globals_path: '',
  detailed_output: true,
  log_screenshot_data: false,

  webdriver: {
    start_process: true,
    server_path: require('chromedriver').path,
    log_path: 'path/to/chromedriver.log',
    port: 9516,
    cli_args: ['--port=9516']
  },

  test_settings: {
    default: {
      launch_url: 'http://localhost',
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--no-sandbox', '--disable-dev-shm-usage', '--ignore-certificate-errors', '--ignore-ssl-errors']
        }
      },
      screenshots: {
        enabled: true,
        path: 'tests_output/screenshots',
        on_failure: true,
        on_error: true,
        on_success: true,
      },
      globals: {
        reporter: (results, done) => {
          console.log('Reporter function called');

          const CustomHtmlReporter = require('./utils/custom_html_reporter');
          const reporter = new CustomHtmlReporter();

          if (results.modules) {
            for (const moduleName in results.modules) {
              const module = results.modules[moduleName];
              if (module.completed) {
                for (const testName in module.completed) {
                  const testCase = module.completed[testName];
                  const testStatus = testCase.failed > 0 ? 'FAILED' : 'PASSED';

                  // Collect all assertions
                  const assertions = testCase.assertions.map(assertion => {
                    const messageParts = assertion.message.split(': ');
                    return {
                      message: messageParts[1] || messageParts[0],
                      failure: assertion.failure || false,
                      stackTrace: assertion.stackTrace || 'No stack trace'
                    };
                  });

                  // Log assertions based on test status
                  assertions.forEach(assertion => {
                    if (testStatus === 'FAILED' && assertion.failure) {
                      console.log(`Assertion: Failure: ${assertion.message}`);
                    } else if (testStatus === 'PASSED') {
                      console.log(`Assertion: ${assertion.message}`);
                    }
                  });

                  // Construct screenshot filename
                  const screenshotDir = path.join('tests_output/screenshots', moduleName);
                  const formattedTestName = testName.replace(/\s+/g, '-');
                  const date = new Date();
                  const formattedDate = formatDateTime(date);
                  const screenshotFileName = `${formattedTestName}_${testStatus}_${formattedDate}.png`;
                  const screenshotFilePath = path.join(screenshotDir, screenshotFileName);
                  console.log(`screenshots : ${screenshotFilePath}`);

                  // Ensure the screenshot directory exists
                  if (!fs.existsSync(screenshotDir)) {
                    console.log(`screenshots exits : ${screenshotFilePath}`);
                  }

                  const screenshot = fs.existsSync(screenshotFilePath) ? screenshotFilePath : '';

                  reporter.results.push({
                    title: moduleName,
                    testName: testName,
                    status: testStatus,
                    message: testCase.lastError ? testCase.lastError.message : 'Test passed successfully',
                    passed: testCase.passed || 0,
                    failed: testCase.failed || 0,
                    errors: testCase.errors || 0,
                    skipped: testCase.skipped || 0,
                    duration: (testCase.timeMs / 1000).toFixed(2) + 's' || 'N/A',
                    assertions: assertions,
                    screenshot: screenshot
                  });
                }
              }
            }
          }

          reporter.onEnd(results, done);
        }
      },
      webdriver: {
        server_path: require('chromedriver').path
      }
    }
  }
};
