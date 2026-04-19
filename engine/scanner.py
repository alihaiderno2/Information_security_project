import requests
import os
import json
import sys
from datetime import datetime
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from engine.crawler import Crawler

class Scanner:
    def __init__(self,url):
        self.target_url = url
        self.Crawler = Crawler()

        self.payloads = self._load_payloads()
        self.results = []
        
    def _load_payloads(self):
        base_path = os.path.dirname(os.path.abspath(__file__))
        json_path = os.path.join(base_path,"payloads.json")
        
        try:
            with open(json_path,"r") as f:
                return json.load(f)
        except FileNotFoundError:
            print("Error: payloads.json not found!")
            return {"sqli": [], "xss": []}
    
    def run(self):
        print(f"Starting scan on {self.target_url}")
        
        forms = self.Crawler.get_forms(self.target_url)
        
        for form in forms:
            self._test_form_for_sqli(form)
            self._test_form_for_xss(form)
            
        self._save_results()
    
    def _test_form_for_sqli(self,form):
        
        for payload in self.payloads['sqli']:
            data = {}
            for input_tag in form["inputs"]:
                if input_tag["type"] != "submit":
                    data[input_tag["name"]] = payload
            
            if form["method"] == "post":
                res = requests.post(form["action"], data=data)
            else:
                res = requests.get(form["action"], params=data)
            
            if self._is_vulnerable(res.text):
                print(f"  POTENTIAL VULNERABILITY FOUND!")
                self.results.append({
                        "vulnerability": "SQL Injection",
                        "url": form["action"],
                        "payload": payload,
                        "method": form["method"].upper(),
                        "vector": data,
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    })

    def _test_form_for_xss(self,form):
        print(f"[*] Testing for XSS on: {form['action']}")
        for payload in self.payloads["xss"]:
            data = {}
            for input_tag in form["inputs"]:
                if input_tag["type"] != "submit":
                    data[input_tag["name"]] = payload

            try:
                if form["method"] == "post":
                    res = requests.post(form["action"], data=data)
                else:
                    res = requests.get(form["action"], params=data)
                
                if payload in res.text:
                    print(f"XSS vulnerability found {payload}")
                    
                    self.results.append({
                        "vulnerability": "Reflected XSS",
                        "url": form["action"],
                        "payload": payload,
                        "method": form["method"].upper(),
                        "vector": data,
                        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    })
            except requests.exceptions.ConnectionError:
                pass
        
    def _is_vulnerable(self, response_text):
        """Checks if the response contains common DB errors"""
        errors = [
            "you have an error in your sql syntax",
            "warning: mysql",
            "unclosed quotation mark",
            "quoted string not properly terminated"
        ]
        for error in errors:
            if error in response_text.lower():
                return True
        return False
    
    def _save_results(self):

        base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        
        data_dir = os.path.join(base_path, "data")
        os.makedirs(data_dir, exist_ok=True)
        
        file_path = os.path.join(data_dir, "results.json")
        
        with open(file_path, "w") as f:
            json.dump(self.results, f, indent=4)
            
        print(f"\n[+] Scan Complete. Report saved to: {file_path}")
    
if __name__ == "__main__":
    import sys
    
    if(len(sys.argv) > 1):
        target = sys.argv[1]
    else:
        target = "http://testphp.vulnweb.com/search.php" 
    
    print(f"Targeting: {target}")
    scan = Scanner(target)
    scan.run()