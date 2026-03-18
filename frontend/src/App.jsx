import React, { useState, useEffect, useRef } from 'react';
import { 
  Network, Settings, Database, Activity, LayoutTemplate, Shield, 
  Send, RefreshCw, CheckCircle, FileText, Globe, Share2, 
  ChevronRight, Terminal, Zap, ArrowRight, PlayCircle, XCircle, 
  Linkedin, Slack, UploadCloud, BookOpen
} from 'lucide-react';
import './index.css';

const rawUrl = import.meta.env.VITE_API_URL || '';
const API_BRL = rawUrl ? (rawUrl.endsWith('/api') ? rawUrl : rawUrl.replace(/\/$/, '') + '/api') : '/api';

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="sidebar">
    <div className="logo-section">
      <Network className="logo-icon" size={28} />
      <span>EnterpriseAI</span>
    </div>
    <nav>
      <div className={`nav-item ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={() => setActiveTab('pipeline')}>
        <LayoutTemplate size={20} /> Content Pipeline
      </div>
      <div className={`nav-item ${activeTab === 'intelligence' ? 'active' : ''}`} onClick={() => setActiveTab('intelligence')}>
        <Activity size={20} /> Content ROI & Impact
      </div>
      <div className={`nav-item ${activeTab === 'brand' ? 'active' : ''}`} onClick={() => setActiveTab('brand')}>
        <Shield size={20} /> Brand Center
      </div>
      <div className={`nav-item ${activeTab === 'knowledge' ? 'active' : ''}`} onClick={() => setActiveTab('knowledge')}>
        <Database size={20} /> Knowledge Base
      </div>
    </nav>
  </aside>
);

const PipelineVisualizer = ({ status, logs }) => {
  const steps = [
    { id: 'ingest', label: 'Knowledge Ingestion', icon: <Database size={18} /> },
    { id: 'draft', label: 'Drafting Agent', icon: <FileText size={18} /> },
    { id: 'review', label: 'Explainable Compliance', icon: <Shield size={18} /> },
    { id: 'localize', label: 'Localization Engine', icon: <Globe size={18} /> },
    { id: 'publish', label: 'Multi-Channel Push', icon: <Share2 size={18} /> }
  ];

  let currentStepIdx = -1;
  if (status === 'COMPLETED') currentStepIdx = 5;
  else if (logs.some(l => l.message.includes("Distribution Agent"))) currentStepIdx = 4;
  else if (logs.some(l => l.message.includes("Localization Agent"))) currentStepIdx = 3;
  else if (status === 'AWAITING_APPROVAL') currentStepIdx = 2;
  else if (logs.some(l => l.message.includes("Brand Governance"))) currentStepIdx = 2;
  else if (logs.some(l => l.message.includes("Drafting Agent"))) currentStepIdx = 1;

  return (
    <div className="pipeline-steps-container" style={{display: 'flex', justifyContent: 'space-between', width: '100%', padding: '0 20px', flexWrap: 'wrap'}}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStepIdx || status === 'COMPLETED';
        const isActive = idx === currentStepIdx && status !== 'IDLE' && status !== 'COMPLETED';
        const isWaiting = isActive && status === 'AWAITING_APPROVAL';

        let bg = 'var(--panel-bg)';
        let iconColor = 'var(--text-muted)';
        
        if (isWaiting) { 
          bg = 'rgba(245, 158, 11, 0.2)'; 
          iconColor = 'var(--warning-color)'; 
        } else if (isCompleted) {
          bg = 'var(--success-color)';
          iconColor = '#fff';
        } else if (isActive) {
          bg = 'rgba(59, 130, 246, 0.2)';
          iconColor = 'var(--accent-color)';
        }

        return (
          <div key={step.id} className={`step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
            <div className="step-circle" style={{background: bg, borderColor: isWaiting ? 'var(--warning-color)' : ''}}>
              {isWaiting ? <Shield size={22} color="var(--warning-color)"/> :
               isCompleted ? <CheckCircle size={24} color={iconColor}/> : 
               (isActive ? <RefreshCw size={22} className="loader" style={{border: 'none', color: iconColor}} /> : 
               React.cloneElement(step.icon, {color: iconColor}))}
            </div>
            <span className="step-label" style={{position: 'absolute', top: '65px', whiteSpace: 'nowrap', color: isWaiting ? 'var(--warning-color)' : ''}}>
              {isWaiting ? "Action Required" : step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const LandingPage = ({ onEnter }) => {
  return (
    <div style={{
      minHeight: '100vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'radial-gradient(circle at 50% -20%, rgba(59, 130, 246, 0.15) 0%, var(--bg-color) 70%)',
      color: '#fff',
      padding: '2rem',
      textAlign: 'center'
    }} className="fade-in">
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        background: 'rgba(59, 130, 246, 0.1)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        borderRadius: '30px',
        color: 'var(--accent-color)',
        fontWeight: 'bold',
        marginBottom: '2rem'
      }}>
        <Activity size={20} /> V2.0 SYSTEM ONLINE
      </div>
      
      <h1 className="landing-title" style={{ fontSize: '4.5rem', fontWeight: '800', lineHeight: '1.2', marginBottom: '1.5rem', letterSpacing: '-1px' }}>
        <span style={{color: 'var(--text-main)'}}>Enterprise</span>
        <span style={{color: 'var(--accent-color)'}}>AI</span>
      </h1>
      
      <p style={{ fontSize: '1.3rem', color: 'var(--text-muted)', maxWidth: '700px', lineHeight: '1.6', marginBottom: '3rem' }}>
        Autonomous Content Operations — From Raw Data to Compliant Distribution in Minutes. Engineered for global scale and zero compliance risk.
      </p>

      <div style={{ display: 'flex', gap: '2rem', marginBottom: '4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <div className="landing-card" style={{ textAlign: 'left', background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '250px' }}>
          <Shield size={28} color="var(--success-color)" style={{marginBottom: '1rem'}}/>
          <div style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)'}}>Predictable Compliance</div>
          <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5'}}>Automated legal & regulatory guardrails applied to every generation.</div>
        </div>
        <div className="landing-card" style={{ textAlign: 'left', background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '250px' }}>
          <Zap size={28} color="var(--warning-color)" style={{marginBottom: '1rem'}}/>
          <div style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)'}}>Autonomous Pipelines</div>
          <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5'}}>From unstructured notes to multi-format distribution without human labor.</div>
        </div>
        <div className="landing-card" style={{ textAlign: 'left', background: 'var(--panel-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: '250px' }}>
          <Globe size={28} color="var(--accent-secondary)" style={{marginBottom: '1rem'}}/>
          <div style={{fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text-main)'}}>Global Localization</div>
          <div style={{color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5'}}>Instant culturally-aware adaptations for EU, NA, and APAC markets.</div>
        </div>
      </div>

      <button 
        onClick={onEnter} 
        style={{
          background: 'var(--text-main)', 
          color: 'var(--bg-color)', 
          padding: '1.2rem 3rem', 
          fontSize: '1.2rem', 
          fontWeight: 'bold',
          borderRadius: '8px',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 0 40px rgba(255,255,255,0.15)',
          transition: 'all 0.3s ease'
        }}
        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 50px rgba(255,255,255,0.25)'; }}
        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,255,255,0.15)'; }}
      >
        <Network size={24} /> INITIALIZE PLATFORM
      </button>
    </div>
  );
};

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [apiKey, setApiKey] = useState('');
  const [isDemoMode, setIsDemoMode] = useState(true);
  const [dataContext, setDataContext] = useState("");
  const [audience, setAudience] = useState("");
  
  const [taskId, setTaskId] = useState(null);
  const [taskStatus, setTaskStatus] = useState('IDLE');
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  
  const [resultTab, setResultTab] = useState('cleanDraft');
  const terminalRef = useRef(null);
  const [pubStatus, setPubStatus] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Poll for task status
  useEffect(() => {
    let interval;
    if (taskId && (taskStatus === 'RUNNING' || taskStatus === 'AWAITING_APPROVAL')) {
      interval = setInterval(async () => {
        try {
          const res = await fetch(`${API_BRL}/tasks/${taskId}`);
          const data = await res.json();
          setTaskStatus(data.status);
          setLogs(data.logs);
          setResults(data.results);
          if (data.status === 'COMPLETED' || data.status === 'FAILED') {
            clearInterval(interval);
          }
        } catch (e) { console.error(e); }
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [taskId, taskStatus]);

  // Autoscroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleDemoScenario = () => {
    setDataContext(`AcmeSphere 2.0 Notes 10/12:
- DB scaling is done, 50% faster processing globally.
- We 100% guarantee no downtime for users.
- Absolute foolproof integration for enterprise partners.
- Must push immediately to all clients.`);
    setAudience('Enterprise Cloud Architects (EU & US)');
  };

  const runPipeline = async () => {
    if (!isDemoMode && !apiKey) return alert("Please enter your Gemini API Key or switch to Demo Mode.");
    setTaskStatus('RUNNING');
    setLogs([{time: new Date().toISOString(), message: "Initializing multi-agent pipeline..."}]);
    setResults(null);
    setResultTab('cleanDraft');
    setPubStatus(null);

    try {
      const res = await fetch(`${API_BRL}/pipeline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, dataContext, targetAudience: audience, isDemoMode })
      });
      const data = await res.json();
      if (res.ok) setTaskId(data.taskId);
      else setTaskStatus('FAILED');
    } catch (e) {
      setTaskStatus('FAILED');
      setLogs(prev => [...prev, { time: new Date().toISOString(), message: "Error connecting to backend." }]);
    }
  };

  const approveCompliance = async () => {
    setTaskStatus('RUNNING');
    setLogs(prev => [...prev, { time: new Date().toISOString(), message: "Human Approval Received: Authorizing Localization..." }]);
    try {
      await fetch(`${API_BRL}/tasks/${taskId}/approve`, { method: 'POST' });
    } catch(e) { console.error("Approval failed", e); }
  };

  const fakePublish = (channel) => {
    showToast(`Publishing to ${channel}...`);
    setTimeout(() => {
      showToast(`✔ Successfully published to ${channel}. Scheduled for 9:00 AM EST.`);
    }, 1500);
  };

  const fakeSync = () => {
    showToast(`🔄 Syncing enterprise data repositories...`);
    setTimeout(() => showToast(`✔ Data sources synchronized successfully. 12 new vectors added.`), 2000);
  };

  const fakeUpload = () => {
    showToast(`🔌 Initializing generic CRM connector...`);
    setTimeout(() => showToast(`✔ Secure connection to external pipeline established.`), 2000);
  };

  if (showLanding) return <LandingPage onEnter={() => setShowLanding(false)} />;

  return (
    <div className="app-container fade-in">
      {/* Global Toast Notification */}
      {toastMsg && (
        <div className="toast-container">
          <CheckCircle size={22} color="var(--success-color)"/>
          {toastMsg}
        </div>
      )}

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="main-content">
        {isDemoMode && (
          <div style={{background: 'var(--warning-bg)', color: 'var(--warning-color)', padding: '10px', textAlign: 'center', fontWeight: '600', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', borderBottom: '1px solid #fcd34d'}}>
            <Shield size={16}/> 🟡 Demo Mode Active (Simulated AI Responses) — No API Key Required
          </div>
        )}
        <header className="header" style={{top: isDemoMode ? '36px' : '0'}}>
          <div>
            <h1>{activeTab === 'pipeline' ? 'Autonomous Content Factory' : 
                 activeTab === 'intelligence' ? 'Pipeline Impact ROI' : 
                 activeTab === 'brand' ? 'Brand Governance' : 'Knowledge Base'}</h1>
            <p style={{fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px', fontWeight: '500'}}>Autonomous Content Operations — From Raw Data to Compliant Distribution in Minutes</p>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <div style={{display: 'flex', background: 'var(--panel-bg)', borderRadius: '20px', padding: '4px', border: '1px solid var(--border-color)', fontSize: '0.85rem'}}>
              <div 
                onClick={()=>setIsDemoMode(!isDemoMode)}
                style={{padding: '4px 12px', borderRadius: '16px', cursor: 'pointer', background: !isDemoMode ? 'var(--text-main)' : 'transparent', color: !isDemoMode ? 'var(--text-inverse)' : 'var(--text-muted)'}}
              >🟢 Live Mode</div>
              <div 
                onClick={()=>setIsDemoMode(!isDemoMode)}
                style={{padding: '4px 12px', borderRadius: '16px', cursor: 'pointer', background: isDemoMode ? 'var(--warning-color)' : 'transparent', color: isDemoMode ? '#000' : 'var(--text-muted)'}}
              >🟡 Demo Mode</div>
            </div>
            
            {!isDemoMode && (
              <div className="api-key-input" style={{animation: 'fadeIn 0.3s ease'}}>
                <Settings size={18} color="var(--text-muted)" />
                <input 
                  type="password" 
                  placeholder="Google Gemini API Key" 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  style={{ width: '220px' }}
                />
              </div>
            )}
          </div>
        </header>

        <div className="dashboard">

          {/* IMPACT SNAPSHOT (Winning Layer Update) */}
          <div style={{display: 'flex', gap: '1.5rem', flexWrap: 'wrap'}}>
            <div className="card fade-in" style={{flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--accent-color)'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Estimated Savings</div>
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '12px', lineHeight: 1}}>$24.5<span style={{fontSize: '1.25rem', color: 'var(--text-muted)'}}>k /mo</span></div>
            </div>
            <div className="card fade-in" style={{flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--accent-secondary)'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Content Cycle Time</div>
              <div style={{display: 'flex', alignItems: 'flex-end', gap: '12px', marginTop: '12px'}}>
                <span style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1}}>4 mins</span>
                <span style={{color: 'var(--text-muted)', textDecoration: 'line-through', marginBottom: '4px'}}>6 hrs</span>
              </div>
            </div>
            <div className="card fade-in" style={{flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--warning-color)'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Output Consistency</div>
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '12px', lineHeight: 1}}>↑ 3.1x</div>
            </div>
            <div className="card fade-in" style={{flex: 1, padding: '1.5rem', borderLeft: '4px solid var(--success-color)'}}>
              <div style={{color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px'}}>Compliance Errors</div>
              <div style={{fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '12px', lineHeight: 1}}>↓ 82%</div>
            </div>
          </div>

          {activeTab === 'pipeline' && (
            <>
              {/* Agent Architecture Visualizer */}
              <div className="agent-node-graph fade-in">
                <div style={{position: 'absolute', top: '-10px', left: '10px', fontSize: '0.75rem', color: 'var(--text-muted)'}}>Active Topology</div>
                <div className="agent-node"><Database size={16} color="var(--accent-color)"/> Knowledge Agent</div>
                <ChevronRight className="agent-arrow" />
                <div className="agent-node"><FileText size={16} color="var(--accent-secondary)"/> Drafting Agent</div>
                <ChevronRight className="agent-arrow" />
                <div className="agent-node" style={{borderColor: 'var(--success-color)'}}><Shield size={16} color="var(--success-color)"/> Review Agent</div>
                <ChevronRight className="agent-arrow" />
                <div className="agent-node"><Globe size={16} color="var(--warning-color)"/> Localization</div>
              </div>

              <div className="card fade-in" style={{animationDelay: '0.1s'}}>
                <div style={{display:'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <h2><BookOpen size={20}/> 1. Knowledge Initialization</h2>
                  <button onClick={handleDemoScenario} className="btn" style={{padding: '6px 14px', fontSize: '0.85rem', borderColor: 'var(--accent-color)'}}>
                    <PlayCircle size={16} color="var(--accent-color)"/> Run Demo Scenario
                  </button>
                </div>
                
                <div className="form-group" style={{marginTop: '1rem'}}>
                  <label>Internal Data Context (Messy Notes, Slacks, Specs)</label>
                  <textarea 
                    rows={4} 
                    value={dataContext}
                    onChange={(e) => setDataContext(e.target.value)}
                    placeholder="Paste raw data here..."
                  />
                </div>
                <div className="form-group">
                  <label>Target Audience Target</label>
                  <input 
                    type="text" 
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    placeholder="e.g., Enterprise Cloud Architects"
                  />
                </div>

                {/* Intelligence Loop Badge */}
                <div style={{background: 'var(--warning-bg)', padding: '12px', borderRadius: '8px', borderLeft: '4px solid var(--warning-color)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '12px'}}>
                  <Zap size={20} color="var(--warning-color)"/>
                  <div>
                    <div style={{fontSize: '0.85rem', fontWeight: 600, color: 'var(--warning-color)'}}>⚡ Strategy Auto-Applied via Intelligence Engine</div>
                    <div style={{fontSize: '0.85rem', color: 'var(--text-muted)'}}>- Tone reduced by 15% promotional bias <br/>- Format automatically switched to Technical Deep-Dive</div>
                  </div>
                </div>

                <button 
                  className="btn btn-primary" 
                  onClick={runPipeline}
                  disabled={taskStatus === 'RUNNING'}
                  style={{width: '100%', padding: '14px', fontSize: '1.05rem', letterSpacing: '1px'}}
                >
                  {taskStatus === 'RUNNING' ? <RefreshCw className="loader" size={20} /> : <Send size={20} />}
                  EXECUTE AUTONOMOUS PIPELINE
                </button>
              </div>

              {(taskStatus !== 'IDLE') && (
                <div className="card fade-in" style={{animationDelay: '0.2s'}}>
                  <h2><Activity size={20}/> 2. Agent Orchestration Tracker</h2>
                  
                  {/* Progress Bar Container */}
                  <div style={{position: 'relative', height: '120px', margin: '1rem 0.5rem'}}>
                    <div style={{position: 'absolute', top: '50%', left: '0', right: '0', height: '3px', background: 'var(--border-color)', zIndex: 0}}></div>
                    <div style={{
                      position: 'absolute', top: '50%', left: '0', height: '3px', 
                      background: 'var(--text-main)', zIndex: 1,
                      boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                      width: taskStatus === 'COMPLETED' ? '100%' : 
                             logs.some(l => l.message.includes("Distribution Agent")) ? '80%' : 
                             logs.some(l => l.message.includes("Localization Agent")) ? '60%' : 
                             taskStatus === 'AWAITING_APPROVAL' ? '50%' :
                             logs.some(l => l.message.includes("Brand Governance")) ? '40%' : 
                             logs.some(l => l.message.includes("Drafting Agent")) ? '20%' : '5%',
                      transition: 'width 0.8s ease-in-out'
                    }}></div>
                    
                    <div style={{display: 'flex', justifyContent: 'space-between', position: 'relative', zIndex: 2, top: '25px'}}>
                      <PipelineVisualizer status={taskStatus} logs={logs} />
                    </div>
                  </div>
                  
                  <div className="terminal" ref={terminalRef}>
                    <div className="terminal-header">
                      <div style={{display:'flex', gap:'6px'}}>
                        <div className="term-dot red"></div><div className="term-dot yellow"></div><div className="term-dot green"></div>
                      </div>
                      <span style={{marginLeft: '10px', color: '#94a3b8', fontSize: '0.8rem'}}>agent-orchestrator.exe</span>
                    </div>
                    {logs.map((L, i) => (
                      <p key={i}><span className="time">{new Date(L.time).toLocaleTimeString()}</span> <span className="agent-prefix">sys»</span> {L.message}</p>
                    ))}
                    
                    {taskStatus === 'COMPLETED' && (
                      <div style={{marginTop: '20px', padding: '16px', borderTop: '1px solid #1e293b', background: 'rgba(16, 185, 129, 0.05)', borderRadius: '8px', color: '#10b981', display: 'flex', flexDirection: 'column', gap: '8px', animation: 'fadeIn 0.5s ease-out'}}>
                        <div style={{fontWeight: 'bold', fontSize: '1rem', color: '#34d399'}}>✔ Pipeline Completed Successfully</div>
                        <div><span style={{color: '#94a3b8'}}>Mode:</span> {isDemoMode ? 'Demo (AI Simulation)' : 'Live'}</div>
                        <div><span style={{color: '#94a3b8'}}>Compliance Score:</span> 98%</div>
                        <div><span style={{color: '#94a3b8'}}>Content Generated:</span> 4 formats</div>
                        <div><span style={{color: '#94a3b8'}}>Estimated Time Saved:</span> ~5.5 hours</div>
                      </div>
                    )}
                  </div>
                  {taskStatus === 'RUNNING' && <p style={{marginTop: '1rem'}}><span className="loader" style={{display:'inline-block', width: '12px', height: '12px', marginRight: '8px', borderWidth: '2px'}}></span> <i>Agents are operating...</i></p>}
                </div>
              )}

              {/* Step 3.5: Human Approval Gate */}
              {taskStatus === 'AWAITING_APPROVAL' && results?.reviewReport && (
                <div className="card fade-in" style={{border: '1px solid var(--warning-color)', boxShadow: '0 0 30px rgba(245, 158, 11, 0.15)'}}>
                  <h2><Shield size={20} color="var(--warning-color)"/> Human Approval Gate: Compliance Engine</h2>
                  <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                    The Brand Governance Agent halted the pipeline because policy violations were detected in the draft. Review the explainable mapping below.
                  </p>

                  <div className="result-box">
                    {results.reviewReport.explainableIssues?.length === 0 ? (
                      <div style={{color: 'var(--success-color)'}}>✔ No issues found by Compliance Engine.</div>
                    ) : (
                      results.reviewReport.explainableIssues?.map((issue, idx) => (
                        <div key={idx} style={{padding: '16px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '1rem'}}>
                          <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start'}}>
                            <XCircle size={18} color="var(--danger-color)" style={{marginTop: '2px', flexShrink: 0}} />
                            <div style={{flex: 1}}>
                              <div style={{fontWeight: '600', color: 'var(--danger-color)', textDecoration: 'line-through'}}>{issue.original}</div>
                              <div style={{color: 'var(--danger-color)', fontSize: '0.85rem', fontWeight: 600, marginTop: '4px'}}>→ Violates: {issue.reason}</div>
                            </div>
                          </div>
                          <div style={{display: 'flex', gap: '12px', alignItems: 'flex-start', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-highlight)'}}>
                            <CheckCircle size={18} color="var(--success-color)" style={{marginTop: '2px', flexShrink: 0}} />
                            <div style={{flex: 1}}>
                              <div style={{fontWeight: '700', color: 'var(--success-color)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px'}}>✅ Rewritten:</div>
                              <div style={{color: 'var(--text-main)', fontWeight: '500'}}>{issue.suggestedFix}</div>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div style={{display: 'flex', gap: '1rem', marginTop: '1.5rem'}}>
                    <button className="btn" onClick={approveCompliance} style={{flex: 1, padding: '16px', background: 'var(--text-main)', color: 'var(--bg-color)', border: 'none'}}>
                      <CheckCircle size={20}/> Approve Fixes & Proceed
                    </button>
                    <button className="btn" style={{flex: 1, padding: '16px', border: '1px solid var(--warning-color)', color: 'var(--warning-color)'}}>
                      <RefreshCw size={20}/> Request Revision from AI
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Final Publish View */}
              {taskStatus === 'COMPLETED' && results?.cleanDraft && (
                <div className="card fade-in" style={{animationDelay: '0.3s', border: '1px solid var(--success-color)'}}>
                  <h2><Share2 size={20} color="var(--success-color)"/> Ready for Distribution</h2>
                  
                  <div className="tabs">
                    <div className={`tab ${resultTab === 'cleanDraft' ? 'active' : ''}`} onClick={() => setResultTab('cleanDraft')}>Clean HQ Draft</div>
                    <div className={`tab ${resultTab === 'localize' ? 'active' : ''}`} onClick={() => setResultTab('localize')}>Localized Markets</div>
                    <div className={`tab ${resultTab === 'channels' ? 'active' : ''}`} onClick={() => setResultTab('channels')}>Social Formats</div>
                  </div>

                  <div className="result-box" style={{position: 'relative'}}>
                    {resultTab === 'cleanDraft' && results.cleanDraft}
                    
                    {resultTab === 'localize' && results.localized && (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <div>
                          <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px'}}>🇪🇺 European Union Version</div>
                          <div style={{color: 'var(--text-muted)'}}>{results.localized.EU_Version}</div>
                          <div style={{marginTop: '12px'}}><span className="badge badge-success" style={{marginRight: '8px'}}>GDPR Compliant Footer Added</span> <span className="badge badge-warning">Tone: Data-Centric</span></div>
                        </div>
                        <div>
                          <div style={{fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px'}}>🇺🇸 NA Version</div>
                          <div style={{color: 'var(--text-muted)'}}>{results.localized.US_Version}</div>
                          <div style={{marginTop: '12px'}}><span className="badge badge-success">Performance Metrics Highlighted</span></div>
                        </div>
                      </div>
                    )}
                    
                    {resultTab === 'channels' && results.channels && (
                      <div style={{display: 'flex', flexDirection: 'column', gap: '2rem'}}>
                        <div>
                          <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px'}}><Linkedin size={18} style={{marginRight: '6px', verticalAlign: 'middle', color: '#0077b5'}}/> LinkedIn Post</div>
                          <div style={{background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px'}}>{results.channels.LinkedIn}</div>
                        </div>
                        <div>
                          <div style={{fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--text-main)', marginBottom: '8px'}}><XCircle size={18} style={{marginRight: '6px', verticalAlign: 'middle'}}/> X / Twitter Thread</div>
                          <div style={{background: 'var(--bg-color)', padding: '1rem', borderRadius: '8px'}}>{results.channels.Twitter}</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* FAKE INTEGRATIONS NOW USE GLOBAL TOAST */}
                  <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem'}}>
                    <button className="btn" onClick={() => fakePublish("LinkedIn")} style={{background: '#0a66c2', color: '#fff', border: 'none'}}><Linkedin size={16}/> Publish to LinkedIn</button>
                    <button className="btn" onClick={() => fakePublish("Slack")} style={{background: '#4A154B', color: '#fff', border: 'none'}}><Slack size={16}/> Send to Slack Approvals</button>
                    <button className="btn" onClick={() => fakePublish("CMS")} style={{borderColor: 'var(--accent-color)', color: 'var(--text-main)'}}><UploadCloud size={16}/> Export to Enterprise CMS</button>
                  </div>

                </div>
              )}
            </>
          )}

          {activeTab === 'intelligence' && (
            <div className="card fade-in">
              <h2><Activity size={20}/> Content Intelligence Engine</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                The intelligence agent continuously monitors cross-channel performance to optimize future generation parameters automatically.
              </p>
              
              <div className="chart-container fade-in" style={{animationDelay: '0.3s'}}>
                <div className="chart-bar" style={{height: '30%'}}><div className="chart-label">Oct</div></div>
                <div className="chart-bar" style={{height: '45%'}}><div className="chart-label">Nov</div></div>
                <div className="chart-bar" style={{height: '60%'}}><div className="chart-label">Dec</div></div>
                <div className="chart-bar" style={{height: '85%'}}><div className="chart-label">Jan</div></div>
                <div className="chart-bar highlighted" style={{height: '100%'}}>
                   <div style={{position: 'absolute', top: '-30px', width: '100%', textAlign: 'center', color: 'var(--text-main)', fontWeight: 'bold'}}>5x Output</div>
                   <div className="chart-label" style={{fontWeight: '800', color: 'var(--text-main)'}}>Feb (AI)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brand' && (
            <div className="card fade-in">
              <h2><Shield size={20}/> Brand Governance Ruleset</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                These rules are dynamically enforced by the Review Agent during the pipeline execution. Any violations block distribution until a human approves or the automated fallback modifies the content.
              </p>
              <div className="result-box">
                <h3 style={{color: 'var(--text-main)', fontSize: '1.1rem', marginBottom: '1rem'}}>Active Corporate Compliance Guardrails</h3>
                <ul style={{marginLeft: '1.5rem', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '16px', color: 'var(--text-muted)', lineHeight: '1.5'}}>
                  <li><CheckCircle size={16} color="var(--success-color)" style={{marginRight: '8px', verticalAlign: 'middle'}}/> <strong>No absolute guarantees:</strong> Never use terms like "100% secure", "guaranteed success", "absolute", or "foolproof".</li>
                  <li><CheckCircle size={16} color="var(--success-color)" style={{marginRight: '8px', verticalAlign: 'middle'}}/> <strong>Brand Tone:</strong> Ensure text is professional, authoritative, but empathetic and human-readable for C-Suite.</li>
                  <li><CheckCircle size={16} color="var(--success-color)" style={{marginRight: '8px', verticalAlign: 'middle'}}/> <strong>Regulatory (GDPR/CCPA):</strong> Mandatory inclusion of explicit data processing disclaimers on all posts targeting European regions.</li>
                  <li><CheckCircle size={16} color="var(--success-color)" style={{marginRight: '8px', verticalAlign: 'middle'}}/> <strong>Terminology Standard:</strong> Strict adherence to 'AcmeSphere 2.0'. Do not omit the version number.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="card fade-in">
              <h2><Database size={20}/> Enterprise Knowledge Base</h2>
              <p style={{color: 'var(--text-muted)', marginBottom: '1.5rem'}}>
                The intelligent ingestion layer seamlessly parses internal documents, meeting transcripts, and product specifications to feed context parameters into the Drafting Agent's reasoning window.
              </p>
              
              <div style={{display: 'flex', gap: '1rem', marginBottom: '2rem'}}>
                <input type="text" placeholder="Search enterprise knowledge vectors..." style={{flex: 1}}/>
                <button className="btn btn-primary" onClick={fakeSync}><RefreshCw size={16}/> Sync Source Repositories</button>
              </div>

              <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                <div className="card" style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem'}}>
                  <div style={{padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-color)'}}>
                    <FileText size={24}/>
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{color: 'var(--text-main)', fontWeight: 'bold'}}>AcmeSphere_2.0_Product_Specs_Q3.pdf</div>
                    <div style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Ingested 2 hrs ago • 142 embedded vectors processed</div>
                  </div>
                  <CheckCircle color="var(--success-color)"/>
                </div>
                <div className="card" style={{display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem'}}>
                  <div style={{padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: '8px', color: 'var(--accent-secondary)'}}>
                    <Database size={24}/>
                  </div>
                  <div style={{flex: 1}}>
                    <div style={{color: 'var(--text-main)', fontWeight: 'bold'}}>Engineering_Slack_Export_Helios.csv</div>
                    <div style={{color: 'var(--text-muted)', fontSize: '0.85rem'}}>Ingested 1 day ago • 530 message nodes extracted</div>
                  </div>
                  <CheckCircle color="var(--success-color)"/>
                </div>
                <div className="card" onClick={fakeUpload} style={{display: 'flex', alignItems: 'center', gap: '1rem', borderStyle: 'dashed', borderColor: 'var(--border-highlight)', justifyContent: 'center', cursor: 'pointer', padding: '1.5rem', transition: 'all 0.2s', background: 'transparent', boxShadow: 'none'}}>
                  <div style={{color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <UploadCloud size={20}/>
                    <span style={{fontWeight: 600}}>Connect New Data Source Pipeline</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
