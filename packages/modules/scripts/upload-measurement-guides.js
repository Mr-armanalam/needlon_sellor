const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

async function uploadAllGuides() {
  console.log("--> Starting Bespoke Measurement Guides Upload to Supabase Bucket...");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Supabase URL or Key not found in environment.");
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const srcDir = path.resolve(__dirname, '../../../packages/client-packages/measurment_image');
  const publicDestDir = path.resolve(__dirname, '../../../apps/client/public/images/measurements');

  if (!fs.existsSync(publicDestDir)) {
    fs.mkdirSync(publicDestDir, { recursive: true });
  }

  const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.png'));
  console.log(`Found ${files.length} diagram files in ${srcDir}`);

  const results = {};

  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const destLocalPath = path.join(publicDestDir, file);

    // 1. Copy to local public directory as high-availability offline fallback
    fs.copyFileSync(srcPath, destLocalPath);

    // 2. Upload to Supabase Storage Bucket 'bespoke-measurements'
    const fileBuffer = fs.readFileSync(srcPath);
    const bucketPath = `guides/${file}`;

    const { error } = await supabase.storage
      .from('bespoke-measurements')
      .upload(bucketPath, fileBuffer, {
        contentType: 'image/png',
        upsert: true,
      });

    if (error) {
      console.error(`Error uploading ${file}:`, error.message);
    } else {
      const { data: { publicUrl } } = supabase.storage
        .from('bespoke-measurements')
        .getPublicUrl(bucketPath);
      results[file] = publicUrl;
      console.log(`✓ Uploaded ${file} -> ${publicUrl}`);
    }
  }

  console.log("\n=== Upload Complete ===");
  console.log("Total files processed:", Object.keys(results).length);
  return results;
}

uploadAllGuides().catch(err => {
  console.error("Upload failed:", err);
  process.exit(1);
});
