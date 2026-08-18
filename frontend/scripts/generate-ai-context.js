import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ustawienie ścieżek bazowych na główne katalogi modułów
const BACKEND_ROOT = path.resolve(__dirname, '../../backend');
const BACKEND_SRC_DIR = path.resolve(BACKEND_ROOT, 'src/main/java/com/home/finance_tracker');
const FRONTEND_ROOT = path.resolve(__dirname, '..');
const FRONTEND_SRC_DIR = path.resolve(FRONTEND_ROOT, 'src');
const OUTPUT_FILE = path.resolve(__dirname, '../../MONOREPO_CONTEXT_MIN.md');

// Ignorowane katalogi (nie trafiają do drzewa plików)
const IGNORED_DIRS = new Set([
  'node_modules', 'target', '.idea', '.vscode', '.git', 'dist', 'build', '.mvn'
]);

// Rozszerzenia i specyficzne nazwy plików dla kontekstu DevOps / Config
const DEVOPS_FILE_EXTENSIONS = new Set(['.xml', '.properties', '.yml', '.yaml', '.json', '.conf', '.env']);
const DEVOPS_EXACT_FILES = new Set(['dockerfile', '.dockerignore', '.gitignore', 'mvnw', 'mvnw.cmd']);

// Walidator plików do spisu treści
function isAllowedInTree(fileName, isBackend) {
  const lowerName = fileName.toLowerCase();

  // Pliki DevOps / Konfiguracyjne
  if (DEVOPS_EXACT_FILES.has(lowerName)) return true;
  const ext = path.extname(lowerName);
  if (DEVOPS_FILE_EXTENSIONS.has(ext)) return true;

  // Kod źródłowy
  if (isBackend) {
    return fileName.endsWith('.java');
  } else {
    return (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) &&
           !fileName.endsWith('.test.tsx') &&
           !fileName.endsWith('.stories.tsx');
  }
}

// Ekstrakcja sygnatur Java
function extractJavaSignatures(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '')
    .replace(/^(package|import)\s+.*;?\s*$/gm, '')
    .replace(/\{[\s\S]*?\}/g, (match) => {
      if (match.includes('class') || match.includes('interface') || match.includes('record') || match.includes('enum')) {
        return match;
      }
      return '{\n  /* ... implementation hidden ... */\n}';
    })
    .replace(/^\s*[\r\n]/gm, '')
    .trim();
}

// Ekstrakcja sygnatur TS/TSX
function extractTypeScriptSignatures(code) {
  const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');
  const typesAndInterfaces = cleanCode.match(/(export\s+(type|interface|enum)\s+[\s\S]*?\{[\s\S]*?\})/g) || [];
  const exportFunctions = cleanCode.match(/(export\s+(const|function)\s+[A-Za-z0-9_]+[\s\S]*?=[\s\S]*?\)=>|\(.*?\)\s*=>|\(.*?\)\s*\{)/g) || [];

  const signatures = [...typesAndInterfaces, ...exportFunctions].join('\n\n');
  return signatures.length > 0
    ? signatures.replace(/^\s*[\r\n]/gm, '').trim()
    : '// Brak wyeksportowanych interfejsów/funkcji w pliku';
}

// Rekurencyjne budowanie drzewa katalogów z filtrowaniem pustych gałęzi
function buildDirectoryTree(dir, prefix = '', isBackend = true) {
  if (!fs.existsSync(dir)) return '';

  const list = fs.readdirSync(dir).filter(item => !IGNORED_DIRS.has(item));
  let tree = '';

  const validEntries = list.filter(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Pokaż katalog tylko jeśli zawiera dozwolone pliki
      return buildDirectoryTree(fullPath, '', isBackend).length > 0;
    }
    return isAllowedInTree(item, isBackend);
  });

  validEntries.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const isLast = index === validEntries.length - 1;
    const pointer = isLast ? '└── ' : '├── ';

    if (stat.isDirectory()) {
      const subtree = buildDirectoryTree(filePath, prefix + (isLast ? '    ' : '│   '), isBackend);
      if (subtree) {
        tree += `${prefix}${pointer}${file}/\n` + subtree;
      }
    } else {
      tree += `${prefix}${pointer}${file}\n`;
    }
  });

  return tree;
}

function generateMonorepoContext() {
  console.log('⚡ Generowanie zoptymalizowanego kontekstu Monorepo z plikami DevOps...');

  let content = `# PEŁNY KONTEKST APLIKACJI (MONOREPO ARCHITECTURE)\n\n`;
  content += `> **Wytyczne dla AI:**\n`;
  content += `> 1. Poniżej znajduje się struktura katalogów oraz wyciągnięte sygnatury z backendu i frontendu.\n`;
  content += `> 2. Jeśli potrzebujesz pełnej logiki biznesowej, użyj polecenia CLI: \`npm run ai:get <NazwaPliku1> <NazwaPliku2>\`.\n\n`;

  // --- SEKCJA 1: SPIS TREŚCI ---
  content += `## 1. SPIS TREŚCI (STRUKTURA PROJEKTU)\n\n`;
  content += `### Backend Architecture (w tym zasoby i DevOps)\n\`\`\`text\nbackend/\n${buildDirectoryTree(BACKEND_ROOT, '', true)}\`\`\`\n\n`;
  content += `### Frontend Architecture (w tym konfigi i DevOps)\n\`\`\`text\nfrontend/\n${buildDirectoryTree(FRONTEND_ROOT, '', false)}\`\`\`\n\n`;

  // --- SEKCJA 2: BACKEND CONTEXT ---
  content += `## 2. BACKEND (Controllers, DTOs, Entities - Sygnatury)\n\n`;
  const ALLOWED_BACKEND_FOLDERS = ['controller', 'dto', 'entity'];

  function scanBackend(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanBackend(filePath);
      } else if (file.endsWith('.java')) {
        const pathParts = filePath.split(path.sep);
        if (pathParts.some(part => ALLOWED_BACKEND_FOLDERS.includes(part))) {
          const relativePath = path.relative(BACKEND_SRC_DIR, filePath);
          const rawCode = fs.readFileSync(filePath, 'utf-8');
          const signatureCode = extractJavaSignatures(rawCode);

          content += `### \`backend/.../${relativePath}\`\n\`\`\`java\n${signatureCode}\n\`\`\`\n\n`;
        }
      }
    });
  }

  // --- SEKCJA 3: FRONTEND CONTEXT ---
  content += `## 3. FRONTEND (Interfejsy, Typy & Props)\n\n`;

  function scanFrontend(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanFrontend(filePath);
      } else if (
        (file.endsWith('.tsx') || file.endsWith('.ts')) &&
        !file.endsWith('.stories.tsx') &&
        !file.endsWith('.test.tsx')
      ) {
        const relativePath = path.relative(FRONTEND_SRC_DIR, filePath);
        const rawCode = fs.readFileSync(filePath, 'utf-8');
        const signatureCode = extractTypeScriptSignatures(rawCode);

        content += `### \`frontend/src/${relativePath}\`\n\`\`\`typescript\n${signatureCode}\n\`\`\`\n\n`;
      }
    });
  }

  scanBackend(BACKEND_SRC_DIR);
  scanFrontend(FRONTEND_SRC_DIR);

  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`✅ Gotowe! Zoptymalizowany plik zapisano w: ${OUTPUT_FILE}`);
}

generateMonorepoContext();