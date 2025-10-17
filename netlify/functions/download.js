exports.handler = async (event, context) => {
  // Get the Supabase file URL from the query parameter
  const { fileUrl } = event.queryStringParameters;

  if (!fileUrl) {
    return { statusCode: 400, body: 'Missing fileUrl parameter.' };
  }

  try {
    // Fetch the file from Supabase
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.statusText}`);
    }
    
    // Get the file content as a Buffer
    const fileBuffer = await response.arrayBuffer();

    // Return the file to the user, forcing a download
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/vnd.android.package-archive',
        'Content-Disposition': 'attachment', // This tells the browser to download
      },
      body: Buffer.from(fileBuffer).toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Download Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
