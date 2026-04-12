"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Upload, X, Check, ZoomIn, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Cropper from "react-easy-crop";
import "react-easy-crop/react-easy-crop.css";
import { useDropzone } from "react-dropzone";

// --- Utility: Get Cropped & Compressed Image ---
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    const targetWidth = 500;
    const targetHeight = 500;

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
        }, "image/png", 1); // For logos we preserve PNG quality and transparency if possible
    });
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new globalThis.Image();
        image.crossOrigin = "anonymous";
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.src = url;
    });

export default function LogoCropper({
    currentLogoUrl,
    onUpload,
    label = "Logo de l'école (Carré 1:1)"
}: {
    currentLogoUrl?: string | null,
    onUpload: (url: string) => void,
    label?: string
}) {
    const [preview, setPreview] = useState<string | null>(currentLogoUrl || null);
    const [uploading, setUploading] = useState(false);
    const [mounted, setMounted] = useState(false);

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

    useEffect(() => {
        if (currentLogoUrl) setPreview(currentLogoUrl);
    }, [currentLogoUrl]);

    const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const cleanupModal = () => {
        setIsCropping(false);
        setImageSrc(null);
    };

    const processFile = (file: File) => {
        if (!file) return;

        try {
            const safeBlob = file.slice(0, file.size, file.type);
            const reader = new FileReader();
            
            reader.onload = () => {
                setImageSrc(reader.result as string);
                setIsCropping(true);
            };
            reader.onerror = () => {
                alert(`Safari a bloqué la lecture de l'image (${reader.error?.message || 'Erreur Inconnue'}).\n\n👉 ACTION REQUISE : Cliquez sur la zone pour sélectionner manuellement le fichier au lieu de faire un glisser-déposer.`);
            };
            reader.readAsDataURL(safeBlob);
        } catch (err: any) {
            console.error("Error processing file", err);
            alert("Erreur critique: " + err.message);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpeg', '.jpg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        multiple: false
    });

    useEffect(() => {
        if (fileRejections.length > 0) {
            alert("Format non supporté ! L'image doit être un fichier JPEG ou PNG valide. (Sur iPhone, prenez la photo depuis l'appellation directe ou désactivez le format Haute Efficacité pour ce site).");
        }
    }, [fileRejections]);

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setUploading(true);

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const croppedFile = new File([croppedBlob], "logo.png", { type: "image/png" });

            const fileExt = "png";
            const fileName = `logos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(fileName, croppedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(fileName);

            setPreview(publicUrl);
            onUpload(publicUrl);
            cleanupModal();
        } catch (error) {
            console.error("Error uploading logo:", error);
            alert("Erreur lors de l'upload du logo.");
        } finally {
            setUploading(false);
        }
    };

    const cropModal = isCropping && imageSrc ? (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-brand-card border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div>
                        <h3 className="text-white font-black uppercase tracking-tighter text-lg flex items-center gap-3">
                            <ImageIcon className="w-5 h-5 text-brand-purple" />
                            Ajuster le logo
                        </h3>
                    </div>
                    <button
                        onClick={cleanupModal}
                        className="text-brand-text-muted hover:text-white p-2 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative h-[400px] w-full bg-black overflow-hidden bg-[url('https://transparenttextures.com/patterns/cubes.png')]">
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

                <div className="p-8 bg-brand-card flex flex-col items-center gap-8">
                    <div className="w-full flex items-center gap-4">
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
                        className="w-full py-4 bg-brand-purple text-white font-black uppercase tracking-widest text-xs rounded-xl hover:bg-brand-purple/90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-brand-purple/20 disabled:opacity-50"
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
                {...getRootProps()}
                className={`group relative w-32 h-32 bg-brand-bg border-2 border-dashed rounded-2xl overflow-hidden cursor-pointer transition-all flex items-center justify-center ${
                    isDragActive ? 'border-brand-purple/80 bg-brand-purple/5' : preview ? 'border-brand-purple/30' : 'border-brand-border hover:border-brand-purple/50'
                }`}
            >
                <input {...getInputProps()} />

                {preview ? (
                    <>
                        <Image
                            src={preview}
                            alt="Logo preview"
                            fill
                            className={`object-contain transition-transform duration-500 ${isDragActive ? 'scale-110 opacity-50' : 'group-hover:scale-105'}`}
                        />
                        <div className={`absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center gap-2 backdrop-blur-sm ${isDragActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            <Upload className="w-8 h-8 text-white animate-bounce" />
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

                {uploading && (
                    <div className="absolute inset-0 bg-neutral-900/80 flex items-center justify-center backdrop-blur-sm">
                        <Loader2 className="w-8 h-8 animate-spin text-brand-gold" />
                    </div>
                )}
            </div>
        </div>
    );
}
