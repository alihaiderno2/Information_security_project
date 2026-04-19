import React, {useState, useEffect} from "react";
import { ShieldAlert, Shield, Activity, Bug, Search, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [targetUrl, setTargetUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/api/results').then(res=>res.json()).then(data=>{
      if (Array.isArray(data)) {
          setFindings(data);
        } else {
          setFindings([]);
        }
      setLoading(false);
    }
  ).catch(err=>{
    console.error("Error fetching data:", err);
    setLoading(false);
  }
  );
},[]);

const handleScan = () => {
    if (!targetUrl) return alert("Please enter a valid URL");
    
    setIsScanning(true); 
    
    fetch('http://localhost:5000/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: targetUrl })
    })
    .then(res => res.json())
    .then(data => {
      setFindings(Array.isArray(data) ? data : []);
      setIsScanning(false); 
    })
    .catch(err => {
      console.error("Error running scan:", err);
      setIsScanning(false);
      alert("Scan failed. Check the Node.js terminal for errors.");
    });
  };

  if (loading && !isScanning) return <div className="loading">Loading Security Data...</div>;

  const totalFindings = findings.length;  
  const sqlicount = findings.filter(f => f.vulnerability === 'SQL Injection').length;
  const xsscount = findings.filter(f => f.vulnerability === 'Reflected XSS').length;

  const chartData = [
    {name: 'SQL Injection', value: sqlicount, color : '#FF6384'},
    {name: 'Reflected XSS', value: xsscount, color : '#36A2EB'},
  ]

  return (
    <div className="dashboard-container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Shield size={32} className="logo-icon" color="#38bdf8" />
          <h2>Artemis DAST Engine - Threat Report</h2>
        </div>
        
        {/* NEW SEARCH BAR UI */}
        <div className="scan-controls" style={{ display: 'flex', gap: '10px' }}>
          <input 
            type="text" 
            placeholder="http://target-website.com" 
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #334155', background: '#0f172a', color: 'white', width: '300px' }}
          />
          <button 
            onClick={handleScan}
            disabled={isScanning}
            style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', background: isScanning ? '#334155' : '#38bdf8', color: 'white', cursor: isScanning ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 'bold' }}
          >
            {isScanning ? <Loader2 className="spinner" size={18} /> : <Search size={18} />}
            {isScanning ? 'Scanning...' : 'Launch Scan'}
          </button>
        </div>
      </header>
      {isScanning && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', padding: '15px', borderRadius: '8px', marginBottom: '20px', color: '#ef4444', textAlign: 'center', fontWeight: 'bold' }}>
          ⚠️ ACTIVE SCAN IN PROGRESS. INJECTING PAYLOADS INTO TARGET ARCHITECTURE...
        </div>
      )}
      

      {/* Summary Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <Bug size={24} color="#64748b" />
          <div className="stat-details">
            <h3>Total Vulnerabilities</h3>
            <p className="stat-number">{totalFindings}</p>
          </div>
        </div>
        <div className="stat-card critical">
          <ShieldAlert size={24} color="#ef4444" />
          <div className="stat-details">
            <h3>High Risk (SQLi)</h3>
            <p className="stat-number">{sqlicount}</p>
          </div>
        </div>
        <div className="stat-card medium">
          <Activity size={24} color="#f97316" />
          <div className="stat-details">
            <h3>Medium Risk (XSS)</h3>
            <p className="stat-number">{xsscount}</p>
          </div>
        </div>
      </div>

      <div className="main-content">
        {/* Chart Section */}
        <div className="chart-section">
          <h2>Threat Distribution</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={chartData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Data Table Section */}
        <div className="table-section">
          <h2>Raw Findings</h2>
          <table className="vuln-table">
            <thead>
              <tr>
                <th>Severity</th>
                <th>Type</th>
                <th>Target URL</th>
                <th>Payload Injected</th>
              </tr>
            </thead>
            <tbody>
              {findings.map((vuln, index) => (
                <tr key={index}>
                  <td>
                    <span className={`badge ${vuln.vulnerability === 'SQL Injection' ? 'badge-high' : 'badge-med'}`}>
                      {vuln.vulnerability === 'SQL Injection' ? 'High' : 'Medium'}
                    </span>
                  </td>
                  <td>{vuln.vulnerability}</td>
                  <td className="url-cell">{vuln.url}</td>
                  <td className="code-cell"><code>{vuln.payload}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )

}
export default App;