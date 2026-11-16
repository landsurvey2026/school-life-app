// 안드로이드 프로젝트를 만들고 아이콘·알림 아이콘·서명 설정을 적용합니다.
import { execSync } from "node:child_process";
import fs from "node:fs";
const run = (c) => execSync(c, { stdio: "inherit" });
if (!fs.existsSync("android")) run("npx cap add android");
fs.cpSync("native/res", "android/app/src/main/res", { recursive: true });
fs.copyFileSync("native/school-life.jks", "android/app/school-life.jks");
const p = "android/app/build.gradle";
let s = fs.readFileSync(p, "utf8");
if (!s.includes("signingConfigs")) {
  s = s.replace("    buildTypes {\n        release {\n", `    signingConfigs {
        family {
            storeFile file('school-life.jks')
            storePassword 'schoollife2027'
            keyAlias 'schoollife'
            keyPassword 'schoollife2027'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.family
`);
  s = s.replace(/versionCode \d+/, 'versionCode = Integer.parseInt(System.getenv("VERSION_CODE") ?: "1")')
       .replace(/versionName "[^"]*"/, 'versionName = "1.0." + (System.getenv("VERSION_CODE") ?: "1")');
  fs.writeFileSync(p, s);
}
if (!s.includes("signingConfigs.family")) throw new Error("build.gradle 서명 설정 적용 실패");
run("npx cap sync android");
console.log("안드로이드 프로젝트 준비 완료");
