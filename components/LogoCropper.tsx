"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import Cropper from "react-easy-crop";
import { Loader2, Upload, ZoomIn, Check, X, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import "react-easy-crop/react-easy-crop.css";
import { useDropzone } from "react-dropzone";
import heic2any from "heic2any";
import Image from "next/image";

// --- Utility: Get Cropped & Compressed Image ---
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    const targetWidth = 400;
    const targetHeight = 400;

    canvas.width = targetWidth;
    canvas.height = targetHeight;

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
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas is empty"));
        }, "image/png", 0.9);
    });
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new globalThis.Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

export function LogoCropper({
    currentLogoUrl,
    onUpload
}: {
    currentLogoUrl?: string | null,
    onUpload: (url: string) => void
}) {
    const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [isConverting, setIsConverting] = useState(false);

    // Cropper State
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);

    const supabase = createClient();

    useEffect(() => {
        setMounted(true);
    }, []);

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        setIsConverting(true);
        try {
            let file = acceptedFiles[0];

            if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: "image/jpeg",
                    quality: 0.8
                });
                
                const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
                file = new File([blob], file.name.replace(/\.heic$/i, ".jpg"), { type: "image/jpeg" });
            }

            const objectUrl = URL.createObjectURL(file);
            setImageSrc(objectUrl);
            setIsCropping(true);
        } catch (err) {
            console.error("Error processing file", err);
            alert("Erreur lors de la lecture ou conversion de l'image.");
        } finally {
            setIsConverting(false);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.heic']
        },
        multiple: false
    });

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "logo.png", { type: "image/png" });

            const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(7)}.png`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
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
            console.error("Error uploading logo:", error);
            alert("Erreur lors de l'upload.");
        } finally {
            setUploading(false);
        }
    };

    const cropModal = isCropping && imageSrc ? (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-brand-gold" />
                        Cadrage du Logo
                    </h3>
                    <button
                        onClick={() => { setIsCropping(false); setImageSrc(null); }}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative h-[300px] w-full bg-neutral-950">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                    />
                </div>

                <div className="p-6 space-y-6">
                    <div className="flex items-center gap-4">
                        <ZoomIn className="w-4 h-4 text-gray-400" />
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-brand-gold"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-3 bg-brand-gold text-neutral-900 font-bold rounded-xl hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        Valider
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="space-y-3">
            {mounted && cropModal && createPortal(cropModal, document.body)}

            <label className="block text-brand-text-muted text-xs font-bold uppercase tracking-wider">Logo Boutique</label>

            <div
                {...getRootProps()}
                className={`relative aspect-square w-32 border-2 border-dashed rounded-xl overflow-hidden cursor-pointer transition-all flex items-center justify-center ${
                    isDragActive ? 'border-brand-gold/80 bg-brand-gold/10 scale-105' : preview ? 'border-brand-gold/40' : 'border-white/10 hover:border-brand-gold/50'
                }`}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Logo preview"
                            fill
                            className={`object-contain p-2 ${isDragActive ? 'opacity-50' : 'group-hover:scale-105 transition-transform'}`}
                        />
                        <div className={`absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 backdrop-blur-sm transition-opacity ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {isConverting ? (
                                <Loader2 className="w-6 h-6 animate-spin text-white" />
                            ) : (
                                <Upload className={`w-6 h-6 text-white ${isDragActive ? 'animate-bounce' : ''}`} />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500">
                        <Upload className={`w-6 h-6 transition-colors ${isDragActive ? 'text-brand-gold animate-bounce' : 'group-hover:text-brand-gold'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-center px-2">
                            {isDragActive ? "Déposer..." : "Uploader"}
                        </span>
                    </div>
                )}

                {(uploading || isConverting) && (
                    <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    </div>
                )}
            </div>
        </div>
    );
}
