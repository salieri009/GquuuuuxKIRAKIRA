#!/usr/bin/env tsx

/**
 * Three.js 효과 검증 스크립트
 * - 디렉터리: index.ts 필수
 * - 단일 파일: *.ts 직접 지정 (examples/*.ts)
 */

import fs from "fs";
import path from "path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: npm run validate-effect -- <effect-dir-or-file.ts>");
  process.exit(1);
}

const resolved = path.resolve(inputPath);

if (!fs.existsSync(resolved)) {
  console.error(`❌ 경로를 찾을 수 없습니다: ${resolved}`);
  process.exit(1);
}

const stat = fs.statSync(resolved);
let effectRoot: string;
let sourceFile: string;
let isFlatModule = false;

if (stat.isFile()) {
  if (!resolved.endsWith(".ts")) {
    console.error(`❌ TypeScript 파일이 아닙니다: ${resolved}`);
    process.exit(1);
  }
  effectRoot = path.dirname(resolved);
  sourceFile = resolved;
  isFlatModule = true;
} else if (stat.isDirectory()) {
  effectRoot = resolved;
  sourceFile = path.join(effectRoot, "index.ts");
  if (!fs.existsSync(sourceFile)) {
    console.error(`❌ index.ts 파일을 찾을 수 없습니다: ${sourceFile}`);
    console.error("   단일 파일 모듈은 .ts 경로를 직접 지정하세요.");
    process.exit(1);
  }
} else {
  console.error(`❌ 파일 또는 디렉터리가 아닙니다: ${resolved}`);
  process.exit(1);
}

console.log(`🔍 효과 검증 중: ${isFlatModule ? sourceFile : effectRoot}\n`);

const checks = {
  hasIndexFile: fs.existsSync(sourceFile),
  hasPackageJson: fs.existsSync(path.join(effectRoot, "package.json")),
  hasTsConfig: fs.existsSync(path.join(effectRoot, "tsconfig.json")),
  hasReadme: fs.existsSync(path.join(effectRoot, "README.md")),
};

const sourceContent = fs.readFileSync(sourceFile, "utf-8");
const effectImplFile = path.join(effectRoot, "effect.ts");
const implContent =
  !isFlatModule && fs.existsSync(effectImplFile)
    ? fs.readFileSync(effectImplFile, "utf-8")
    : "";
const checkSource = isFlatModule
  ? sourceContent
  : `${sourceContent}\n${implContent}`;
const contentChecks: Record<string, boolean> = {
  hasInit: checkSource.includes("init("),
  hasUpdate: checkSource.includes("update("),
  hasDispose: checkSource.includes("dispose("),
  hasExport: sourceContent.includes("export default"),
  noModuleMetadata: !checkSource.includes("export const metadata"),
};

console.log("📋 파일 구조:");
Object.entries(checks).forEach(([key, value]) => {
  const icon = value ? "✅" : "⚠️";
  const name = key.replace(/([A-Z])/g, " $1").toLowerCase();
  console.log(`  ${icon} ${name}`);
});

if (isFlatModule) {
  console.log(`  ℹ️ flat module: ${path.basename(sourceFile)}`);
}

console.log("\n📋 코드 구조:");
Object.entries(contentChecks).forEach(([key, value]) => {
  const icon = value ? "✅" : "❌";
  const name = key.replace(/([A-Z])/g, " $1").toLowerCase();
  console.log(`  ${icon} ${name}`);
});

const required = [
  "hasInit",
  "hasUpdate",
  "hasDispose",
  "hasExport",
  "noModuleMetadata",
];
const missing = required.filter((key) => !contentChecks[key]);

if (missing.length > 0) {
  console.log(`\n❌ 필수 항목이 누락되었습니다: ${missing.join(", ")}`);
  process.exit(1);
}

console.log("\n✅ 효과 검증 완료!");
