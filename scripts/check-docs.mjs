import { access, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const docsRoot = path.join(root, "docs");

const requiredDocs = [
  "README.md",
  "project-overview.md",
  "architecture.md",
  "frontend.md",
  "api.md",
  "business-rules.md",
  "conventions.md",
  "testing.md",
  "operations.md",
  "technical-debt.md",
  "adr/README.md",
  "adr/0000-template.md",
  "ai/context-map.md",
  "ai/task-protocol.md"
];

const metadataLabels = [
  "Propósito",
  "Cuándo leer",
  "Alcance",
  "Responsable",
  "Última revisión",
  "Rutas relacionadas"
];

async function collectMarkdown(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await collectMarkdown(absolute)));
    else if (entry.isFile() && entry.name.endsWith(".md")) files.push(absolute);
  }
  return files;
}

async function exists(target) {
  try {
    await access(target);
    return true;
  } catch {
    return false;
  }
}

const errors = [];

for (const relative of requiredDocs) {
  const absolute = path.join(docsRoot, relative);
  if (!(await exists(absolute))) errors.push(`Falta documento obligatorio: docs/${relative}`);
}

const markdownFiles = [
  path.join(root, "README.md"),
  path.join(root, "AGENTS.md"),
  path.join(root, "CLAUDE.md"),
  path.join(root, "apps", "web", "README.md"),
  path.join(root, "apps", "api", "README.md"),
  ...(await collectMarkdown(docsRoot))
];

for (const file of markdownFiles) {
  const source = await readFile(file, "utf8");
  const label = path.relative(root, file).replaceAll("\\", "/");

  if (file.startsWith(`${docsRoot}${path.sep}`)) {
    for (const metadata of metadataLabels) {
      if (!source.includes(`**${metadata}:**`)) {
        errors.push(`${label}: falta metadato "${metadata}"`);
      }
    }
  }

  for (const match of source.matchAll(/!?(?:\[[^\]]*\])\(([^)]+)\)/g)) {
    let target = match[1].trim();
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1);
    if (/^(?:https?:|mailto:|#)/i.test(target)) continue;

    target = target.split("#", 1)[0].split("?", 1)[0];
    if (!target) continue;

    const decoded = decodeURIComponent(target);
    const absolute = path.resolve(path.dirname(file), decoded);
    if (!(await exists(absolute))) errors.push(`${label}: enlace roto -> ${target}`);
  }
}

if (errors.length > 0) {
  console.error("La documentación no es válida:\n");
  for (const error of errors) console.error(`- ${error}`);
  process.exitCode = 1;
} else {
  console.log(`Documentación válida: ${markdownFiles.length} archivos revisados.`);
}
