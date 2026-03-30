export const uploadToCloudinary = async (file, folder = 'passport_portal') => {
  if (!file) return null;

  try {
    // 1. Get the signature from our backend
    const res = await fetch('/api/cloudinary/sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder }),
    });
    const { signature, timestamp, cloudName, apiKey } = await res.json();

    // 2. Prepare the form data for direct upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('folder', folder);

    // 3. Perform the actual upload to Cloudinary API
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data = await cloudinaryResponse.json();
    if (data.secure_url) {
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Cloudinary upload failed');
    }
  } catch (error) {
    console.error('Frontend Cloudinary Upload Error:', error);
    throw error;
  }
};
