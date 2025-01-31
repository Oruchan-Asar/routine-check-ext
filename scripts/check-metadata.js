import https from "https";
import http from "http";
import fs from "fs";
import path from "path";

async function checkUrl(url) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith("https");
    const client = isHttps ? https : http;

    console.log("\nChecking metadata for:", url);
    console.log("------------------------");

    client
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // Check all meta tags
          console.log("\nAll Meta Tags:");
          console.log("-------------");
          const allMetaTags = data.match(/<meta[^>]*>/g);
          if (allMetaTags) {
            allMetaTags.forEach((tag) => {
              if (
                tag.includes('property="og:') ||
                tag.includes('name="og:') ||
                tag.includes('property="twitter:') ||
                tag.includes('name="twitter:') ||
                tag.includes('name="description') ||
                tag.includes('name="title')
              ) {
                console.log(tag);
              }
            });
          } else {
            console.log("No meta tags found!");
          }

          // Check title
          console.log("\nTitle Tag:");
          console.log("----------");
          const titleMatch = data.match(/<title[^>]*>(.*?)<\/title>/);
          if (titleMatch) {
            console.log(titleMatch[0]);
          } else {
            console.log("No title tag found!");
          }

          // Check if Next.js metadata is present
          console.log("\nNext.js Metadata Check:");
          console.log("----------------------");
          const hasNextData = data.includes("__NEXT_DATA__");
          console.log(
            hasNextData ? "✅ Next.js data found" : "❌ No Next.js data found"
          );

          resolve();
        });
      })
      .on("error", () => {
        console.log(`Could not connect to ${url}`);
        reject(new Error(`Could not connect to ${url}`));
      });
  });
}

// Check if images exist
function checkImages() {
  console.log("\nChecking Images:");
  console.log("---------------");
  const imagePaths = [
    path.join(process.cwd(), "public", "images", "opengraph-image.png"),
    path.join(process.cwd(), "public", "images", "twitter-image.png"),
  ];

  imagePaths.forEach((imagePath) => {
    if (fs.existsSync(imagePath)) {
      const stats = fs.statSync(imagePath);
      const sizeInKB = (stats.size / 1024).toFixed(2);
      console.log(`✅ ${path.basename(imagePath)} exists (${sizeInKB} KB)`);

      // Check image dimensions (recommended sizes)
      if (path.basename(imagePath) === "opengraph-image.png") {
        console.log(`   Recommended size for OpenGraph: 1200x630 pixels`);
      } else if (path.basename(imagePath) === "twitter-image.png") {
        console.log(
          `   Recommended size for Twitter: 1200x630 pixels (large card)`
        );
        console.log(`   Current size: 128x128 pixels (summary card)`);
      }
    } else {
      console.log(`❌ ${path.basename(imagePath)} not found!`);
    }
  });
}

async function main() {
  console.log("🔍 Metadata Checker");
  console.log("==================");

  // Check production URL
  try {
    await checkUrl("https://www.routinest.com");
  } catch {
    console.log("Could not check production URL, trying localhost...");
  }

  // Check localhost
  try {
    await checkUrl("http://localhost:3000");
  } catch {
    console.log(
      "Could not check localhost. Make sure your development server is running (npm run dev)"
    );
  }

  // Check images
  checkImages();

  console.log("\nRecommendations:");
  console.log("--------------");
  console.log("1. Make sure your app/metadata.ts file is properly configured");
  console.log("2. Verify that your layout files are not using 'use client'");
  console.log(
    "3. Check that your page components are server components where metadata is needed"
  );
  console.log("4. Run 'npm run build' to verify metadata generation");
}

main();
