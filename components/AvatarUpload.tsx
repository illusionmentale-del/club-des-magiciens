"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { Camera, Upload, X, Check, ZoomIn, Loader2 } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import Cropper from "react-easy-crop";

// --- Utility: Get Cropped Image ---
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    // Output size: 400x400 for high quality avatars
    const elementSize = 400;

    canvas.width = elementSize;
    canvas.height = elementSize;

    // Build the image in the canvas (resizing/cropping)
    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        elementSize,
        elementSize
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas is empty"));
        }, "image/jpeg", 0.9);
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

export default function AvatarUpload({
    currentAvatarUrl,
    theme,
    onUpload
}: {
    currentAvatarUrl?: string | null,
    theme: 'light' | 'dark',
    onUpload: (url: string) => void
}) {
    const [preview, setPreview] = useState<string | null>(currentAvatarUrl || null);
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
            const croppedFile = new File([croppedBlob], "avatar.jpg", { type: "image/jpeg" });

            const fileExt = "jpg";
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from("avatars")
                .upload(filePath, croppedFile);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from("avatars")
                .getPublicUrl(filePath);

            setPreview(publicUrl);
            onUpload(publicUrl);
            setIsCropping(false);
            setImageSrc(null);
        } catch (error) {
            console.error("Error uploading avatar:", error);
            alert("Erreur lors de l'upload de l'image.");
        } finally {
            setUploading(false);
        }
    };

    // Default Avatars (unchanged)
    const defaultAvatars = [
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23FFD1DC"/><path d="M30 60h40v30H30z" fill="%23333"/><path d="M20 85h60v5H20z" fill="%23333"/><circle cx="50" cy="60" r="15" fill="%23FFF"/><path d="M40 30c-5-15-15-15-15 0s10 20 15 0zM60 30c5-15 15-15 15 0s-10 20-15 0z" fill="%23FFF"/></svg>`,
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23E0F7FA"/><path d="M30 70L70 30" stroke="%23333" stroke-width="5"/><path d="M70 30l5 5m-5-5l-5-5m0 5l5-5m-5 5l5 5" stroke="%23FFD700" stroke-width="3"/></svg>`,
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23FFF9C4"/><rect x="30" y="30" width="30" height="45" rx="2" fill="%23FFF" stroke="%23333"/><rect x="40" y="30" width="30" height="45" rx="2" fill="%23FFCCCB" stroke="%23333" transform="rotate(15 55 52.5)"/></svg>`,
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23E1BEE7"/><path d="M30 50c0-10 10-20 20-20s20 10 20 20-10 10-20 10-20-10-20-10z" fill="%23FFF"/><circle cx="60" cy="45" r="2" fill="%23333"/></svg>`,
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23FFF176"/><path d="M50 20l10 30h30l-25 20 10 30-25-20-25 20 10-30-25-20h30z" fill="%23FDD835"/></svg>`,
        `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%23D1C4E9"/><rect x="35" y="40" width="30" height="40" fill="%234527A0"/><rect x="25" y="75" width="50" height="5" fill="%234527A0"/><text x="50" y="65" font-size="20" text-anchor="middle" fill="%23FFF">?</text></svg>`
    ];

    // Modal Content
    const cropModal = isCropping && imageSrc ? (
        <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-white/10 flex justify-between items-center">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Camera className="w-4 h-4 text-purple-400" />
                        Ajuster la photo
                    </h3>
                    <button
                        onClick={() => { setIsCropping(false); setImageSrc(null); }}
                        className="text-gray-400 hover:text-white"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="relative h-80 w-full bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // Square avatar
                        cropShape="round" // Circular mask
                        showGrid={false}
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
                            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                        Valider et Utiliser
                    </button>
                </div>
            </div>
        </div>
    ) : null;

    return (
        <div className="flex flex-col items-center gap-6 relative z-50">
            {/* Render Modal via Portal */}
            {mounted && cropModal && createPortal(cropModal, document.body)}

            <div
                onClick={() => fileInputRef.current?.click()}
                className={`relative w-32 h-32 rounded-full overflow-hidden cursor-pointer group border-4 transition-all ${theme === 'light'
                    ? 'border-purple-100 hover:border-purple-200 shadow-md'
                    : 'border-white/10 hover:border-white/20'
                    }`}
            >
                {preview ? (
                    <Image
                        src={preview}
                        alt="Avatar"
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className={`w-full h-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-white/5 text-gray-500'
                        }`}>
                        <Camera className="w-10 h-10" />
                    </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-8 h-8 text-white" />
                </div>
            </div>

            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className={`text-sm font-medium hover:underline ${theme === 'light' ? 'text-purple-600' : 'text-gray-400'}`}
            >
                {uploading ? "Chargement..." : "Modifier la photo"}
            </button>

            {/* Default Avatars Selection */}
            {theme === 'light' && (
                <div className="w-full">
                    <p className="text-sm font-bold text-gray-500 mb-3 text-center">Ou choisis ton personnage :</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        {defaultAvatars.map((avatar, index) => (
                            <button
                                key={index}
                                type="button"
                                onClick={() => {
                                    setPreview(avatar);
                                    onUpload(avatar);
                                }}
                                className="w-12 h-12 rounded-full border-2 border-transparent hover:border-purple-500 hover:scale-110 transition-all overflow-hidden relative shadow-sm"
                            >
                                <Image src={avatar} alt={`Avatar ${index}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
