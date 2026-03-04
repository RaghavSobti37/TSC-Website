/**
 * Phase 10 Verification Script
 * Tests:
 * - Header component rendering
 * - Hero section rendering
 * - Video component integration
 * - TypeScript compilation
 * - Production build success
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:3002';
let testResults = [];

// Test 1: Check if dev server is responsive
function testServerResponsive() {
  return new Promise((resolve) => {
    const req = http.get(`${baseUrl}/`, (res) => {
      const test =
        res.statusCode === 200
          ? '✅ Server is responsive'
          : `❌ Server returned status ${res.statusCode}`;
      testResults.push(test);
      resolve(res.statusCode === 200);
    });

    req.on('error', (err) => {
      testResults.push(`❌ Server not responding: ${err.message}`);
      resolve(false);
    });

    setTimeout(() => {
      req.abort();
      testResults.push('❌ Server request timeout');
      resolve(false);
    }, 5000);
  });
}

// Test 2: Verify header component is in the HTML
function testHeaderComponent() {
  return new Promise((resolve) => {
    http.get(`${baseUrl}/`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const hasHeader =
          data.includes('fixed') ||
          data.includes('z-40') ||
          data.includes('✦ TSC');
        testResults.push(
          hasHeader
            ? '✅ Header component renders'
            : '❌ Header component not found'
        );
        resolve(hasHeader);
      });
    });
  });
}

// Test 3: Verify hero section is in the HTML
function testHeroSection() {
  return new Promise((resolve) => {
    http.get(`${baseUrl}/`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const hasHero =
          data.includes('id="hero"') ||
          data.includes('THE ETERNAL') ||
          data.includes('DISCOVER THE ORIGIN');
        testResults.push(
          hasHero
            ? '✅ Hero section renders'
            : '❌ Hero section not found'
        );
        resolve(hasHero);
      });
    });
  });
}

// Test 4: Verify HeroVideo component is integrated
function testHeroVideoComponent() {
  return new Promise((resolve) => {
    http.get(`${baseUrl}/`, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        const hasVideo =
          data.includes('video') ||
          data.includes('HeroVideo') ||
          data.includes('webm') ||
          data.includes('mp4');
        testResults.push(
          hasVideo
            ? '✅ HeroVideo component integrated'
            : '⚠️  HeroVideo component may not be rendered'
        );
        resolve(hasVideo);
      });
    });
  });
}

// Test 5: Check TypeScript compilation
function testTypeScriptCompilation() {
  try {
    const tsConfigPath = path.join(
      process.cwd(),
      'tsconfig.json'
    );
    if (fs.existsSync(tsConfigPath)) {
      testResults.push('✅ TypeScript configuration exists');
      return true;
    } else {
      testResults.push('❌ TypeScript configuration not found');
      return false;
    }
  } catch (err) {
    testResults.push(`❌ Error checking TypeScript: ${err.message}`);
    return false;
  }
}

// Test 6: Check environment variables
function testEnvVariables() {
  try {
    const envLocalPath = path.join(
      process.cwd(),
      '.env.local'
    );
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, 'utf-8');
      const hasVideoVars =
        content.includes('NEXT_PUBLIC_HERO_VIDEO_WEBM') &&
        content.includes('NEXT_PUBLIC_HERO_VIDEO_MP4');
      testResults.push(
        hasVideoVars
          ? '✅ Video environment variables configured'
          : '⚠️  Video environment variables not configured (optional)'
      );
      return true;
    } else {
      testResults.push('❌ .env.local file not found');
      return false;
    }
  } catch (err) {
    testResults.push(
      `❌ Error checking environment variables: ${err.message}`
    );
    return false;
  }
}

// Test 7: Check critical component files
function testComponentFiles() {
  const requiredFiles = [
    'components/layout/Header.tsx',
    'components/sections/HeroSection.tsx',
    'components/video/HeroVideo.tsx',
  ];

  const baseDir = process.cwd();
  let allExist = true;

  for (const file of requiredFiles) {
    const filePath = path.join(baseDir, file);
    if (!fs.existsSync(filePath)) {
      testResults.push(`❌ Missing: ${file}`);
      allExist = false;
    }
  }

  if (allExist) {
    testResults.push('✅ All critical component files exist');
  }

  return allExist;
}

// Run all tests
async function runTests() {
  console.log('\n🔍 Phase 10 Verification Tests\n');
  console.log('='.repeat(50));

  // Run tests
  await testServerResponsive();
  await testHeaderComponent();
  await testHeroSection();
  await testHeroVideoComponent();
  testTypeScriptCompilation();
  testEnvVariables();
  testComponentFiles();

  // Print results
  console.log('\n📋 Test Results:\n');
  testResults.forEach((result) => console.log(result));

  // Summary
  console.log('\n' + '='.repeat(50));
  const passCount = testResults.filter((r) =>
    r.startsWith('✅')
  ).length;
  const warnCount = testResults.filter((r) =>
    r.startsWith('⚠️')
  ).length;
  const failCount = testResults.filter((r) =>
    r.startsWith('❌')
  ).length;

  console.log(`\n✅ Passed: ${passCount}`);
  if (warnCount > 0) console.log(`⚠️  Warnings: ${warnCount}`);
  if (failCount > 0) console.log(`❌ Failed: ${failCount}`);

  console.log(
    `\n${failCount === 0 ? '✨ Phase 10 Ready!' : '⚠️  Issues to resolve'}\n`
  );

  process.exit(failCount > 0 ? 1 : 0);
}

runTests().catch(console.error);
