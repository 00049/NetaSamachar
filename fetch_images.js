const https = require('https');
const politicians = [
  "Tejashwi Yadav",
  "Shambhuraj Desai",
  "Keshab Mahanta",
  "Prashant Kishor"
];

politicians.forEach(name => {
  const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(name)}&prop=pageimages&format=json&pithumbsize=400`;
  https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const json = JSON.parse(data);
      const pages = json.query.pages;
      const pageId = Object.keys(pages)[0];
      if (pages[pageId].thumbnail) {
        console.log(`${name}: ${pages[pageId].thumbnail.source}`);
      } else {
        console.log(`${name}: No image found`);
      }
    });
  });
});
