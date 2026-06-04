import { useState } from 'react';
import './App.css';
import AppStore from './components/AppStore';
import TranscriptionTool from './components/TranscriptionTool';

function App() {
    const [view, setView] = useState<'store' | 'transcribe'>('store');

    return (
        <div className="wrap">
            <nav>
                <a className="brand" href="#" onClick={(e) => { e.preventDefault(); setView('store'); }}>
                    <span className="dot">🛍️</span> AIGovernanceofficer.nl
                </a>
                <a className="nav-link" href="https://aigovernanceofficer.nl" target="_blank" rel="noopener">Website ↗</a>
            </nav>

            <main>
                {view === 'store' ? (
                    <AppStore onOpenApp={(id) => {
                        if (id === 'transcribe') setView('transcribe');
                    }} />
                ) : (
                    <TranscriptionTool onBack={() => setView('store')} />
                )}
            </main>

            <footer>
                © 2026 <a href="https://aigovernanceofficer.nl" target="_blank" rel="noopener">AIGovernanceofficer.nl</a> ·
                AI-Governance Solutions
            </footer>
        </div>
    );
}

export default App;
