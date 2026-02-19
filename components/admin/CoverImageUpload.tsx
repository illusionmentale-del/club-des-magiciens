"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, Upload, X, Check, ZoomIn, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";

// --- Utility: Get Cropped & Compressed Image ---
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    // Target size for cover images (16:9)
    // 1280x720 is a good balance between quality and performance
    const targetWidth = 1280;
    const targetHeight = 720;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    // Draw the cropped area from the source image into our target canvas
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        targetWidth,
        targetHeight
    );

    return new Promise((resolve, reject) => {
        // Using image/jpeg for better compression, 0.8 quality
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas is empty"));
        }, "image/jpeg", 0.8);
    });
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new globalThis.Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

export default function CoverImageUpload({
    currentImageUrl,
    onUpload,
    label = "Image de couverture",
    aspectRatio = 16 / 9
}: {
    currentImageUrl?: string | null,
    onUpload: (url: string) => void,
    label?: string,
    aspectRatio?: number
}) {
    const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
    }, []);

    // Sync preview when currentImageUrl changes
    useEffect(() => {
        if (currentImageUrl) setPreview(currentImageUrl);
    }, [currentImageUrl]);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setImageSrc(reader.result as string);
                setIsCropping(true);
            });
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "cover.jpg", { type: "image/jpeg" });

            const fileExt = "jpg";
            const fileName = `covers/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars") // Reusing bucket as requested for now
                .upload(fileName, croppedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            setPreview(publicUrl);
            onUpload(publicUrl);
            setIsCropping(false);
            setImageSrc(null);
        } catch (error) {
            console.error("Error uploading cover:", error);
            alert("Erreur lors de l'upload de l'image.");
        } finally {
            setUploading(false);
        }
    };

    const cropModal = isCropping && imageSrc ? (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-brand-card border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-white font-black uppercase tracking-tighter text-lg flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-brand-purple" />
                            Cadrage de l'image
                        </h3>
                        <p className="text-brand-text-muted text-xs uppercase tracking-widest font-bold opacity-60 mt-1">
                            Ajuste l'image pour un rendu optimal (Format 16:9)
                        </p>
                    </div>
                    <button
                        onClick={() => { setIsCropping(false); setImageSrc(null); }}
                        className="text-brand-text-muted hover:text-white p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative h-[400px] min-h-[300px] w-full bg-black overflow-hidden">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspectRatio}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="p-8 bg-brand-card flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1 w-full flex items-center gap-4">
                        <ZoomIn className="w-5 h-5 text-brand-text-muted" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-purple hover:accent-brand-purple/80 transition-all"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full md:w-auto px-10 py-4 bg-brand-purple text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-purple/20 disabled:opacity-50"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        Valider et Compresser
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="space-y-4">
            {mounted && cropModal && createPortal(cropModal, document.body)}

            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider">{label}</label>

            <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`group relative aspect-video bg-brand-bg border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all flex items-center justify-center ${preview ? 'border-brand-purple/30' : 'border-brand-border hover:border-brand-purple/50'
                    }`}
            >
                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm">
                            <Upload className="w-10 h-10 text-white" />
                            <span className="text-white text-xs font-black uppercase tracking-widest">Modifier l'image</span>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-3 text-brand-text-muted transition-colors group-hover:text-brand-purple">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:border-brand-purple/20 group-hover:bg-brand-purple/5 transition-all">
                            <Upload className="w-8 h-8" />
                        </div>
                        <div className="text-center">
                            <span className="text-xs font-black uppercase tracking-widest block">Uploader une image</span>
                            <span className="text-[10px] opacity-40 uppercase tracking-tighter mt-1 block">Format 16:9 recommandé</span>
                        </div>
                    </div>
                )}

                {uploading && (
                    <div className="absolute inset-0 bg-brand-bg/80 backdrop-blur-sm flex flex-col items-center justify-center gap-3 z-10 font-bold text-brand-purple text-xs uppercase tracking-widest">
                        <Loader2 className="w-8 h-8 animate-spin" />
                        Traitement en cours...
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}
