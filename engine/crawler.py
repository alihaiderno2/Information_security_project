import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin

class Crawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        })
        
    def get_forms(self,url):
        try:
            response = self.session.get(url)
            
            response.raise_for_status()
        except requests.exceptions.RequestException as e:
            print(f"Connection error : {e}")
            return []
        
        soup = BeautifulSoup(response.content,'html.parser')
        forms = soup.find_all('form')
        print(f"Found {len(forms)} forms.")
        
        form_details = []
        for form in forms:
            details = self._extract_form_details(form,url)
            form_details.append(details)
        return form_details
    
    def _extract_form_details(self, form, base_url):
        action = form.attrs.get('action',"").lower()
        method = form.attrs.get('method',"get").lower()
        
        full_url = urljoin(base_url,action)
        
        inputs = []
        for input_tag in form.find_all("input"):
            input_type = input_tag.attrs.get("type","text")
            input_name = input_tag.attrs.get("name")
            if input_name:
                inputs.append({"type":input_type,"name":input_name})
                
        return {
            "action": full_url,
            "method": method,
            "inputs": inputs
        }
        
if __name__ == "__main__":
    # Test on a safe site or your local DVWA instance
    test_url = "http://google.com"  # Or "http://localhost/dvwa/login.php"
    bot = Crawler()
    found_forms = bot.get_forms(test_url)
    for i, f in enumerate(found_forms):
        print(f"\nForm #{i+1}:")
        print(f"  Target URL: {f['action']}")
        print(f"  Method: {f['method'].upper()}")
        print(f"  Inputs: {f['inputs']}")