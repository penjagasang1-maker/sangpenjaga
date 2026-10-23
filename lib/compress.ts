/**
 * Client-side image compression utility using HTML5 Canvas.
 * Compresses images before uploading to Cloudinary to save bandwidth and storage.
 */

export interface CompressOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  outputFormat?: 'image/webp' | 'image/jpeg'
}

export async function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<{ file: File; originalSize: number; compressedSize: number; savedPercent: number }> {
  // If file is SVG or GIF (animated), skip compression
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      savedPercent: 0,
    }
  }

  const {
    maxWidth = 1440,
    maxHeight = 2560,
    quality = 0.82,
    outputFormat = 'image/webp',
  } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()

      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio resizing
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          return resolve({
            file,
            originalSize: file.size,
            compressedSize: file.size,
            savedPercent: 0,
          })
        }

        // Enable high quality image smoothing
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              return resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                savedPercent: 0,
              })
            }

            // Only use compressed if it actually reduced size
            if (blob.size < file.size) {
              const ext = outputFormat === 'image/webp' ? '.webp' : '.jpg'
              const baseName = file.name.substring(0, file.name.lastIndexOf('.')) || file.name
              const compressedFile = new File([blob], `${baseName}${ext}`, {
                type: outputFormat,
                lastModified: Date.now(),
              })

              const saved = Math.round(((file.size - blob.size) / file.size) * 100)

              console.log(
                `[AutoCompress] ${file.name}: ${(file.size / 1024).toFixed(1)}KB -> ${(
                  blob.size / 1024
                ).toFixed(1)}KB (Hemat ${saved}%)`
              )

              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: blob.size,
                savedPercent: saved,
              })
            } else {
              // Original was already smaller, keep original
              resolve({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                savedPercent: 0,
              })
            }
          },
          outputFormat,
          quality
        )
      }

      img.onerror = () => {
        // Fallback to original file on load error
        resolve({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          savedPercent: 0,
        })
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Gagal membaca file gambar'))
    reader.readAsDataURL(file)
  })
}
