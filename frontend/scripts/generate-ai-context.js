import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ścieżki bazowe na podstawie struktury Monorepo
const BACKEND_SRC_DIR = path.resolve(__dirname, '../../backend/src/main/java/com/home/finance_tracker');
const FRONTEND_SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_FILE = path.resolve(__dirname, '../../MONOREPO_CONTEXT_MIN.md');

// Ekstrakcja sygnatur Java (klasy, rekordy, interfejsy, adnotacje, metody bez ciał)
function extractJavaSignatures(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Usuń komentarze
    .replace(/^(package|import)\s+.*;?\s*$/gm, '') // Usuń pakiety i importy
    .replace(/\{[\s\S]*?\}/g, (match) => {
      // Jeśli deklaracja zawiera klasę/interfejs/rekord/enum, wyciągamy nagłówki/struktury
      if (match.includes('class') || match.includes('interface') || match.includes('record') || match.includes('enum')) {
        return match;
      }
      return '{\n  /* ... implementation hidden ... */\n}';
    })
    .replace(/^\s*[\r\n]/gm, '') // Usuń puste linie
    .trim();
}

// Ekstrakcja sygnatur TS/TSX (interfejsy, typy, enumy, propsy oraz nagłówki funkcji/komponentów)
function extractTypeScriptSignatures(code) {
  const cleanCode = code.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, ''); // Usuń komentarze
  
  // Wyciągnij eksportowane typy, interfejsy, enumy oraz deklaracje komponentów/funkcji
  const typesAndInterfaces = cleanCode.match(/(export\s+(type|interface|enum)\s+[\s\S]*?\{[\s\S]*?\})/g) || [];
  const exportFunctions = cleanCode.match(/(export\s+(const|function)\s+[A-Za-z0-9_]+[\s\S]*?=[\s\S]*?\)=>|\(.*?\)\s*=>|\(.*?\)\s*\{)/g) || [];

  const signatures = [...typesAndInterfaces, ...exportFunctions].join('\n\n');
  
  return signatures.length > 0 
    ? signatures.replace(/^\s*[\r\n]/gm, '').trim()
    : '// Brak wyeksportowanych interfejsów/funkcji w pliku';
}

// Budowanie drzewa katalogów (Spis treści)
function buildDirectoryTree(dir, prefix = '', isBackend = true) {
  if (!fs.existsSync(dir)) return '';
  let tree = '';
  const list = fs.readdirSync(dir);

  list.forEach((file, index) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    const isLast = index === list.length - 1;
    const pointer = isLast ? '└── ' : '├── ';

    if (stat.isDirectory()) {
      tree += `${prefix}${pointer}${file}/\n`;
      tree += buildDirectoryTree(filePath, prefix + (isLast ? '    ' : '│   '), isBackend);
    } else {
      const validExtension = isBackend 
        ? file.endsWith('.java') 
        : (file.endsWith('.tsx') || file.endsWith('.ts')) && !file.endsWith('.test.tsx') && !file.endsWith('.stories.tsx');
      
      if (validExtension) {
        tree += `${prefix}${pointer}${file}\n`;
      }
    }
  });

  return tree;
}

function generateMonorepoContext() {
  console.log('⚡ Generowanie zoptymalizowanego pod tokeny kontekstu Monorepo...');
  
  let content = `# PEŁNY KONTEKST APLIKACJI (MONOREPO ARCHITECTURE)\n\n`;
  content += `> **Wytyczne dla AI:**\n`;
  content += `> 1. Poniżej znajduje się struktura katalogów oraz wyciągnięte sygnatury (typy, DTO, encje, interfejsy i endpointy) z backendu i frontendu.\n`;
  content += `> 2. Jeśli do rozwiązania zadania potrzebujesz pełnej logiki biznesowej konkretnych plików, poproś o nie, używając polecenia CLI: \`npm run ai:get <NazwaPliku1> <NazwaPliku2>\`.\n`;
  content += `> 3. Zapisz tylko nowe/edytowane pliki z systemu wraz ze ścieżką (path). Jeśli zmiana wymaga aktualizacji na BE i FE, zachowaj spójność i zacznij od backendu.\n\n`;

  // --- SEKCJA 1: SPIS TREŚCI (STRUKTURA PROJEKTU) ---
  content += `## 1. SPIS TREŚCI (STRUKTURA PROJEKTU)\n\n`;
  content += `### Backend Architecture\n\`\`\`text\nbackend/src/main/java/...\n${buildDirectoryTree(BACKEND_SRC_DIR, '', true)}\`\`\`\n\n`;
  content += `### Frontend Architecture\n\`\`\`text\nfrontend/src/...\n${buildDirectoryTree(FRONTEND_SRC_DIR, '', false)}\`\`\`\n\n`;

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

  // Skanowanie katalogów
  scanBackend(BACKEND_SRC_DIR);
  scanFrontend(FRONTEND_SRC_DIR);

  // Zapis pliku wyjściowego
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`✅ Gotowe! Zoptymalizowany plik zapisano w: ${OUTPUT_FILE}`);
}

generateMonorepoContext();