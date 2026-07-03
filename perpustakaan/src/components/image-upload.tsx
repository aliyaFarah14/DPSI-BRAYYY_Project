import { useState, useRef, useCallback } from "react"
import { ImagePlus, Trash2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { MAX_IMAGE_SIZE_BYTES, ALLOWED_IMAGE_TYPES } from "@/lib/constants"

interface ImageUploadProps {
  value?: string
  onChange: (base64: string | undefined) => void
  error?: string
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(async (file: File) => {
    setLocalError(null)
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setLocalError("Format file tidak didukung. Gunakan JPG atau PNG.")
      return
    }
    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      setLocalError("Ukuran file melebihi 2MB. Pilih file yang lebih kecil.")
      return
    }
    setUploading(true)
    await new Promise((r) => setTimeout(r, 300))
    const reader = new FileReader()
    reader.onload = () => {
      onChange(reader.result as string)
      setUploading(false)
    }
    reader.onerror = () => {
      setLocalError("Gagal membaca file.")
      setUploading(false)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const handleRemove = () => {
    onChange(undefined)
    setLocalError(null)
    if (inputRef.current) inputRef.current.value = ""
  }

  const displayError = error || localError

  return (
    <div className="space-y-1">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !value && !uploading && inputRef.current?.click()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-150",
          "aspect-[3/4] max-w-[220px]",
          dragOver ? "border-primary bg-primary-light" : "border-border bg-white hover:border-primary/50 hover:bg-primary-light/30",
          value ? "cursor-default" : "cursor-pointer",
          displayError ? "border-destructive" : "",
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="text-xs text-muted-foreground">Memproses...</span>
          </div>
        ) : value ? (
          <>
            <img
              src={value}
              alt="Sampul buku"
              className="h-full w-full rounded-xl object-cover"
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove() }}
              className="absolute right-1.5 top-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100 focus:opacity-100"
              aria-label="Hapus gambar"
            >
              <Trash2 size={14} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 px-4 text-center">
            <ImagePlus size={24} className={dragOver ? "text-primary" : "text-muted"} />
            <p className="text-xs text-muted-foreground">
              Klik atau seret gambar sampul ke sini
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              Format JPG/PNG, maksimal 2MB
            </p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={handleInput}
        className="hidden"
      />
      {displayError && (
        <p className="text-xs text-destructive font-medium">{displayError}</p>
      )}
    </div>
  )
}
