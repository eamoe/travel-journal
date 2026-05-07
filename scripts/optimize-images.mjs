#!/usr/bin/env node
import { mkdir, readdir, stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { extname, join, basename } from "node:path";
import sharp from "sharp";

const SRC_DIR = new URL("../public/images/", import.meta.url).pathname;
const OUT_DIR = join(SRC_DIR, "optimized");
const WIDTHS = [400, 800, 1600];
const FORMATS = [
  { ext: "avif", options: { quality: 50, effort: 4 } },
  { ext: "webp", options: { quality: 78 } },
  { ext: "jpg",  options: { quality: 78, mozjpeg: true } },
];
const SOURCE_EXTS = new Set([".jpg", ".jpeg", ".png"]);

async function isUpToDate(outPath, srcMtimeMs) {
  if (!existsSync(outPath)) return false;
  const s = await stat(outPath);
  return s.mtimeMs >= srcMtimeMs;
}

async function processOne(srcFile) {
  const srcPath = join(SRC_DIR, srcFile);
  const stem = basename(srcFile, extname(srcFile));
  const srcStat = await stat(srcPath);
  const meta = await sharp(srcPath).metadata();
  const intrinsic = meta.width ?? Math.max(...WIDTHS);

  let written = 0;
  let skipped = 0;

  for (const w of WIDTHS) {
    // Cap at intrinsic width — never upscale.
    const targetWidth = Math.min(w, intrinsic);
    for (const { ext, options } of FORMATS) {
      const outName = `${stem}-${w}.${ext}`;
      const outPath = join(OUT_DIR, outName);
      if (await isUpToDate(outPath, srcStat.mtimeMs)) {
        skipped++;
        continue;
      }
      const pipeline = sharp(srcPath).resize({
        width: targetWidth,
        withoutEnlargement: true,
        fit: "inside",
      });
      const formatted =
        ext === "avif" ? pipeline.avif(options) :
        ext === "webp" ? pipeline.webp(options) :
                         pipeline.jpeg(options);
      await formatted.toFile(outPath);
      written++;
    }
  }
  return { written, skipped };
}

async function main() {
  if (!existsSync(SRC_DIR)) {
    console.error(`No source dir: ${SRC_DIR}`);
    process.exit(1);
  }
  await mkdir(OUT_DIR, { recursive: true });

  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  const sources = entries
    .filter((e) => e.isFile() && SOURCE_EXTS.has(extname(e.name).toLowerCase()))
    .map((e) => e.name);

  if (sources.length === 0) {
    console.log("No source images found.");
    return;
  }

  let totalWritten = 0;
  let totalSkipped = 0;
  for (const file of sources) {
    const { written, skipped } = await processOne(file);
    totalWritten += written;
    totalSkipped += skipped;
    if (written > 0) console.log(`✓ ${file}: wrote ${written}, skipped ${skipped}`);
  }
  console.log(`Done. ${totalWritten} variants written, ${totalSkipped} up-to-date.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
