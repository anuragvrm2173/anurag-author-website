import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "src/assets/images");
const OUTPUT_DIR = path.join(ROOT, "public/images/optimized");
const TARGET_WIDTHS = [400, 800, 1200];
const SOURCE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png"]);

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return walk(fullPath);
      }
      return [fullPath];
    })
  );
  return files.flat();
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function optimizeFile(filePath) {
  const relative = path.relative(SOURCE_DIR, filePath);
  const parsed = path.parse(relative);
  const outputSubDir = path.join(OUTPUT_DIR, parsed.dir);
  await ensureDir(outputSubDir);

  const image = sharp(filePath, { failOn: "none" });

  for (const width of TARGET_WIDTHS) {
    const webpPath = path.join(outputSubDir, `${parsed.name}-${width}.webp`);
    const avifPath = path.join(outputSubDir, `${parsed.name}-${width}.avif`);

    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(webpPath);

    await image
      .clone()
      .resize({ width, withoutEnlargement: true })
      .avif({ quality: 50 })
      .toFile(avifPath);
  }
}

async function main() {
  await ensureDir(OUTPUT_DIR);
  const allFiles = await walk(SOURCE_DIR);
  const imageFiles = allFiles.filter((file) => SOURCE_EXTENSIONS.has(path.extname(file).toLowerCase()));

  if (imageFiles.length === 0) {
    console.log("No JPG/JPEG/PNG files found.");
    return;
  }

  for (const filePath of imageFiles) {
    await optimizeFile(filePath);
    console.log(`Optimized: ${path.relative(ROOT, filePath)}`);
  }

  console.log(`Done. Generated optimized variants in ${path.relative(ROOT, OUTPUT_DIR)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
