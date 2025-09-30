console.log('Test server is running!');
console.log('Node.js version:', process.version);
console.log('Current directory:', process.cwd());

// Test ES Module import
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('File location:', __filename);
console.log('Directory:', __dirname);

// Test dynamic import
const os = await import('os');
console.log('OS Platform:', os.platform());

console.log('Test completed successfully!');
