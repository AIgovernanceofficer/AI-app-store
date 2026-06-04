import React from 'react';
import type { Transcription } from '../utils/db';

interface TranscriptionListProps {
    transcriptions: Transcription[];
    onDelete: (id: number) => void;
    onView: (transcription: Transcription) => void;
}

const TranscriptionList: React.FC<TranscriptionListProps> = ({ transcriptions, onDelete, onView }) => {
    return (
        <div className="card">
            <h5 className="card-title">Transcription History</h5>
            {transcriptions.length === 0 ? (
                <p className="item-date">No transcriptions saved yet.</p>
            ) : (
                <div className="list-group">
                    {transcriptions.map((t) => (
                        <div key={t.id} className="list-group-item">
                            <div 
                                className="item-meta" 
                                style={{ cursor: 'pointer' }}
                                onClick={() => onView(t)}
                            >
                                <div className="item-title">{t.filename}</div>
                                <div className="item-date">{new Date(t.date).toLocaleString()}</div>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button 
                                    className="open sm outline"
                                    onClick={() => onView(t)}
                                >
                                    View
                                </button>
                                <button 
                                    className="open sm outline danger"
                                    style={{ border: 'none', color: '#fff' }}
                                    onClick={() => t.id && onDelete(t.id)}
                                >
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TranscriptionList;
