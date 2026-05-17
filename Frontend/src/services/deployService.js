import JSZip from 'jszip';

class DeployService {
   
    static async deployToPuter(htmlCode, websiteName) {
        try {
            
            if (typeof window.puter === 'undefined') {
                await this.loadPuterScript();
            }
            
        
            const folderName = websiteName.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now();
            
           
            await window.puter.fs.mkdir(folderName);
            
           
            await window.puter.fs.write(`${folderName}/index.html`, htmlCode);
            
          
            const site = await window.puter.hosting.create(folderName, folderName);
            
            return {
                success: true,
                url: `https://${site.subdomain}.puter.site`,
                message: "✅ Website deployed successfully on Puter!",
                details: "Website will stay live forever, even if your server is off."
            };
        } catch (error) {
            console.error("Puter deploy error:", error);
           
            return await this.deployToNetlify(htmlCode, websiteName);
        }
    }
    
    
    static async deployToNetlify(htmlCode, websiteName) {
        try {
            const zip = new JSZip();
            zip.file("index.html", htmlCode);
            
            const zipBlob = await zip.generateAsync({ type: "blob" });
            const formData = new FormData();
            formData.append("site", zipBlob, `${websiteName}.zip`);
            
            const response = await fetch("https://app.netlify.com/drop", {
                method: "POST",
                body: formData
            });
            
            const text = await response.text();
            const urlMatch = text.match(/https:\/\/[a-zA-Z0-9-]+\.netlify\.app/);
            
            if (urlMatch) {
                return {
                    success: true,
                    url: urlMatch[0],
                    message: "Deployed on Netlify Drop!",
                    details: "Website is live permanently."
                };
            }
            
            throw new Error("Could not extract URL");
        } catch (error) {
            return {
                success: false,
                error: error.message,
                fallback: true
            };
        }
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
                message: "Website downloaded! You can open it anytime offline.",
                isDownload: true
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static loadPuterScript() {
        return new Promise((resolve, reject) => {
            if (typeof window.puter !== 'undefined') {
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
}

export default DeployService;