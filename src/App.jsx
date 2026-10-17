import React, { useState, useRef } from 'react';
import './App.css';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { 
  ArrowUpRight, 
  ArrowRight, 
  Copy, 
  Check, 
  ExternalLink, 
  Globe, 
  Layers, 
  Cpu, 
  TrendingUp, 
  Menu, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Send,
  Database,
  Loader2
} from 'lucide-react';

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const [copiedPromptId, setCopiedPromptId] = useState(null);
  const [emailCopied, setEmailCopied] = useState(false);
  const toastTimeoutRef = useRef(null);

  // Supabase Inquiry Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service_type: 'Full Digital Growth Package',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  };

  const handleCopyEmail = () => {
    const email = 'contact@assurancedigital.in';
    navigator.clipboard.writeText(email).then(() => {
      setEmailCopied(true);
      showToast('Email address copied to clipboard!');
      setTimeout(() => setEmailCopied(false), 2200);
    }).catch(() => {
      showToast(`Email: ${email}`);
    });
  };

  const handleCopyPrompt = (id, text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedPromptId(id);
      showToast('Prompt copied! Ready to use in your AI workspace.');
      setTimeout(() => setCopiedPromptId(null), 2400);
    }).catch(() => {
      showToast('Failed to copy. Please select text manually.');
    });
  };

  // Micro tilt effect on mouse move
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
  };

  const handleCardMouseLeave = (e) => {
    e.currentTarget.style.transform = '';
  };

  // Handle Form Submission with Supabase & Google Sheets
  const handleSubmitInquiry = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);

    try {
      // 1. Send to Google Sheets if configured
      const googleSheetUrl = import.meta.env.VITE_GOOGLE_SHEET_URL;
      let sheetSent = false;
      if (googleSheetUrl && !googleSheetUrl.includes('your-script-url')) {
        try {
          const formPayload = new FormData();
          formPayload.append('Name', formData.name);
          formPayload.append('Email', formData.email);
          formPayload.append('Service', formData.service_type);
          formPayload.append('Message', formData.message);
          formPayload.append('Date', new Date().toLocaleString());

          fetch(googleSheetUrl, {
            method: 'POST',
            body: formPayload,
            mode: 'no-cors'
          }).catch(err => console.warn('Google Sheets sync note:', err));
          sheetSent = true;
        } catch (sheetErr) {
          console.warn('Google Sheets error:', sheetErr);
        }
      }

      // 2. Send to Supabase
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('inquiries')
          .insert([
            {
              name: formData.name,
              email: formData.email,
              service_type: formData.service_type,
              message: formData.message,
              created_at: new Date().toISOString()
            }
          ]);

        if (error) throw error;
        setSubmitSuccess(true);
        showToast(
          sheetSent 
            ? 'Inquiry received! Successfully saved to Supabase & Google Sheet.' 
            : 'Message sent to Supabase successfully! Abhinav will be in touch soon.'
        );
      } else {
        await new Promise((res) => setTimeout(res, 800));
        setSubmitSuccess(true);
        showToast(
          sheetSent 
            ? 'Inquiry sent directly to Google Sheet!' 
            : 'Demo submission received! Connect your credentials to save to Supabase & Google Sheets.'
        );
      }

      setFormData({
        name: '',
        email: '',
        service_type: 'Full Digital Growth Package',
        message: ''
      });
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err) {
      console.error('Submission error:', err);
      showToast(`Error saving message: ${err.message || 'Please check your connection.'}`);
    } finally {
      setSubmitting(false);
    }
  };

  const prompts = [
    {
      id: 'p1',
      tag: 'Web & Liquid UI',
      title: 'Modern High-Converting Liquid UI Web Architecture',
      text: 'Act as a Principal Frontend Engineer and UI/UX Designer. Create a responsive, dark/ice-blue glassmorphism landing page with fluid typography, backdrop-filter blur effects, floating topic cards, and elegant micro-interactions inspired by top-tier modern agency portfolios.'
    },
    {
      id: 'p2',
      tag: 'Agentic Coding',
      title: 'Autonomous Multi-Agent System Blueprint',
      text: 'Formulate an end-to-end multi-agent execution pipeline. Segment tasks into specialized autonomous subagents: (1) Discovery & Research, (2) Schema & Core Backend Logic, (3) UI/UX React Components, and (4) QA / Security Auditing. Define communication channels and self-healing error loops.'
    },
    {
      id: 'p3',
      tag: 'Voice & AI Agents',
      title: 'Conversational Business AI Voice Assistant',
      text: 'Design a high-fidelity system prompt for an ElevenLabs Conversational Voice Agent representing Assurance Digital. Maintain a warm, authoritative, concise communication style, answer questions about digital services, and seamlessly capture client contact info for follow-up.'
    }
  ];

  return (
    <div className="app-root">
      {/* Liquid Background Glow */}
      <div className="liquid-ambient" aria-hidden="true">
        <div className="liquid-blob blob-1"></div>
        <div className="liquid-blob blob-2"></div>
        <div className="liquid-blob blob-3"></div>
      </div>

      {/* Header / Masthead */}
      <header id="masthead" className="site-header">
        <div className="container header-container">
          <a href="#hero" className="site-branding">
            <div className="avatar-ring">
              <img src="/abhinav.png" alt="Abhinav Upadhyay" className="header-avatar" />
              <span className="status-dot" title="Available for projects"></span>
            </div>
            <div className="brand-text">
              <span className="site-title">Abhinav Upadhyay</span>
              <span className="site-tagline">Founder • Assurance Digital</span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="desktop-nav" aria-label="Primary Navigation">
            <ul className="nav-menu">
              <li><a href="#about" className="nav-link">About</a></li>
              <li><a href="#tools" className="nav-link">Recommended Tools</a></li>
              <li><a href="#ecosystem" className="nav-link">Platforms</a></li>
              <li><a href="#contact" className="nav-link">Get in Touch</a></li>
              <li><a href="#prompts" className="nav-link">AI Resources</a></li>
              <li>
                <a 
                  href="https://instagram.com/assurancedigital.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="nav-link insta-pill"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" width="15" height="15">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>@assurancedigital.in</span>
                </a>
              </li>
            </ul>
          </nav>

          {/* Action Button & Mobile Hamburger */}
          <div className="header-actions">
            <a 
              href="https://assurancedigitalos.netlify.app" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary btn-sm glow-btn"
            >
              <span>Assurance OS</span>
              <ArrowUpRight size={15} />
            </a>
            <button 
              className={`menu-toggle ${mobileMenuOpen ? 'is-active' : ''}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="mobile-drawer">
            <nav className="mobile-nav">
              <a href="#about" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>About Abhinav</a>
              <a href="#tools" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Recommended AI Tools</a>
              <a href="#ecosystem" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Platforms</a>
              <a href="#contact" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>Direct Inquiries</a>
              <a href="#prompts" className="mobile-link" onClick={() => setMobileMenuOpen(false)}>AI Blueprints</a>
              <a 
                href="https://instagram.com/assurancedigital.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mobile-link insta-highlight"
                onClick={() => setMobileMenuOpen(false)}
              >
                Instagram (@assurancedigital.in)
              </a>
              <a 
                href="https://assurancedigital.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assurance Digital Agency
              </a>
              <a 
                href="https://assurancedigitalos.netlify.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mobile-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                Assurance Digital OS
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section (Signature Deep Navy with Radial Halo) */}
      <section id="hero" className="hero-section">
        <div className="container hero-container">
          <div className="hero-content">
            <div className="badge-pill hero-badge">
              <span className="badge-dot"></span>
              <span>18-Year-Old Entrepreneur & Freelancer • Founder of Assurance Digital</span>
            </div>

            <h1 className="hero-title">
              Empowering people & businesses to <span className="gradient-text">grow digitally with AI</span>.
            </h1>

            <p className="hero-lead">
              Hi, I’m <strong className="text-white">Abhinav Upadhyay</strong>. I am an 18-year-old freelancer, entrepreneur, and the founder of <strong className="text-white">Assurance Digital</strong>. Passionate about technology, business, and building impactful digital solutions from the ground up.
            </p>

            <div className="hero-cta-group">
              <a href="#tools" className="btn btn-primary btn-hero">
                <span>Explore Recommended Tools</span>
                <ArrowRight size={17} />
              </a>
              <a 
                href="https://assurancedigital.vercel.app" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-outline btn-hero"
              >
                <span>Visit Assurance Digital</span>
                <ArrowUpRight size={16} />
              </a>
              <a 
                href="https://instagram.com/assurancedigital.in" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn btn-glass btn-hero"
              >
                <span>@assurancedigital.in</span>
                <ArrowUpRight size={16} />
              </a>
            </div>
          </div>

          {/* 4 Overlapping Floating Topic Cards (Darsh Jain Signature Layout) */}
          <div className="hero-topics-grid">
            <div 
              className="topic-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="topic-icon-wrap icon-web">
                <Globe size={24} />
              </div>
              <h3 className="topic-title">Digital Services</h3>
              <p className="topic-desc">Full-spectrum digital services helping individuals and brands scale their presence.</p>
              <a href="https://assurancedigital.vercel.app" target="_blank" rel="noopener noreferrer" className="topic-link">
                assurancedigital.vercel.app →
              </a>
            </div>

            <div 
              className="topic-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="topic-icon-wrap icon-os">
                <Layers size={24} />
              </div>
              <h3 className="topic-title">Assurance OS</h3>
              <p className="topic-desc">All-in-one centralized digital operating system powering streamlined workflows.</p>
              <a href="https://assurancedigitalos.netlify.app" target="_blank" rel="noopener noreferrer" className="topic-link">
                Launch workspace →
              </a>
            </div>

            <div 
              className="topic-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="topic-icon-wrap icon-ai">
                <Cpu size={24} />
              </div>
              <h3 className="topic-title">Agentic AI & Coding</h3>
              <p className="topic-desc">Leveraging Google Antigravity, Claude, and ChatGPT to engineer intelligent systems.</p>
              <a href="#tools" className="topic-link">
                View recommended tools →
              </a>
            </div>

            <div 
              className="topic-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="topic-icon-wrap icon-growth">
                <TrendingUp size={24} />
              </div>
              <h3 className="topic-title">Business Growth</h3>
              <p className="topic-desc">Bridging modern software engineering with business execution to build lasting value.</p>
              <a href="#about" className="topic-link">
                About Abhinav's vision →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Recommended Tools Section */}
      <section id="tools" className="section tools-section">
        <div className="container">
          <div className="section-header">
            <div className="badge-pill">Curated Stack</div>
            <h2 className="section-title">Recommended AI Tools</h2>
            <p className="section-lead">
              The essential platforms and toolsets recommended by Abhinav Upadhyay to build, think, code, and automate at peak performance.
            </p>
          </div>

          <div className="tools-grid">
            {/* 1. Google Antigravity */}
            <div 
              className="tool-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="tool-top">
                <div className="tool-logo-box">
                  <svg viewBox="0 0 48 48" width="34" height="34" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#EBF3FE"/>
                    <path d="M24 10L36 32H12L24 10Z" fill="url(#antigravity-grad-react)" stroke="#1268F3" strokeWidth="2" strokeLinejoin="round"/>
                    <circle cx="24" cy="25" r="4" fill="#081F4D"/>
                    <defs>
                      <linearGradient id="antigravity-grad-react" x1="12" y1="10" x2="36" y2="32" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#1268F3"/>
                        <stop offset="1" stopColor="#60A5FA"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="tool-badge-wrap">
                  <span className="tool-tag tag-primary">Agentic Coding</span>
                </div>
              </div>
              <div className="tool-content">
                <div className="tool-meta">
                  <h3 className="tool-title">Google Antigravity</h3>
                  <span className="tool-author">Google DeepMind</span>
                </div>
                <p className="tool-desc">
                  Next-generation agentic AI software engineering platform. Features autonomous multi-agent delegation, deep terminal coordination, and intelligent pair-programming.
                </p>
                <div className="tool-features">
                  <span className="pill-chip">Autonomous Subagents</span>
                  <span className="pill-chip">Deep Reasoning</span>
                  <span className="pill-chip">Workspace Integration</span>
                </div>
              </div>
              <div className="tool-footer">
                <a 
                  href="https://antigravity.google/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-tool"
                >
                  <span>antigravity.google</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            {/* 2. Anthropic Claude */}
            <div 
              className="tool-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="tool-top">
                <div className="tool-logo-box">
                  <svg viewBox="0 0 48 48" width="34" height="34" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#FBF5F0"/>
                    <path d="M24 12C24 12 25.5 19 28 21.5C30.5 24 37.5 25.5 37.5 25.5C37.5 25.5 30.5 27 28 29.5C25.5 32 24 39 24 39C24 39 22.5 32 20 29.5C17.5 27 10.5 25.5 10.5 25.5C10.5 25.5 17.5 24 20 21.5C22.5 19 24 12 24 12Z" fill="#D97706"/>
                    <circle cx="24" cy="25.5" r="2.5" fill="#FFF"/>
                  </svg>
                </div>
                <div className="tool-badge-wrap">
                  <span className="tool-tag tag-claude">Reasoning & Artifacts</span>
                </div>
              </div>
              <div className="tool-content">
                <div className="tool-meta">
                  <h3 className="tool-title">Anthropic Claude</h3>
                  <span className="tool-author">claude.ai</span>
                </div>
                <p className="tool-desc">
                  Elite AI for nuanced thinking, structured system architecture, long-context document analysis, and interactive real-time live React Artifact previews.
                </p>
                <div className="tool-features">
                  <span className="pill-chip">Claude 3.7 Sonnet</span>
                  <span className="pill-chip">Interactive Artifacts</span>
                  <span className="pill-chip">Code Architecture</span>
                </div>
              </div>
              <div className="tool-footer">
                <a 
                  href="https://claude.ai/new" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-tool"
                >
                  <span>claude.ai/new</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            {/* 3. OpenAI ChatGPT */}
            <div 
              className="tool-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="tool-top">
                <div className="tool-logo-box">
                  <svg viewBox="0 0 48 48" width="34" height="34" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#E8F8F3"/>
                    <path d="M34.4 20.8A8 8 0 0024.5 14a8 8 0 00-6.7 3.5 8 8 0 00-4.6 6.8 8 8 0 002.5 7.6 8 8 0 009.9 6.8 8 8 0 006.7-3.5 8 8 0 004.6-6.8c0-2.8-1.5-5.3-3.9-6.6z" stroke="#10A37F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 19v10M19 21.5l10 5M29 21.5l-10 5" stroke="#10A37F" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="tool-badge-wrap">
                  <span className="tool-tag tag-gpt">Everyday AI & Research</span>
                </div>
              </div>
              <div className="tool-content">
                <div className="tool-meta">
                  <h3 className="tool-title">OpenAI ChatGPT</h3>
                  <span className="tool-author">chatgpt.com</span>
                </div>
                <p className="tool-desc">
                  The quintessential conversational AI powerhouse. Exceptional for fast synthesis, live internet research, brainstorming business logic, Canvas writing, and ideation.
                </p>
                <div className="tool-features">
                  <span className="pill-chip">GPT-4o & Reasoning</span>
                  <span className="pill-chip">Live Canvas</span>
                  <span className="pill-chip">Vision & Voice</span>
                </div>
              </div>
              <div className="tool-footer">
                <a 
                  href="https://chatgpt.com/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-tool"
                >
                  <span>chatgpt.com</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>

            {/* 4. ElevenLabs */}
            <div 
              className="tool-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="tool-top">
                <div className="tool-logo-box">
                  <svg viewBox="0 0 48 48" width="34" height="34" fill="none">
                    <circle cx="24" cy="24" r="22" fill="#F1F4F9"/>
                    <rect x="18" y="14" width="4" height="20" rx="2" fill="#081F4D"/>
                    <rect x="26" y="14" width="4" height="20" rx="2" fill="#1268F3"/>
                  </svg>
                </div>
                <div className="tool-badge-wrap">
                  <span className="tool-tag tag-elevenlabs">AI Voice & Audio</span>
                </div>
              </div>
              <div className="tool-content">
                <div className="tool-meta">
                  <h3 className="tool-title">ElevenLabs</h3>
                  <span className="tool-author">elevenlabs.io</span>
                </div>
                <p className="tool-desc">
                  The gold standard for AI voice generation. Lifelike voice synthesis, voice cloning, localized multilingual speech, and real-time conversational voice agents for businesses.
                </p>
                <div className="tool-features">
                  <span className="pill-chip">Conversational Voice</span>
                  <span className="pill-chip">Voice Cloning</span>
                  <span className="pill-chip">Automated Phone Agents</span>
                </div>
              </div>
              <div className="tool-footer">
                <a 
                  href="https://elevenlabs.io/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-tool"
                >
                  <span>elevenlabs.io</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assurance Digital Ecosystem */}
      <section id="ecosystem" className="section ecosystem-section">
        <div className="container">
          <div className="section-header">
            <div className="badge-pill">Venture Ecosystem</div>
            <h2 className="section-title">Built by Abhinav Upadhyay</h2>
            <p className="section-lead">
              Discover the official digital platforms founded by Abhinav, providing high-standard digital services and modern workspace architecture.
            </p>
          </div>

          <div className="platforms-grid">
            {/* Card 1: Assurance Digital Agency */}
            <div 
              className="platform-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="platform-header">
                <div className="platform-badge">Flagship Digital Agency</div>
                <span className="live-pill"><span className="live-dot"></span> Live Portal</span>
              </div>
              <div className="platform-preview">
                <div className="browser-mockup">
                  <div className="browser-header">
                    <span className="b-dot"></span>
                    <span className="b-dot"></span>
                    <span className="b-dot"></span>
                    <div className="b-url">assurancedigital.vercel.app</div>
                  </div>
                  <div className="browser-body">
                    <div className="mock-agency-hero">
                      <span className="mock-tag">Assurance Digital</span>
                      <h4>End-to-End Digital Services for Modern Brands</h4>
                      <p>Helping individuals & businesses scale with top-tier web design, AI automations, and growth systems.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="platform-details">
                <h3 className="platform-title">Assurance Digital</h3>
                <p className="platform-desc">
                  The primary digital agency founded by Abhinav Upadhyay. We deliver all types of digital services — from bespoke web applications and branding to automated customer pipelines.
                </p>
                <div className="services-summary">
                  <span className="service-pill">Web Development</span>
                  <span className="service-pill">AI Automation</span>
                  <span className="service-pill">Digital Growth</span>
                  <span className="service-pill">UI/UX Systems</span>
                </div>
                <div className="platform-actions">
                  <a 
                    href="https://assurancedigital.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    <span>Visit assurancedigital.vercel.app</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>

            {/* Card 2: Assurance Digital OS */}
            <div 
              className="platform-card liquid-card"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
            >
              <div className="platform-header">
                <div className="platform-badge">Cloud Workspace & OS</div>
                <span className="live-pill"><span className="live-dot"></span> Active OS</span>
              </div>
              <div className="platform-preview">
                <div className="browser-mockup">
                  <div className="browser-header">
                    <span className="b-dot"></span>
                    <span className="b-dot"></span>
                    <span className="b-dot"></span>
                    <div className="b-url">assurancedigitalos.netlify.app</div>
                  </div>
                  <div className="browser-body">
                    <div className="mock-os-hero">
                      <span className="mock-tag os-tag">Assurance Digital OS</span>
                      <h4>Centralized Workspace & Operations Engine</h4>
                      <p>Productivity hub, asset repositories, project pipeline trackers, and collaborative tools.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="platform-details">
                <h3 className="platform-title">Assurance Digital OS</h3>
                <p className="platform-desc">
                  A high-efficiency cloud operating system and workspace suite built to streamline internal agency operations, project delivery, and productivity workflows.
                </p>
                <div className="services-summary">
                  <span className="service-pill">Project Trackers</span>
                  <span className="service-pill">Resource Management</span>
                  <span className="service-pill">Cloud Dashboards</span>
                </div>
                <div className="platform-actions">
                  <a 
                    href="https://assurancedigitalos.netlify.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn btn-primary"
                  >
                    <span>Launch assurancedigitalos.netlify.app</span>
                    <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Contact Section with Supabase Form */}
      <section id="about" className="section about-section">
        <div className="container">
          <div 
            className="about-card liquid-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="about-image-column">
              <div className="about-img-frame">
                <img src="/abhinav.png" alt="Abhinav Upadhyay" className="about-avatar" />
              </div>
              <div className="social-handles-box">
                <div className="handle-item">
                  <span className="handle-label">Age</span>
                  <span className="handle-val">18 Years Old</span>
                </div>
                <div className="handle-item">
                  <span className="handle-label">Instagram</span>
                  <a 
                    href="https://instagram.com/assurancedigital.in" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="handle-val"
                  >
                    @assurancedigital.in
                  </a>
                </div>
                <div className="handle-item">
                  <span className="handle-label">Agency</span>
                  <a 
                    href="https://assurancedigital.vercel.app" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="handle-val"
                  >
                    assurancedigital.vercel.app
                  </a>
                </div>
              </div>
            </div>

            <div className="about-info-column">
              <div className="badge-pill">
                <span>Founder & Digital Architect</span>
                <span className={`supabase-badge ${isSupabaseConfigured ? 'supabase-connected' : 'supabase-ready'}`}>
                  <Database size={12} />
                  {isSupabaseConfigured ? 'Supabase Connected' : 'Supabase Integrated'}
                </span>
              </div>
              <h2 className="about-heading">I'm Abhinav Upadhyay.</h2>
              <div className="about-text">
                <p>
                  I am an <strong>18-year-old freelancer and entrepreneur</strong>, and the founder of <strong>Assurance Digital</strong>. At Assurance Digital, we provide all types of digital services to empower individuals and businesses to scale and thrive in the modern online landscape.
                </p>
                <p>
                  I have an immense passion for <strong>technology, business, and building something of my own</strong>. Whether it's architecting modern web platforms, harnessing agentic AI coding with Google Antigravity and Claude, or designing automated business engines, I love turning ambitious ideas into reality.
                </p>
              </div>

              <div className="about-stats-grid">
                <div className="stat-box">
                  <span className="stat-number">18 Y/O</span>
                  <span className="stat-desc">Driven young entrepreneur</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">All Digital</span>
                  <span className="stat-desc">Full spectrum service suite</span>
                </div>
                <div className="stat-box">
                  <span className="stat-number">AI Powered</span>
                  <span className="stat-desc">Modern web & automation</span>
                </div>
              </div>

              <div className="about-action-row">
                <a 
                  href="https://instagram.com/assurancedigital.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-insta"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <span>Connect on Instagram</span>
                </a>
                <a 
                  href="https://assurancedigital.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-secondary"
                >
                  <span>Work With Assurance Digital</span>
                </a>
              </div>

              {/* Collab Box */}
              <div className="collab-box">
                <span className="collab-label">Direct Inquiries & Projects</span>
                <div className="collab-email-row">
                  <a href="mailto:contact@assurancedigital.in" className="collab-email">
                    contact@assurancedigital.in
                  </a>
                  <button 
                    className="copy-pill" 
                    onClick={handleCopyEmail}
                    type="button"
                  >
                    {emailCopied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Supabase Lead / Project Inquiry Form */}
          <div id="contact" className="inquiry-form-card">
            <div className="inquiry-form-header">
              <h3 className="inquiry-form-title">Send a Direct Project Inquiry</h3>
              <p className="inquiry-form-subtitle">
                Connected directly to <strong>Supabase</strong>. Submit your project requirements to start growing digitally.
              </p>
            </div>

            <form onSubmit={handleSubmitInquiry} className="inquiry-form">
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="form-input"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="you@company.com"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="service">Service Needed</label>
                <select
                  id="service"
                  className="form-select"
                  value={formData.service_type}
                  onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                >
                  <option value="Full Digital Growth Package">Full Digital Growth Package</option>
                  <option value="Modern High-Converting Website">Modern High-Converting Website</option>
                  <option value="AI Agents & Voice Automation">AI Agents & Voice Automation</option>
                  <option value="Assurance OS Enterprise Setup">Assurance OS Enterprise Setup</option>
                  <option value="Freelance Consultation">Freelance Consultation</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Project Details / Message *</label>
                <textarea
                  id="message"
                  required
                  rows="4"
                  placeholder="Tell Abhinav about your project goals, timeline, and vision..."
                  className="form-textarea"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={submitting}
                style={{ alignSelf: 'flex-start' }}
              >
                {submitting ? (
                  <>
                    <Loader2 size={16} className="spin-icon" />
                    <span>Submitting to Supabase...</span>
                  </>
                ) : submitSuccess ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Inquiry Sent!</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Submit to Abhinav</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Prompts Section */}
      <section id="prompts" className="section prompts-section">
        <div className="container">
          <div className="section-header">
            <div className="badge-pill">Free System Prompts</div>
            <h2 className="section-title">Ready-to-Use AI Blueprints</h2>
            <p className="section-lead">
              Click any prompt below to instantly copy it for use in Google Antigravity, Claude, or ChatGPT.
            </p>
          </div>

          <div className="prompts-grid">
            {prompts.map((p) => (
              <div 
                key={p.id}
                className="prompt-card liquid-card"
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                <div className="prompt-header">
                  <span className="prompt-tag">{p.tag}</span>
                  <button 
                    className={`copy-prompt-btn ${copiedPromptId === p.id ? 'copied' : ''}`}
                    onClick={() => handleCopyPrompt(p.id, p.text)}
                    type="button"
                  >
                    {copiedPromptId === p.id ? (
                      <>
                        <Check size={14} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy Prompt</span>
                      </>
                    )}
                  </button>
                </div>
                <h3 className="prompt-title">{p.title}</h3>
                <pre className="prompt-text">"{p.text}"</pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Deep Navy CTA Banner */}
      <section className="cta-section">
        <div className="container">
          <div 
            className="cta-banner liquid-card"
            onMouseMove={handleCardMouseMove}
            onMouseLeave={handleCardMouseLeave}
          >
            <div className="cta-content">
              <span className="badge-pill cta-badge">Get in Touch</span>
              <h2 className="cta-title">Let’s build something extraordinary together.</h2>
              <p className="cta-lead">
                Whether you need a digital transformation, a high-converting web presence, or specialized digital services, Assurance Digital is here to deliver.
              </p>
              <div className="cta-buttons">
                <a 
                  href="https://instagram.com/assurancedigital.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-white"
                >
                  <Send size={16} />
                  <span>DM on Instagram (@assurancedigital.in)</span>
                </a>
                <a 
                  href="https://assurancedigital.vercel.app" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-outline-white"
                >
                  <span>Explore Agency Portfolio</span>
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-container">
          <div className="footer-top-row">
            <div className="footer-brand-col">
              <div className="footer-brand">
                <img src="/abhinav.png" alt="Abhinav Upadhyay" className="footer-avatar" />
                <span className="footer-name">Abhinav Upadhyay</span>
              </div>
              <p className="footer-bio">
                18-year-old entrepreneur & freelancer. Founder of Assurance Digital, committed to delivering high-impact digital services and AI-driven systems.
              </p>
            </div>

            <div className="footer-nav-col">
              <div className="footer-nav-group">
                <h4>Recommended Tools</h4>
                <a href="https://antigravity.google/" target="_blank" rel="noopener noreferrer">Google Antigravity</a>
                <a href="https://claude.ai/new" target="_blank" rel="noopener noreferrer">Anthropic Claude</a>
                <a href="https://chatgpt.com/" target="_blank" rel="noopener noreferrer">OpenAI ChatGPT</a>
                <a href="https://elevenlabs.io/" target="_blank" rel="noopener noreferrer">ElevenLabs AI Voice</a>
              </div>

              <div className="footer-nav-group">
                <h4>Platforms</h4>
                <a href="https://assurancedigital.vercel.app" target="_blank" rel="noopener noreferrer">Assurance Digital Agency</a>
                <a href="https://assurancedigitalos.netlify.app" target="_blank" rel="noopener noreferrer">Assurance Digital OS</a>
                <a href="#about">About Abhinav</a>
                <a href="#prompts">AI Resources</a>
              </div>

              <div className="footer-nav-group">
                <h4>Connect & DB</h4>
                <a 
                  href="https://instagram.com/assurancedigital.in" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="highlight-link"
                >
                  Instagram (@assurancedigital.in)
                </a>
                <a href="mailto:contact@assurancedigital.in">Email Inquiries</a>
                <span style={{ fontSize: '12px', color: '#6B7A99' }}>
                  Backend: Supabase Cloud DB
                </span>
              </div>
            </div>
          </div>

          <div className="footer-bottom-row">
            <p className="copyright-text">
              &copy; {new Date().getFullYear()} Abhinav Upadhyay • Assurance Digital. All rights reserved.
            </p>
            <div className="footer-links-legal">
              <a href="#hero">Back to top ↑</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Toast Notification */}
      <div className={`toast-notification ${toastVisible ? 'show' : ''}`}>
        {toastMessage}
      </div>
    </div>
  );
}
