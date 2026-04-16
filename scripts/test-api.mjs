// test-api.mjs
const API_URL = 'http://localhost:3001/api/reviews';

async function main() {
  console.log('🔍 Fetching API response from ' + API_URL);
  try {
    const res = await fetch(API_URL);
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    console.log('✅ API Response Header:');
    console.log(`Success: ${data.success}`);
    console.log(`Total Count (All): ${data.totalCount}`);
    console.log(`Approved Count: ${data.count}`);
    console.log(`Average: ${data.stats?.average}`);
    console.log(`Distribution:`, JSON.stringify(data.stats?.distribution, null, 2));
    
    if (data.reviews.length > 0) {
        console.log(`First Approved Review: ${data.reviews[0].name} - Rating: ${data.reviews[0].rating}`);
    } else {
        console.log('ℹ️ No approved reviews to show in the list yet.');
    }
  } catch (err) {
    console.error('❌ API Test failed:', err.message);
    console.log('Note: Ensure "npm run dev" is running at port 3001.');
  }
}

main();
