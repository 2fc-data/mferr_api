const bcrypt = require('bcrypt');
const hash = '$2b$10$AmWKLCt.bOEc1ai44TcBz.aUKJ.r1LTW3chIYHmEuSSR3OmCLFFUG';
const passwords = ['marcell', 'marcell123', 'admin', 'password', '123456'];

async function check() {
  for (const pass of passwords) {
    const match = await bcrypt.compare(pass, hash);
    console.log(`Password: ${pass}, Match: ${match}`);
  }
}

check();
