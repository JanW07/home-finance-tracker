import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import execSync from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '../../');

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.log('❌ Podaj nazwy plików lub fragmenty nazw, np.: npm run get-code UserController useAuth');
  process.exit(1);
}

function findAndDumpFiles(dir, results = []) {
  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('target')) {
        findAndDumpFiles(filePath, results);
      }
    } else {
      const fileName = path.basename(filePath);
      const matches = targets.some((target) => fileName.toLowerCase().includes(target.toLowerCase()));

      if (matches) {
        const relativePath = path.relative(ROOT_DIR, filePath);
        const code = fs.readFileSync(filePath, 'utf-8');
        results.push(`### \`${relativePath}\`\n\`\`\`\n${code}\n\`\`\``);
      }
    }
  });

  return results;
}

const matchedBlocks = findAndDumpFiles(ROOT_DIR);

if (matchedBlocks.length === 0) {
  console.log('❌ Nie znaleziono pasujących plików.');
} else {
  const output = matchedBlocks.join('\n\n');
  
  // Zapisz do tymczasowego pliku
  const tempFile = path.join(ROOT_DIR, 'FETCHED_CODE.md');
  fs.writeFileSync(tempFile, output, 'utf-8');
  
  console.log(`✅ Pomyślnie znaleziono ${matchedBlocks.length} plik(ów) i zapisano w FETCHED_CODE.md!`);
  console.log(`💡 Możesz po prostu przekleić zawartość pliku FETCHED_CODE.md do AI.`);
}