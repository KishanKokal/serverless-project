const chromium = require("chrome-aws-lambda");
const puppeteer = require("puppeteer-core");

exports.handler = async (event, context) => {
  const { body } = event;
  const page_url = JSON.parse(body).page_url;
  console.log(page_url);
  const browser = await puppeteer.launch({
    args: [
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--no-sandbox",
      "--no-zygote",
      "--deterministic-fetch",
      "--disable-features=IsolateOrigins",
      "--disable-site-isolation-trials",
    ],
    headless: true,
    executablePath:
      process.env.CHROME_EXECUTABLE_PATH || (await chromium.executablePath),
  });

  const page = await browser.newPage();

  await page.goto(page_url, {
    waitUntil: "networkidle0",
  });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      right: "15mm",
      bottom: "20mm",
      left: "15mm",
    },
  });

  await browser.close();

  return {
    statusCode: 200,
    body: JSON.stringify({ content: pdfBuffer.toString("base64") }),
  };
};
