async function generateSha1(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest('SHA-1', msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

export async function uploadToCloudinary(
  file: File,
  folder: string
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName) {
    throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable is not defined')
  }

  const timestamp = Math.floor(Date.now() / 1000).toString()
  const formData = new FormData()
  formData.append('file', file)

  if (apiKey && apiSecret) {
    // Parameters must be sorted alphabetically: folder, then timestamp
    const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`
    const signature = await generateSha1(signaturePayload)

    formData.append('api_key', apiKey)
    formData.append('timestamp', timestamp)
    formData.append('folder', folder)
    formData.append('signature', signature)
  } else {
    const uploadPreset =
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'sang_penjaga_unsigned'
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', folder)
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: formData,
    }
  )

  const data = await response.json()

  if (!response.ok) {
    throw new Error(
      data.error?.message || 'Failed to upload image to Cloudinary'
    )
  }

  return {
    url: (data.secure_url || data.url) as string,
    publicId: data.public_id as string,
    width: data.width as number,
    height: data.height as number,
  }
}
