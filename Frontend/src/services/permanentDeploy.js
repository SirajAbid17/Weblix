
class PermanentDeploy {
    static async deployToPuter(htmlCode, websiteName) {
        try {
          
            if (typeof window.puter === 'undefined') {
                await this.loadPuterScript();
            }
            
            
            const cleanName = websiteName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
            const folderName = `${cleanName}-${Date.now()}`;
            
            
            await window.puter.fs.mkdir(folderName);
            
           
            await window.puter.fs.write(`${folderName}/index.html`, htmlCode);
            
           
            const site = await window.puter.hosting.create(folderName, folderName);
            
            return {
                success: true,
                url: `https://${site.subdomain}.puter.site`,
                message: "Website deployed permanently!",
                details: "This URL will work forever, even after you close your computer."
            };
        } catch (error) {
            console.error("Puter deploy error:", error);
            return {
                success: false,
                error: error.message || "Failed to deploy to Puter"
            };
        }
    }
    
    static async loadPuterScript() {
        return new Promise((resolve, reject) => {
            if (window.puter) {
                resolve();
                return;
            }
            
            const script = document.createElement('script');
            script.src = 'https://js.puter.com/v2/';
            script.onload = () => {
                
                setTimeout(resolve, 2000);
            };
            script.onerror = () => reject(new Error("Failed to load Puter script"));
            document.head.appendChild(script);
        });
    }
    
    static downloadAsHTML(htmlCode, websiteName) {
        try {
            const blob = new Blob([htmlCode], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${websiteName || 'website'}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return {
                success: true,
                message: " Website downloaded! You can open it anytime offline."
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default PermanentDeploy;