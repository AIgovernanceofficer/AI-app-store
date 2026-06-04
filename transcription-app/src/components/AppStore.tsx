import React, { useState } from 'react';
import '../AppStore.css';

interface AppEntry {
    name: string;
    cat: string;
    icon: string;
    bg?: string;
    desc: string;
    url?: string;
    status: 'live' | 'soon';
    featured?: boolean;
    id?: string; // Internal ID for React components
}

const APPS: AppEntry[] = [
    { 
        name: "Transcribe Tool", 
        cat: "Onderzoek", 
        icon: "🎙️", 
        bg: "var(--amber)",
        desc: "Privacy-first, lokale transcriptie tool voor onderzoekers en studenten — 100% in-browser.",
        id: "transcribe", 
        status: "live" 
    },
    { 
        name: "Patientsim (AI)", 
        cat: "Onderwijs", 
        icon: "🩺", 
        bg: "var(--peach)",
        desc: "Oefen moeilijke patiëntgesprekken met een AI-simulatiepatiënt. Vereist een eigen API-sleutel (Claude of GPT).",
        url: "patientsim-ai.html", 
        status: "live" 
    },
    {
        name: "AI Maturity Assessment",
        cat: "Onderwijs",
        icon: "🤖", 
        bg: "var(--coral)",
        desc: "Breng in 20 stellingen de AI-volwassenheid van uw faculteit in kaart — een self-assessment voor vicedecanen onderwijs, met direct een persoonlijk rapport.",
        url: "ai-maturity-assessment-offline.html",
        status: "live",
        featured: true
    },
    { 
        name: "UU AI ethische gedragscode", 
        cat: "Ethiek", 
        icon: "⚖️", 
        bg: "var(--peach)",
        desc: "Ethische uitgangspunten en gedragsregels voor verantwoord AI-gebruik binnen de universiteit.", 
        status: "soon" 
    },
    { 
        name: "Gebruiksvoorwaarden", 
        cat: "Beleid", 
        icon: "📄", 
        bg: "var(--gold)",
        desc: "De voorwaarden voor het gebruik van de AI-tools in deze collectie.", 
        status: "soon" 
    },
    { 
        name: "Gebruikscondities AI-tools voor docenten", 
        cat: "Onderwijs", 
        icon: "📘", 
        bg: "var(--amber)",
        desc: "Condities en richtlijnen voor docenten en onderwijsondersteuners bij het inzetten van AI-tools.", 
        status: "soon" 
    },
    { 
        name: "Kennisclips voor OC leden", 
        cat: "Onderwijs", 
        icon: "📘", 
        bg: "var(--amber)",
        desc: "Videos die door AI zijn gegenereerd.", 
        status: "soon" 
    },
    { 
        name: "AI Resilience Tester", 
        cat: "Onderwijs", 
        icon: "🛡️", 
        bg: "var(--coral)",
        desc: "Test hoe weerbaar je onderwijs en toetsing zijn tegen oneigenlijk AI-gebruik.", 
        status: "soon" 
    },
    { 
        name: "AI Verslavingsmeter", 
        cat: "Welzijn", 
        icon: "🧠", 
        bg: "var(--sand)",
        desc: "Reflecteer op de mate van afhankelijkheid van AI-tools in het dagelijks werk of onderwijs.", 
        status: "soon" 
    },
    { 
        name: "Patientsim (Offline)", 
        cat: "Welzijn", 
        icon: "🧠", 
        bg: "var(--sand)",
        desc: "Oefen als student GNK of DGK met lastige communicatie scenarios zonder internetverbinding.", 
        url: "patientsim.html",
        status: "soon" 
    },
];

interface AppStoreProps {
    onOpenApp: (appId: string) => void;
}

