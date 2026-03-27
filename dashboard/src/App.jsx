import React, {useState, useEffect} from "react";

function App() {
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/results').then(res=>res.json()).then(data=>{
      setFindings(data);
      setLoading(false);
    }
  ).catch(err=>{
    console.error("Error fetching data:", err);
    setLoading(false);
  }
  );
},[]);

if (loading) return <div className="loading">Loading Security Data...</div>;

}