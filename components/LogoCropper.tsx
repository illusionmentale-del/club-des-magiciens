"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { uploadLogo } from "@/app/admin/actions";
import { Loader2, Upload, Scissors, Save } from "lucide-react";
import { useRouter } from "next/navigation";

// Pixel crop helper
async function getCroppedImg(imageSrc: string, pixelCrop: any): Promise<Blob> {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("No 2d context");

    // Set max size to 512x512 to prevent payload too large errors
    const maxSize = 512;
    const scale = Math.min(1, maxSize / pixelCrop.width, maxSize / pixelCrop.height);

    canvas.width = pixelCrop.width * scale;
    canvas.height = pixelCrop.height * scale;

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        canvas.width,
        canvas.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas is empty"));
        }, "image/png"); // PNG for transparency
    });
}

const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

export function LogoCropper({ currentLogo }: { currentLogo?: string }) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const imageDataUrl = await readFile(file);
            setImageSrc(imageDataUrl as string);
        }
    };

    const readFile = (file: File) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result), false);
            reader.readAsDataURL(file);
        });
    };

    const handleUpload = async () => {
        if (!imageSrc || !croppedAreaPixels) return;
        setLoading(true);

        try {
            const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
            const formData = new FormData();
            formData.append("logo_file", croppedBlob, "logo.png");

            const result = await uploadLogo(formData);

            if (result?.error) {
                throw new Error(result.error);
            }

            setImageSrc(null); // Reset
            router.refresh();
        } catch (e: any) {
            console.error("Upload failed", e);
            alert(`Erreur lors de l'upload: ${e.message || "Erreur inconnue"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/5 p-6 rounded-xl border border-white/10">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                <Scissors className="w-5 h-5 text-magic-purple" />
                Recadrer & Uploader le Logo
            </h3>

            {!imageSrc ? (
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/20 rounded-xl p-8 hover:bg-white/5 transition-colors cursor-pointer relative">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-gray-400 text-sm">Cliquez pour choisir une image</p>
                    {currentLogo && (
                        <div className="mt-4">
                            <p className="text-xs text-gray-500 mb-2">Logo actuel :</p>
                            <img src={currentLogo} className="h-12 w-auto object-contain mx-auto" />
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="relative h-64 w-full bg-black rounded-xl overflow-hidden">
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1} // Square aspect ratio typically better for logos
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-400">Zoom</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-full accent-magic-purple"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setImageSrc(null)}
                            className="flex-1 py-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 transition-colors"
                        >
                            Annuler
                        </button>
                        <button
                            onClick={handleUpload}
                            disabled={loading}
                            className="flex-1 py-2 rounded-lg bg-magic-purple hover:bg-magic-purple/80 text-white font-bold transition-colors flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Valider & Sauvegarder
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
