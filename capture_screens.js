import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = 'screenshots';

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR);
}

(async () => {
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();

    // Set viewport to FHD
    await page.setViewport({ width: 1920, height: 1080 });

    const capture = async (route, filename) => {
        console.log(`Navigating to ${route}...`);
        try {
            await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' });
            const filePath = path.join(SCREENSHOT_DIR, filename);
            await page.screenshot({ path: filePath });
            console.log(`📸 Captured ${filename}`);
        } catch (e) {
            console.error(`❌ Failed to capture ${route}:`, e.message);
        }
    };

    // 1. Capture Public Pages
    await capture('/', 'home.png');
    await capture('/login', 'login.png');
    await capture('/register', 'register.png');
    await capture('/community', 'community.png');

    // 2. Register/Login Flow to Access Dashboard
    console.log('🔄 Attempting to Register/Login...');
    try {
        await page.goto(`${BASE_URL}/register`);

        // Generate random user
        const uniqueId = Date.now();
        const email = `demo${uniqueId}@example.com`;
        const password = 'password123';

        // Wait for inputs to appear (handling animations)
        try {
            await page.waitForSelector('input[type="text"]', { timeout: 5000 });
        } catch (e) {
            console.log('Timeout waiting for inputs, taking debug screenshot...');
            await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'debug_register.png') });
        }

        // Fill Registration Form
        const nameInput = await page.$('input[type="text"]');
        const emailInput = await page.$('input[type="email"]');
        const passwordInput = await page.$('input[type="password"]');
        const submitBtn = await page.$('button'); // Only button in form

        if (nameInput && emailInput && passwordInput && submitBtn) {
            console.log('✍️  Filling registration form...');
            await nameInput.type(`Demo User ${uniqueId}`, { delay: 50 });
            await emailInput.type(email, { delay: 50 });
            await passwordInput.type(password, { delay: 50 });

            console.log('👆 Clicking register button...');
            await submitBtn.click();

            // Wait for navigation to Dashboard
            try {
                await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 });
            } catch (e) {
                console.log('Navigation timeout, checking URL...');
            }

            // Allow time for state updates and animations
            await new Promise(r => setTimeout(r, 2000));

            if (page.url().includes('dashboard')) {
                console.log('✅ Registration successful, creating dashboard screenshot...');
                await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'dashboard.png') });

                // Go to Generator while logged in
                await capture('/generate', 'generator.png');
            } else {
                console.log('⚠️ Could not verify redirection to dashboard. Current URL:', page.url());
                // Try explicit navigation if auth token was saved
                await capture('/dashboard', 'dashboard.png');
                await capture('/generate', 'generator.png');
            }
        } else {
            console.log('⚠️ Could not find registration inputs. Skipping authenticated screenshots.');
        }

    } catch (error) {
        console.error('❌ Error during auth flow:', error);
    }

    await browser.close();
    console.log('✨ Screenshot capture complete!');
})();