const AppStore: React.FC<AppStoreProps> = ({ onOpenApp }) => {
    const [activeCat, setActiveCat] = useState("Alle");
    const [searchQuery, setSearchQuery] = useState("");

    const cats = ["Alle", ...Array.from(new Set(APPS.map(a => a.cat).filter(Boolean)))];

    const filteredApps = APPS.filter(a => {
        const matchesCat = activeCat === "Alle" || a.cat === activeCat;
        const matchesQuery = !searchQuery || 
            (a.name + " " + a.cat + " " + a.desc).toLowerCase().includes(searchQuery.toLowerCase().trim());
        return matchesCat && matchesQuery;
    });

    const featured = APPS.find(a => a.featured && (activeCat === "Alle" || a.cat === activeCat) && 
        (!searchQuery || (a.name + " " + a.cat + " " + a.desc).toLowerCase().includes(searchQuery.toLowerCase().trim())));

    const mainList = filteredApps.filter(a => a !== featured);

    const handleAppClick = (app: AppEntry) => {
        if (app.status !== 'live') return;
        if (app.id) {
            onOpenApp(app.id);
        } else if (app.url) {
            window.location.href = app.url;
        }
    };

    return (
        <div className="rise">
            <div className="storehead">
                <div>
                    <h1>App <span>Store</span></h1>
                    <p>AI-tools voor verantwoord onderwijs — gratis, direct in de browser.</p>
                </div>
                <div className="search">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6a5040" strokeWidth="2.2">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m21 21-4.3-4.3" />
                    </svg>
                    <input 
                        type="text" 
                        placeholder="Zoek apps…" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="cats">
                {cats.map(c => (
                    <div 
                        key={c} 
                        className={`chip ${c === activeCat ? 'on' : ''}`}
                        onClick={() => setActiveCat(c)}
                    >
                        {c}
                    </div>
                ))}
            </div>

            {featured && (
                <div className="feature">
                    <div className="ficon" style={{ background: featured.bg ? `linear-gradient(150deg,#fff,${featured.bg})` : 'linear-gradient(150deg,#fff,#ffe9d6)' }}>
                        {featured.icon}
                    </div>
                    <div className="fmeta">
                        <div className="cat">{featured.cat}</div>
                        <h2>{featured.name}</h2>
                        <p>{featured.desc}</p>
                    </div>
                    <div className="fcta">
                        <button 
                            className="open" 
                            onClick={() => handleAppClick(featured)}
                        >
                            Openen
                        </button>
                        <span className="free">Gratis · in browser</span>
                    </div>
                </div>
            )}

            <div className="sechead">
                <h3>{activeCat === "Alle" ? "Alle apps" : activeCat}</h3>
                <span className="cnt">{filteredApps.length} {filteredApps.length === 1 ? 'app' : 'apps'}</span>
            </div>

            <div className="grid-store">
                {filteredApps.length === 0 && !featured ? (
                    <div className="empty-store">Geen apps gevonden{searchQuery ? ` voor "${searchQuery}"` : ''}.</div>
                ) : (
                    mainList.map((a, i) => (
                        <div 
                            key={a.name} 
                            className={`app-card ${a.status === 'live' ? '' : 'soon'}`}
                            style={{ animationDelay: `${i * 0.05}s` }}
                            onClick={() => handleAppClick(a)}
                        >
                            <div className="icon-store" style={{ background: a.bg || 'var(--peach)' }}>
                                {a.icon || '🧩'}
                            </div>
                            <div className="body">
                                <div className="nm">{a.name}</div>
                                <div className="cat">{a.cat || ''}</div>
                                <p className="desc">{a.desc || ''}</p>
                            </div>
                            <div className="act">
                                {a.status === 'live' ? (
                                    <>
                                        <span className="open sm">Openen</span>
                                        <span className="free">Gratis</span>
                                    </>
                                ) : (
                                    <>
                                        <span className="open sm disabled">Binnenkort</span>
                                        <span className="badge-soon">In ontwikkeling</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ))
                )}

                {!searchQuery && activeCat === "Alle" && (
                    <div className="add-store" style={{ animationDelay: `${mainList.length * 0.05}s` }}>
                        <span className="plus">＋</span>
                        <div>
                            <div className="t">Meer apps volgen</div>
                            <div className="d">Deze store groeit.</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppStore;
