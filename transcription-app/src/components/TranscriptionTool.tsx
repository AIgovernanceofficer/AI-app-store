import { useState, useEffect, useRef } from 'react';
import FileUploader from './FileUploader';
import TranscriptionList from './TranscriptionList';
import { getAllTranscriptions, saveTranscription, deleteTranscription } from '../utils/db';
import type { Transcription } from '../utils/db';
import { readAudioFromBuffer } from '../utils/audio';

interface TranscriptionToolProps {
    onBack?: () => void;
}

function TranscriptionTool({ onBack }: TranscriptionToolProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [transcriptions, setTranscriptions] = useState<Transcription[]>([]);
    const [viewingTranscription, setViewingTranscription] = useState<Transcription | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [partialText, setPartialText] = useState<string>('');
    const [progress, setProgress] = useState<{ status: string, progress?: number, file?: string }[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const [copySuccess, setCopySuccess] = useState(false);

    const worker = useRef<Worker | null>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    const addLog = (message: string) => {
        console.log(message);
        setLogs(prev => [...prev, message]);
    };

    useEffect(() => {
        loadTranscriptions();
        
        // Initialize worker
        worker.current = new Worker(new URL('../worker.ts', import.meta.url), {
            type: 'module'
        });

        worker.current.onmessage = (event) => {
            const message = event.data;
            if (message.status === 'progress') {
                setProgress(prev => {
                    const existing = prev.find(p => p.file === message.file);
                    if (existing) {
                        return prev.map(p => p.file === message.file ? message : p);
                    }
                    return [...prev, message];
                });
            } else if (message.status === 'log') {
                addLog(message.message);
            } else if (message.status === 'stream') {
                setPartialText(prev => (prev === 'Preparing audio...' || prev === 'Waiting for AI to start...') ? message.text : prev + message.text);
            } else if (message.status === 'complete') {
                handleTranscriptionComplete(message.result, message.filename);
            } else if (message.status === 'error') {
                setError(message.error);
                setIsProcessing(false);
            }
        };

        return () => {
            worker.current?.terminate();
        };
    }, []);

    // Auto-scroll logs without scrolling the whole page
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const loadTranscriptions = async () => {
        const data = await getAllTranscriptions();
        const sorted = data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setTranscriptions(sorted);
        return sorted;
    };

    const handleFileSelect = (file: File) => {
        addLog(`[App] File selected: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)} MB)`);
        setSelectedFile(file);
        setError(null);
        setProgress([]);
        setPartialText('');
    };

    const handleStartTranscription = async () => {
        if (!selectedFile || !worker.current) return;

        setIsProcessing(true);
        setError(null);
        setProgress([]);
        setLogs([]); // Clear logs for new session
        setPartialText('Preparing audio...');
        addLog(`[App] Starting transcription process for: ${selectedFile.name}`);

        try {
            addLog('[App] Decoding audio buffer...');
            const arrayBuffer = await selectedFile.arrayBuffer();
            const audioData = await readAudioFromBuffer(arrayBuffer);
            addLog('[App] Audio decoded. Sending to worker.');
            
            worker.current.postMessage({
                audio: audioData,
                language: 'nl',
                filename: selectedFile.name
            });
        } catch (err: any) {
            addLog(`[App] Error: ${err.message}`);
            setError('Failed to process audio: ' + err.message);
            setIsProcessing(false);
        }
    };

    const handleTranscriptionComplete = async (result: any, filename: string) => {
        addLog(`[App] Transcription complete for: ${filename}`);
        const transcription: Omit<Transcription, 'id'> = {
            filename: filename,
            text: result.text,
            date: new Date()
        };

        const id = await saveTranscription(transcription);
        addLog(`[App] Transcription saved with ID: ${id}`);
        const updatedList = await loadTranscriptions();
        const newTranscription = updatedList.find(t => t.id === id);
        
        setIsProcessing(false);
        setSelectedFile(null);
        setProgress([]);
        setPartialText('');
        
        if (newTranscription) {
            addLog('[App] Auto-selecting new transcription.');
            setViewingTranscription(newTranscription);
        }
    };

    const handleDelete = async (id: number) => {
        const t = transcriptions.find(x => x.id === id);
        if (confirm(`Are you sure you want to delete the transcription for "${t?.filename}"?`)) {
            await deleteTranscription(id);
            loadTranscriptions();
            if (viewingTranscription?.id === id) {
                setViewingTranscription(null);
            }
        }
    };

    const handleView = (t: Transcription) => {
        setViewingTranscription(t);
    };

    const handleDownload = (t: Transcription) => {
        const element = document.createElement("a");
        const file = new Blob([t.text], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = `${t.filename.split('.')[0]}_transcription.txt`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    const handleCopy = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
            addLog('[App] Transcription copied to clipboard.');
        } catch (err) {
            addLog('[App] Failed to copy to clipboard.');
        }
    };

    return (
        <div className="rise">
            <header className="storehead">
                <div className="d-flex align-items-center gap-3">
                    {onBack && (
                        <button className="open sm outline" onClick={onBack}>
                            <i className="bi bi-arrow-left"></i> Terug
                        </button>
                    )}
                    <h1 className="m-0">Transcribe <span>Tool</span></h1>
                </div>
                <p>Privacy-first, local transcription tool for researchers and students — 100% in-browser.</p>
            </header>

            <div className="grid">
                <div className="rise" style={{ animationDelay: '0.1s' }}>
                    <FileUploader onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                    
                    {error && (
                        <div className="card" style={{ borderLeft: '4px solid #e54d42', color: '#b91d1d' }}>
                            {error}
                        </div>
                    )}

                    {isProcessing && (
                        <div className="card">
                            <div className="card-title">
                                <span>
                                    <i className="bi bi-cpu me-2"></i>
                                    Processing...
                                </span>
                            </div>
                            <p className="item-date mb-3">Local AI is transcribing {selectedFile?.name}</p>
                            
                            {progress.length > 0 && progress.some(p => p.progress !== undefined && p.progress < 100) && (
                                <div className="mb-3">
                                    {progress.filter(p => p.progress !== undefined && p.progress < 100).map((p, i) => (
                                        <div key={i} className="mb-2">
                                            <div className="d-flex justify-content-between item-date mb-1">
                                                <span className="text-truncate" style={{maxWidth: '80%'}}>Loading {p.file}</span>
                                                <span>{Math.round(p.progress!)}%</span>
                                            </div>
                                            <div style={{ height: '4px', background: 'var(--line)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <div 
                                                    style={{ 
                                                        width: `${p.progress}%`, 
                                                        height: '100%', 
                                                        background: 'var(--terra)',
                                                        transition: 'width .3s'
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div 
                                className="mt-3 bg-light rounded p-2" 
                                ref={logContainerRef}
                                style={{ maxHeight: '150px', overflowY: 'auto', background: 'var(--cream)', borderRadius: '12px', border: '1.5px solid var(--line)' }}
                            >
                                <div style={{ fontSize: '11px', fontFamily: 'monospace', color: 'var(--ink-soft)' }}>
                                    {logs.map((log, i) => (
                                        <div key={i} className="mb-1 border-bottom border-light pb-1 last-child-no-border">
                                            {log}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {selectedFile && !isProcessing && (
                        <div className="mb-4">
                            <button className="open w-100" onClick={handleStartTranscription}>
                                <i className="bi bi-play-fill me-1"></i> Start Transcription
                            </button>
                        </div>
                    )}

                    <TranscriptionList 
                        transcriptions={transcriptions} 
                        onDelete={handleDelete} 
                        onView={handleView} 
                    />
                </div>

                <div className="rise" style={{ animationDelay: '0.2s' }}>
                    <div className="card" style={{ minHeight: '500px' }}>
                        <div className="card-title">
                            {isProcessing ? 'Live Output' : 'Transcription View'}
                            {(viewingTranscription && !isProcessing) && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                        className="open sm outline"
                                        onClick={() => handleCopy(viewingTranscription.text)}
                                    >
                                        <i className={`bi ${copySuccess ? 'bi-check-lg' : 'bi-clipboard'} me-1`}></i> 
                                        {copySuccess ? 'Copied!' : 'Copy'}
                                    </button>
                                    <button 
                                        className="open sm outline"
                                        onClick={() => handleDownload(viewingTranscription)}
                                    >
                                        <i className="bi bi-download me-1"></i> Download
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="mt-3">
                            {isProcessing ? (
                                <div className="live-transcription">
                                    <span className="badge-live">LIVE</span>
                                    <div className="item-title mb-2">{selectedFile?.name}</div>
                                    <pre>
                                        {(partialText || 'Waiting for AI to start...')
                                            .replace(/\[\d{2}:\d{2}\.\d{2} -> \d{2}:\d{2}\.\d{2}\]/g, '\n')
                                            .replace(/<\|\d{1,2}\.\d{2}\|>/g, '\n')
                                            .replace(/\n\s*\n/g, '\n')
                                            .trim()}
                                        <span className="blinking-cursor">|</span>
                                    </pre>
                                </div>
                            ) : viewingTranscription ? (
                                <>
                                    <div className="item-title">{viewingTranscription.filename}</div>
                                    <div className="item-date mb-3">{new Date(viewingTranscription.date).toLocaleString()}</div>
                                    <pre>{viewingTranscription.text}</pre>
                                </>
                            ) : (
                                <div style={{ textAlign: 'center', color: 'var(--ink-mute)', paddingTop: '100px' }}>
                                    <i className="bi bi-file-earmark-text" style={{ fontSize: '64px', opacity: 0.2, display: 'block', marginBottom: '16px' }}></i>
                                    <p>Select a transcription from history<br/>or upload a new file.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TranscriptionTool;
