import createApp from './app.js';

const host = '127.0.0.1';
const port = 4000;

let app = createApp();

app.listen(port, host);

console.log(`Listening at http://localhost:${port}`);
