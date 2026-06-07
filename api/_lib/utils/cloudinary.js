let cloudinary;

async function getCloudinary() {
  if (!cloudinary) {
    const mod = await import('cloudinary');
    cloudinary = mod.v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  return cloudinary;
}

export async function getConfig() {
  const c = await getCloudinary();
  return c.config();
}

export async function uploadToCloudinary(buffer, filename) {
  const c = await getCloudinary();
  return new Promise((resolve, reject) => {
    const stream = c.uploader.upload_stream(
      {
        folder: 'aidocument',
        resource_type: 'raw',
        public_id: filename.replace(/\.[^.]+$/, ''),
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });
}
