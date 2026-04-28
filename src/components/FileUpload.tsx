import { useState, useRef } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FileUploadProps {
  onFileSelect: (file: File, preview: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  multiple?: boolean;
  preview?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = 'image/*',
  maxSize = 5,
  label = 'Upload File',
  multiple = false,
  preview,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(preview || null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const file = files[0];

    // Validation
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }

    if (!file.type.match(accept.replace('/*', ''))) {
      toast.error(`File type not allowed. Accepted: ${accept}`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewUrl(result);
      setSelectedFile(file);
      onFileSelect(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      fileInputRef.current!.files = files;
      handleFileChange({ target: { files } } as any);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:bg-muted/50 transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
        />
        <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
        <p className="font-medium text-foreground">{label}</p>
        <p className="text-sm text-muted-foreground">Drag and drop or click to select</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Max size: {maxSize}MB</p>
      </div>

      {previewUrl && (
        <div className="space-y-3">
          <div className="relative">
            {accept.includes('image') ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg border border-border"
              />
            ) : (
              <div className="w-full h-48 bg-muted rounded-lg border border-border flex items-center justify-center">
                <div className="text-center">
                  <Check className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-foreground">{selectedFile?.name}</p>
                  <p className="text-xs text-muted-foreground">{(selectedFile?.size ?? 0) / 1024}KB</p>
                </div>
              </div>
            )}
            <Button
              size="sm"
              variant="destructive"
              onClick={clearFile}
              className="absolute top-2 right-2"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-green-600 flex items-center gap-2">
            <Check className="h-4 w-4" />
            File selected: {selectedFile?.name}
          </p>
        </div>
      )}
    </div>
  );
}
