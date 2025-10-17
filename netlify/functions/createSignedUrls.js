const { createClient } = require("@supabase/supabase-js");

// Environment variables Netlify se aayenge
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

exports.handler = async (event, context) => {
  // Sirf POST requests allow karein
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { uid, apkFileName, iconFileName } = JSON.parse(event.body);
    if (!uid || !apkFileName || !iconFileName) {
      return { statusCode: 400, body: 'Missing required parameters.' };
    }

    const timestamp = Date.now();
    const apkPath = `apks/${uid}/${timestamp}-${apkFileName}`;
    const iconPath = `icons/${uid}/${timestamp}-${iconFileName}`;

    // Secure, temporary URLs banayein
    const { data: apkSignData, error: apkSignError } = await supabase.storage
      .from("apps")
      .createSignedUploadUrl(apkPath);
    if (apkSignError) throw apkSignError;

    const { data: iconSignData, error: iconSignError } = await supabase.storage
      .from("apps")
      .createSignedUploadUrl(iconPath);
    if (iconSignError) throw iconSignError;
    
    // Public URLs bhi saath mein bhej dein
    const apkUrl = supabase.storage.from("apps").getPublicUrl(apkPath).data.publicUrl;
    const iconUrl = supabase.storage.from("apps").getPublicUrl(iconPath).data.publicUrl;
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        apkSignedUrl: apkSignData.signedUrl,
        iconSignedUrl: iconSignData.signedUrl,
        apkUrl: apkUrl,
        iconUrl: iconUrl,
      }),
    };
  } catch (error) {
    console.error("Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
