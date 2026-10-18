import React, { useState } from 'react';
import { 
  PlaySquare, 
  FileDown, 
  Film, 
  Layers, 
  Radio, 
  Info,
  Menu,
  X,
  BarChart3
} from 'lucide-react';

interface NavbarProps {
  onOpenExport: () => void;
  onOpenArchitecture: () => void;
  reelCount: number;
  activeTab: string;
  setActiveTab: (tab: 'timeline' | 'coaching' | 'reels' | 'analytics') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenExport,
  onOpenArchitecture,
  reelCount,
  activeTab,
  setActiveTab
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: 'timeline' | 'coaching' | 'reels' | 'analytics') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-brand-section">
        <div className="brand">
          <div className="brand-icon">
            <PlaySquare size={20} color="#070a13" strokeWidth={2.5} />
          </div>
          <div>
            <span className="brand-title">Framesports<span style={{ color: 'var(--accent-turf)' }}>.ai</span></span>
          </div>
          <span className="brand-badge desktop-only">PRO RUGBY WORKFLOW</span>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="mobile-menu-toggle mobile-only"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Actions (Desktop + Responsive Mobile Drawer) */}
      <nav className={`nav-actions ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <button 
          className={`btn-ctrl ${activeTab === 'timeline' ? 'active' : ''}`}
          onClick={() => handleTabClick('timeline')}
          title="Match Event Timeline"
        >
          <Layers size={15} />
          <span>Timeline</span>
        </button>

        <button 
          className={`btn-ctrl ${activeTab === 'coaching' ? 'active' : ''}`}
          onClick={() => handleTabClick('coaching')}
          title="Coaching Feedback & Telestrations"
        >
          <Radio size={15} />
          <span>Coaching Feedback</span>
        </button>

        <button 
          className={`btn-ctrl ${activeTab === 'reels' ? 'active' : ''}`}
          onClick={() => handleTabClick('reels')}
          title="Highlight Reel Builder"
        >
          <Film size={15} />
          <span>Highlights ({reelCount})</span>
        </button>

        <button 
          className={`btn-ctrl ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => handleTabClick('analytics')}
          title="Match KPIs & Set Piece Analytics"
        >
          <BarChart3 size={15} />
          <span>Analytics</span>
        </button>

        <div className="nav-divider" />

        <button 
          className="btn-ctrl" 
          onClick={() => {
            onOpenExport();
            setMobileMenuOpen(false);
          }}
          title="Export Match Analytics & Report"
        >
          <FileDown size={15} />
          <span>Export Report</span>
        </button>

        <button 
          className="btn-primary" 
          onClick={() => {
            onOpenArchitecture();
            setMobileMenuOpen(false);
          }}
          style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          title="Architecture Brief for CTO Ori"
        >
          <Info size={15} />
          <span>CTO Architecture Brief</span>
        </button>
      </nav>
    </header>
  );
};
