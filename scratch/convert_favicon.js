import sharp from "sharp";
import path from "path";
import fs from "fs";

async function convertFavicon() {
  try {
    const svgPath = path.join(process.cwd(), "public", "favicon.svg");
    const pngPath = path.join(process.cwd(), "public", "favicon.png");

    if (!fs.existsSync(svgPath)) {
      console.error("favicon.svg not found at", svgPath);
      process.exit(1);
    }

    console.log("Converting favicon.svg to favicon.png using sharp...");
    await sharp(svgPath)
      .resize(512, 512)
      .png()
      .toFile(pngPath);

    console.log("Successfully generated public/favicon.png (512x512)!");
    process.exit(0);
  } catch (error) {
    console.error("Conversion failed:", error);
    process.exit(1);
  }
}

convertFavicon();
