import React, { useState } from 'react';
import { UploadCloud, FileText, X, CheckCircle } from 'lucide-react';

const FileUpload = ({ onUploadComplete }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);

    // Handle drag events
    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    // Handle drop
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    // Handle manual selection
    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(Array.from(e.target.files));
        }
    };

    const handleFiles = (newFiles) => {
        // Filter PDFs only for this project
        const pdfs = newFiles.filter(file => file.type === 'application/pdf');
        if (pdfs.length !== newFiles.length) {
            alert("Only PDF files are supported currently.");
        }

        // Simulate upload process
        const fileObjs = pdfs.map(file => ({
            name: file.name,
            size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
            status: 'uploading', // uploading, complete, error
            id: Math.random().toString(36).substr(2, 9)
        }));

        setFiles(prev => [...prev, ...fileObjs]);

        // Simulate progress
        fileObjs.forEach(fileObj => {
            setTimeout(() => {
                setFiles(prev => prev.map(f =>
                    f.id === fileObj.id ? { ...f, status: 'complete' } : f
                ));
                if (onUploadComplete) onUploadComplete(fileObj);
            }, 2000);
        });
    };

    const removeFile = (id) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', width: '100%', margin: '0 auto' }}>
            <h3 style={{ marginBottom: '1rem', textAlign: 'center' }}>Upload Notes</h3>

            {/* Drop Zone */}
            <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                style={{
                    border: `2px dashed ${dragActive ? 'hsl(var(--accent-primary))' : 'hsl(var(--border-color))'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '3rem 2rem',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    backgroundColor: dragActive ? 'rgba(120, 100, 255, 0.05)' : 'transparent',
                    position: 'relative',
                    cursor: 'pointer'
                }}
            >
                <input
                    type="file"
                    multiple
                    accept=".pdf"
                    onChange={handleChange}
                    style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                />

                <div style={{ pointerEvents: 'none' }}>
                    <div style={{
                        background: 'hsl(var(--bg-card))',
                        width: '64px', height: '64px', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 1rem auto'
                    }}>
                        <UploadCloud size={32} color="hsl(var(--accent-primary))" />
                    </div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 500, color: 'hsl(var(--text-primary))' }}>
                        Click to upload or drag and drop
                    </p>
                    <p style={{ fontSize: '0.9rem', color: 'hsl(var(--text-secondary))', marginTop: '0.5rem' }}>
                        PDF files only (Max 10MB)
                    </p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {files.map(file => (
                        <div key={file.id} style={{
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            padding: '0.75rem', background: 'hsl(var(--bg-secondary))',
                            borderRadius: 'var(--radius-sm)', border: '1px solid hsl(var(--border-color))'
                        }}>
                            <FileText size={20} color="hsl(var(--text-secondary))" />
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                                <p style={{ fontSize: '0.95rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {file.name}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'hsl(var(--text-muted))' }}>
                                    <span>{file.size}</span>
                                    {file.status === 'uploading' && <span style={{ color: 'hsl(var(--accent-primary))' }}>Uploading...</span>}
                                    {file.status === 'complete' && <span style={{ color: '#10b981' }}>Ready</span>}
                                </div>
                            </div>

                            {file.status === 'complete' ? (
                                <CheckCircle size={20} color="#10b981" />
                            ) : (
                                <div style={{ width: 16, height: 16, border: '2px solid hsl(var(--text-muted))', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                            )}

                            <button
                                onClick={() => removeFile(file.id)}
                                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 4 }}
                            >
                                <X size={16} color="hsl(var(--text-muted))" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
        </div>
    );
};

export default FileUpload;
