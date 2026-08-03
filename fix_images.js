const fs = require('fs');

const missing = [
  { id: 'suresh-bhardwaj', url: 'https://i.pravatar.cc/300?u=suresh-bhardwaj' },
  { id: 'harish-janartha', url: 'https://i.pravatar.cc/300?u=harish-janartha' },
  { id: 'mohan-lal-brakta', url: 'https://i.pravatar.cc/300?u=mohan-lal-brakta' },
  { id: 'sanjay-chauhan', url: 'https://i.pravatar.cc/300?u=sanjay-chauhan' },
  { id: 'surinder-chauhan', url: 'https://i.pravatar.cc/300?u=surinder-chauhan' },
  { id: 'jp-nadda', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e0/J.P._Nadda_2024.jpg/500px-J.P._Nadda_2024.jpg' },
  { id: 'sanjay-sood', url: 'https://i.pravatar.cc/300?u=sanjay-sood' },
  { id: 'prem-kumar', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Prem_Kumar_Dhumal_2011.jpg/500px-Prem_Kumar_Dhumal_2011.jpg' }
];

let file = fs.readFileSync('/Users/saravpreetsinghpruthi/Neta-Samachar/data/politicians.ts', 'utf8');

for (const pol of missing) {
  const regex = new RegExp(`(id:\\s*'${pol.id}',[\\s\\S]*?photoUrl:\\s*)'[^']*'`, 'g');
  file = file.replace(regex, `$1'${pol.url}'`);
}

fs.writeFileSync('/Users/saravpreetsinghpruthi/Neta-Samachar/data/politicians.ts', file);
console.log('Fixed missing images!');
