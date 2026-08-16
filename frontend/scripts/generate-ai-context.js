import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ścieżki bazowe wyciągnięte na podstawie struktury Monorepo
const BACKEND_SRC_DIR = path.resolve(__dirname, '../../backend/src/main/java/com/home/finance_tracker');
const FRONTEND_SRC_DIR = path.resolve(__dirname, '../src');
const OUTPUT_FILE = path.resolve(__dirname, '../../MONOREPO_CONTEXT_MIN.md'); // Plik wynikowy w głównym katalogu repozytorium

// Kompresja kodu TypeScript / React
function compressFrontendCode(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Usuń komentarze
    .replace(/^import\s+.*from\s+['"].*['"];?\s*$/gm, '') // Usuń importy
    .replace(/^\s*[\r\n]/gm, '') // Usuń puste linie
    .trim();
}

// Kompresja kodu Java (Spring)
function compressBackendCode(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '') // Usuń komentarze
    .replace(/^(package|import)\s+.*;?\s*$/gm, '') // Usuń pakiety i importy
    .replace(/^\s*[\r\n]/gm, '') // Usuń puste linie
    .trim();
}

function generateMonorepoContext() {
  console.log('⚡ Generowanie zoptymalizowanego kontekstu Monorepo (odchudzanie tokenów)...');
  
  let content = `# PEŁNY KONTEKST APLIKACJI (MONOREPO)\n
Zapisz mi tylko nowe/edytowane pliki z systemu wraz z pathem.
Jeśli update wymaga zmian na backendzie i frontendzie, zapisz to spójnie. Jeśli jest coś do zrobienia na BE to zaczynamy od tego co jest todo na backendzie.\n\n`;

  // --- SEKCJA 1: BACKEND ---
  content += `## 1. BACKEND (Controllers, DTOs, Entities)\n\n`;
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
        const isTargetFolder = pathParts.some(part => ALLOWED_BACKEND_FOLDERS.includes(part));

        if (isTargetFolder) {
          const relativePath = path.relative(BACKEND_SRC_DIR, filePath);
          const rawCode = fs.readFileSync(filePath, 'utf-8');
          const compressedCode = compressBackendCode(rawCode);

          content += `### \`backend/src/main/java/.../${relativePath}\`\n\`\`\`java\n${compressedCode}\n\`\`\`\n\n`;
        }
      }
    });
  }

  // --- SEKCJA 2: FRONTEND ---
  content += `## 2. FRONTEND (Komponenty React)\n\n`;

  function scanFrontend(dir) {
    if (!fs.existsSync(dir)) return;
    const list = fs.readdirSync(dir);

    list.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanFrontend(filePath);
      } else if (
        file.endsWith('.tsx') &&
        !file.endsWith('.stories.tsx') &&
        !file.endsWith('.test.tsx')
      ) {
        const relativePath = path.relative(FRONTEND_SRC_DIR, filePath);
        const rawCode = fs.readFileSync(filePath, 'utf-8');
        const compressedCode = compressFrontendCode(rawCode);

        content += `### \`frontend/src/${relativePath}\`\n\`\`\`tsx\n${compressedCode}\n\`\`\`\n\n`;
      }
    });
  }

  // Uruchomienie skanowania obu światów
  scanBackend(BACKEND_SRC_DIR);
  scanFrontend(FRONTEND_SRC_DIR);

  // Zapis do jednego wspólnego pliku tekstowego
  fs.writeFileSync(OUTPUT_FILE, content, 'utf-8');
  console.log(`✅ Gotowe! Skonsolidowany plik zapisano w: ${OUTPUT_FILE}`);
}

generateMonorepoContext();
