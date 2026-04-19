#  Automated Web Vulnerability Injector & Threat Visualization Dashboard

A Dynamic Application Security Testing (DAST) suite featuring an anomaly detection engine and a real-time React analytics dashboard. 

This tool automates the methodology of a human penetration tester: it maps the target attack surface, injects malicious payloads, and analyzes server responses to identify critical vulnerabilities like SQL Injection and Cross-Site Scripting (XSS).



---

## ✨ Core Features

* **Automated Surface Mapping:** Intelligently crawls target URLs to extract all `<form>` tags and `<input>` vectors.
* **Signature-Based Detection:** Injects centralized payloads (`payloads.json`) to detect explicitly reflected vulnerabilities (XSS) and database syntax errors (SQLi).
* **AI-Powered Blind Threat Detection:** Utilizes an unsupervised Machine Learning model (Scikit-Learn Isolation Forest) to establish a baseline of normal server response times, allowing it to catch Time-Based Blind SQL Injections that evade standard signature checks.
* **Real-Time Threat Dashboard:** A dark-mode, responsive React/Next.js frontend that translates raw JSON output into actionable intelligence for security teams.
* **Input Sanitization & Middleware:** Features a Node.js API bridge that validates and normalizes target URLs before triggering the Python execution environment.

##  Architecture & Tech Stack

* **Offensive Engine:** Python 3 (Requests, BeautifulSoup4, Subprocess)
* **AI / Machine Learning:** Scikit-Learn, NumPy
* **API Middleware:** Node.js, Express, CORS
* **Frontend Dashboard:** React, Vite, Recharts, Lucide-React

---

## 🚀 Installation & Setup

This is a full-stack application. You will need to install dependencies for the Python engine, the Node API, and the React frontend.

### 1. Python Engine (The Scanner)
Ensure you have Python 3 installed, then install the required mathematical and web libraries:
```bash
pip install requests beautifulsoup4 scikit-learn numpy
cd api
npm install express cors
cd dashboard
npm install recharts lucide-react
cd api
node server.js
Start the dashboard
cd dashboard
npm run dev


**Following is the Project Structure**
Vul-scanner/
├── api/                  # Node.js Express server bridging Python and React
│   └── server.js
├── dashboard/            # React/Vite Frontend interface
│   ├── src/
│   │   ├── App.jsx       # Main Dashboard UI and scan logic
│   │   └── App.css       # Dark-mode Cyber styling
├── data/                 # Output directory
│   └── results.json      # Structured vulnerability logs (Ignored in Git)
├── engine/               # Core Python DAST Engine
│   ├── crawler.py        # Maps target attack surface
│   ├── scanner.py        # Injects payloads and analyzes text responses
│   ├── anomaly.py        # ML Isolation Forest for response-time anomalies
│   └── payloads.json     # Centralized attack dictionary
└── README.md
