import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (fileUri, folder = 'passport_portal') => {
  if (!fileUri) return null;
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      folder,
      resource_type: 'auto',
    });
    return res.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Cloudinary upload failed');
  }
};

export default cloudinary;
