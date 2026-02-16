import { useState, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PropertyImageUploadProps {
  userId: string;
  images: string[];
  onChange: (images: string[]) => void;
}

const PropertyImageUpload = ({ userId, images, onChange }: PropertyImageUploadProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    const fileExt = file.name.split(".").pop();
    const filePath = `${userId}/${crypto.randomUUID()}.${fileExt}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(filePath, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const newUrls: string[] = [];
      for (const file of Array.from(files)) {
        if (file.size > 5 * 1024 * 1024) {
          toast({ title: "File too large", description: `${file.name} exceeds 5MB limit`, variant: "destructive" });
          continue;
        }
        const url = await uploadFile(file);
        newUrls.push(url);
      }
      onChange([...images, ...newUrls]);
      toast({ title: `${newUrls.length} image(s) uploaded` });
    } catch (error: any) {
      toast({ title: "Upload failed", description: error.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <Label>Property Images</Label>
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, i) => (
            <div key={i} className="relative group aspect-video rounded-md overflow-hidden border border-border">
              <img src={url} alt={`Property ${i + 1}`} className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div>
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {uploading ? "Uploading..." : "Upload Images"}
        </Button>
      </div>
    </div>
  );
};

export default PropertyImageUpload;
