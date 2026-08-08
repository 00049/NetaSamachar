const fs = require('fs');
const { v2: cloudinary } = require('cloudinary');

require('dotenv').config({ path: '.env.local' });

cloudinary.config({
  cloud_name: 'g37jftpu',
  api_key: '212293711995715',
  api_secret: '69i-Gm5gRdF4hYx66E0qqDtoreE',
});

async function main() {
  const filePath = '/Users/saravpreetsinghpruthi/Neta-Samachar/data/politicians.ts';
  let fileContent = fs.readFileSync(filePath, 'utf8');

  // Regex to find all photoUrl properties
  const urlRegex = /photoUrl:\s*'([^']+)'/g;
  let match;
  const urlsToUpload = [];

  while ((match = urlRegex.exec(fileContent)) !== null) {
    const url = match[1];
    if (url.includes('wikimedia.org') || url.includes('pravatar.cc')) {
      urlsToUpload.push(url);
    }
  }

  // Deduplicate
  const uniqueUrls = [...new Set(urlsToUpload)];
  console.log(`Found ${uniqueUrls.length} unique URLs to migrate.`);

  const urlMap = {};

  for (const url of uniqueUrls) {
    console.log(`Uploading: ${url}`);
    try {
      const result = await cloudinary.uploader.upload(url, {
        folder: 'neta_samachar_politicians',
      });
      console.log(`Success: ${result.secure_url}`);
      urlMap[url] = result.secure_url;
    } catch (err) {
      console.error(`Error uploading ${url}:`, err);
    }
  }

  console.log('Replacing URLs in data/politicians.ts...');
  for (const [oldUrl, newUrl] of Object.entries(urlMap)) {
    // Replace all occurrences of the old URL with the new one
    fileContent = fileContent.split(oldUrl).join(newUrl);
  }

  fs.writeFileSync(filePath, fileContent);
  console.log('Migration complete!');
}

main().catch(console.error);
