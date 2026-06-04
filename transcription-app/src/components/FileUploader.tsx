import React, { useRef } from 'react';

interface FileUploaderProps {
    onFileSelect: (file: File) => void;
    selectedFile: File | null;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, selectedFile }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            onFileSelect(event.target.files[0]);
        }
    };

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault();
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            onFileSelect(event.dataTransfer.files[0]);
        }
    };

    return (
        <div className="card">
            <h5 className="card-title">Upload Audio/Video</h5>
            <p className="item-date mb-3">AV data is processed locally and never stored on our servers.</p>
            <div 
                className="drop-zone"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
            >
                {selectedFile ? (
                    <div style={{ color: 'var(--terra)', fontWeight: 600 }}>
                        <i className="bi bi-file-earmark-check drop-zone-icon"></i>
                        {selectedFile.name}
                    </div>
                ) : (
                    <div style={{ color: 'var(--ink-soft)' }}>
                        <i className="bi bi-cloud-upload drop-zone-icon"></i>
                        Drag and drop or <span style={{ color: 'var(--terra)', fontWeight: 600 }}>click to browse</span>
                    </div>
                )}
            </div>
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="audio/*,video/*" 
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default FileUploader;
