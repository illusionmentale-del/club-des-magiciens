"use client";

import { useState } from "react";
import Papa from "papaparse";
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

type CsvRow = Record<string, string>;

export default function CsvImporter() {
    const [file, setFile] = useState<File | null>(null);
    const [headers, setHeaders] = useState<string[]>([]);
    const [previewData, setPreviewData] = useState<CsvRow[]>([]);
    const [mapping, setMapping] = useState({
        email: "",
        firstName: "",
        lastName: ""
    });

    const [isImporting, setIsImporting] = useState(false);
    const [progress, setProgress] = useState(0);
    const [results, setResults] = useState<{ success: number; errors: number; details: string[] } | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const uploadedFile = e.target.files?.[0];
        if (!uploadedFile) return;

        setFile(uploadedFile);

        Papa.parse<CsvRow>(uploadedFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                if (results.meta.fields) {
                    setHeaders(results.meta.fields);
                    // Auto-detect common French/English headers
                    const autoMapping = { email: "", firstName: "", lastName: "" };
                    results.meta.fields.forEach(h => {
                        const lower = h.toLowerCase();
                        if (lower.includes("email") || lower.includes("e-mail") || lower.includes("adresse e-mail")) autoMapping.email = h;
                        if (lower.includes("prénom") || lower.includes("prenom") || lower.includes("first name")) autoMapping.firstName = h;
                        if (lower.includes("nom") && !lower.includes("prénom") && !lower.includes("prenom") || lower.includes("last name")) autoMapping.lastName = h;
                    });
                    setMapping(autoMapping);
                }
                setPreviewData(results.data.slice(0, 5)); // Preview up to 5 rows
            },
            error: (err) => {
                toast.error("Erreur lors de la lecture du fichier CSV.");
                console.error(err);
            }
        });
    };

    const handleImport = async () => {
        if (!mapping.email || !mapping.firstName) {
            toast.error("Vous devez au moins mapper l'E-mail et le Prénom.");
            return;
        }

        if (!file) return;

        setIsImporting(true);
        setProgress(0);
        setResults(null);

        Papa.parse<CsvRow>(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (parsed) => {
                const totalRows = parsed.data.length;
                let successCount = 0;
                let errorCount = 0;
                const errorDetails: string[] = [];

                // Format data based on mapping
                const usersToImport = parsed.data.map(row => ({
                    email: row[mapping.email]?.trim() || "",
                    firstName: row[mapping.firstName]?.trim() || "",
                    lastName: mapping.lastName ? (row[mapping.lastName]?.trim() || "") : ""
                })).filter(u => u.email && u.firstName); // Skip rows without email or firstname

                if (usersToImport.length === 0) {
                    toast.error("Aucun utilisateur valide trouvé avec ce mapping.");
                    setIsImporting(false);
                    return;
                }

                // Chunk the requests to avoid timeout (e.g. 50 users per request)
                const chunkSize = 50;
                for (let i = 0; i < usersToImport.length; i += chunkSize) {
                    const chunk = usersToImport.slice(i, i + chunkSize);

                    try {
                        const res = await fetch("/api/admin/import-users", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ users: chunk })
                        });

                        const data = await res.json();

                        if (res.ok) {
                            successCount += data.inserted || 0;
                            errorCount += data.errors ? data.errors.length : 0;
                            if (data.errors) {
                                errorDetails.push(...data.errors.map((e: any) => `${e.email}: ${e.message}`));
                            }
                        } else {
                            errorCount += chunk.length;
                            errorDetails.push(`Erreur serveur sur un lot de ${chunk.length} contacts: ${data.error}`);
                        }
                    } catch (err: any) {
                        errorCount += chunk.length;
                        errorDetails.push(`Erreur réseau: ${err.message}`);
                    }

                    setProgress(Math.round(((i + chunk.length) / usersToImport.length) * 100));
                }

                setIsImporting(false);
                setProgress(100);
                setResults({
                    success: successCount,
                    errors: errorCount,
                    details: errorDetails
                });

                if (successCount > 0) {
                    toast.success(`${successCount} contacts importés avec succès !`);
                }
            }
        });
    };

    return (
        <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8">
            {!file && (
                <div className="border-2 border-dashed border-gray-200 rounded-[16px] p-12 text-center hover:bg-gray-50 transition-colors">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="csv-upload"
                    />
                    <label htmlFor="csv-upload" className="cursor-pointer flex flex-col items-center">
                        <div className="w-16 h-16 bg-brand-purple/10 text-brand-purple rounded-full flex items-center justify-center mb-4">
                            <Upload className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Importer un fichier CSV</h3>
                        <p className="text-gray-500 mb-6">Glissez votre export Systeme.io (.csv) ici ou cliquez pour parcourir.</p>
                        <span className="bg-brand-purple text-white px-6 py-2 rounded-full font-bold shadow-sm hover:shadow-md transition-shadow">
                            Sélectionner le fichier
                        </span>
                    </label>
                </div>
            )}

            {file && !isImporting && !results && (
                <div className="space-y-8">
                    {/* File info */}
                    <div className="flex items-center justify-between bg-gray-50 p-4 rounded-[12px] border border-gray-100">
                        <div className="flex items-center gap-4">
                            <FileText className="w-8 h-8 text-brand-purple" />
                            <div>
                                <h4 className="font-bold text-gray-900">{file.name}</h4>
                                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                        </div>
                        <button onClick={() => setFile(null)} className="text-sm text-gray-400 hover:text-red-500">
                            Changer de fichier
                        </button>
                    </div>

                    {/* Mapping */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Associer les colonnes</h3>
                        <p className="text-sm text-gray-500 mb-6">Nous avons besoin de savoir à quelles colonnes de votre fichier correspondent l'E-mail, le Prénom et le Nom.</p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Colonne E-mail *</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:ring-2 focus:ring-brand-purple outline-none"
                                    value={mapping.email}
                                    onChange={e => setMapping({ ...mapping, email: e.target.value })}
                                >
                                    <option value="">Sélectionner...</option>
                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Colonne Prénom *</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:ring-2 focus:ring-brand-purple outline-none"
                                    value={mapping.firstName}
                                    onChange={e => setMapping({ ...mapping, firstName: e.target.value })}
                                >
                                    <option value="">Sélectionner...</option>
                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Colonne Nom (Optionnel)</label>
                                <select
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-[12px] focus:ring-2 focus:ring-brand-purple outline-none"
                                    value={mapping.lastName}
                                    onChange={e => setMapping({ ...mapping, lastName: e.target.value })}
                                >
                                    <option value="">(Aucune)</option>
                                    {headers.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Preview */}
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Aperçu des données</h3>
                        <div className="overflow-x-auto rounded-[12px] border border-gray-200">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3">E-mail ({mapping.email || '?'})</th>
                                        <th className="px-6 py-3">Prénom ({mapping.firstName || '?'})</th>
                                        <th className="px-6 py-3">Nom ({mapping.lastName || '?'})</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {previewData.map((row, i) => (
                                        <tr key={i} className="bg-white border-b hover:bg-gray-50">
                                            <td className="px-6 py-4 font-medium text-gray-900">{mapping.email ? row[mapping.email] : '-'}</td>
                                            <td className="px-6 py-4">{mapping.firstName ? row[mapping.firstName] : '-'}</td>
                                            <td className="px-6 py-4">{mapping.lastName ? row[mapping.lastName] : '-'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex justify-end">
                        <button
                            onClick={handleImport}
                            disabled={!mapping.email || !mapping.firstName}
                            className="bg-brand-purple text-white px-8 py-3 rounded-full font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            Lancer l'importation <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}

            {isImporting && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Loader2 className="w-16 h-16 text-brand-purple animate-spin mb-6" />
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Importation en cours...</h3>
                    <p className="text-gray-500 mb-8 max-w-md">Veuillez ne pas fermer cette page. Nous créons les comptes et envoyons les e-mails d'activation magiques.</p>

                    <div className="w-full max-w-md bg-gray-100 rounded-full h-4 mb-4 overflow-hidden">
                        <div
                            className="bg-brand-purple h-4 rounded-full transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                        </div>
                    </div>
                    <span className="font-bold text-gray-700">{progress}%</span>
                </div>
            )}

            {results && !isImporting && (
                <div className="space-y-6">
                    <div className="text-center p-8 bg-green-50 rounded-[24px] border border-green-100">
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Importation terminée !</h3>
                        <p className="text-green-800 text-lg">
                            <strong>{results.success}</strong> contacts ont été créés avec succès et ont reçu leur e-mail d'activation.
                        </p>
                    </div>

                    {results.errors > 0 && (
                        <div className="bg-red-50 p-6 rounded-[16px] border border-red-100">
                            <div className="flex items-center gap-3 text-red-700 font-bold mb-4">
                                <AlertCircle className="w-6 h-6" />
                                <h4>{results.errors} contacts n'ont pas pu être importés</h4>
                            </div>
                            <div className="max-h-48 overflow-y-auto text-sm text-red-600 space-y-2 bg-white/50 p-4 rounded-[12px] border border-red-100">
                                {results.details.map((err, i) => (
                                    <div key={i}>{err}</div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center pt-8">
                        <button
                            onClick={() => {
                                setFile(null);
                                setResults(null);
                                setProgress(0);
                            }}
                            className="bg-gray-900 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-gray-800 transition-colors"
                        >
                            Faire un autre import
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
