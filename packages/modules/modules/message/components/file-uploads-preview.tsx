import React from 'react';
import {FileText, X} from "lucide-react";

interface FileUploadsPreviewProps {
    selectedFiles: {
        id: string;
        name: string;
        size: number;
        type: string;
        url: string;
        storagePath?: string;
    }[];
    setSelectedFiles: React.Dispatch<React.SetStateAction<{
        id: string;
        name: string;
        size: number;
        type: string;
        url: string;
        storagePath?: string;
    }[]>>;
}

const FileUploadsPreview = ({ selectedFiles, setSelectedFiles }: FileUploadsPreviewProps) => {

    return (
        selectedFiles.length > 0 && (
            <div className="flex flex-wrap gap-2 animate-in slide-in-from-bottom-1 duration-150">
                {selectedFiles.map((file, idx) => (
                    <div key={file.id} className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl p-2 pr-3 text-xs">
                        {file.type.startsWith("image/") ? (
                            <img src={file.url} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100" />
                        ) : (
                            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </div>
                        )}
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-gray-700 truncate max-w-[120px]">{file.name}</p>
                            <p className="text-[10px] text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                            className="p-1 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded-full"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}
            </div>
        )
    );
};

export default FileUploadsPreview;