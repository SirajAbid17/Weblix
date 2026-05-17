
class FreeDeploy {
   
    static async deployToGist(htmlCode, websiteName) {
        try {
            
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    description: `Website: ${websiteName}`,
                    public: true,
                    files: {
                        'index.html': {
                            content: htmlCode
                        }
                    }
                })
            });
            
            if (response.ok) {
                const data = await response.json();
              
                const rawUrl = `https://raw.githack.com/gist/${data.id}/raw/index.html`;
                return {
                    success: true,
                    url: rawUrl,
                    message: "Deployed to GitHub Gist! (Permanent)",
                    gistId: data.id
                };
            }
            throw new Error("GitHub deploy failed");
        } catch (error) {
            console.error("Gist deploy error:", error);
            return this.deployToJSONBin(htmlCode, websiteName);
        }
    }
    

    static async deployToJSONBin(htmlCode, websiteName) {
        try {
            const response = await fetch('https://api.jsonbin.io/v3/b', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    website: htmlCode,
                    name: websiteName,
                    createdAt: new Date().toISOString()
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                const url = `https://htmlpreview.github.io/?https://api.jsonbin.io/v3/b/${data.metadata.id}/latest`;
                return {
                    success: true,
                    url: url,
                    message: " Deployed to JSONBin! (Permanent)",
                    isPermanent: true
                };
            }
            throw new Error("JSONBin deploy failed");
        } catch (error) {
            return this.deployToTempStorage(htmlCode, websiteName);
        }
    }
    
  
    static async deployToTempStorage(htmlCode, websiteName) {
        try {
            const formData = new FormData();
            const blob = new Blob([htmlCode], { type: 'text/html' });
            formData.append('file', blob, 'index.html');
         
            const services = [
                'https://tmp.ninja/api/upload',
                'https://file.io/?expires=1',
                'https://api.anonfiles.com/upload'
            ];
            
            for (const service of services) {
                try {
                    const response = await fetch(service, {
                        method: 'POST',
                        body: formData
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        const url = data.url || data.link || data.data?.url;
                        if (url) {
                            return {
                                success: true,
                                url: url,
                                message: " Deployed to Cloud! (Temporary - 24 hours)",
                                isTemporary: true
                            };
                        }
                    }
                } catch (e) {
                    continue;
                }
            }
            throw new Error("All temp services failed");
        } catch (error) {
            return this.downloadAsHTML(htmlCode, websiteName);
        }
    }
    

    static downloadAsHTML(htmlCode, websiteName) {
        try {
           
            const cleanHtml = this.cleanHTML(htmlCode);
            const blob = new Blob([cleanHtml], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${websiteName.replace(/[^a-z0-9]/gi, '-') || 'website'}.html`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            return {
                success: true,
                message: " Website downloaded! Open anytime offline.",
                isDownload: true
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    
    static cleanHTML(html) {
       
        let clean = html;
       
        if (!clean.includes('<meta charset')) {
            clean = clean.replace('<head>', '<head><meta charset="UTF-8">');
        }
        return clean;
    }
    
  
    static async deploy(htmlCode, websiteName) {
      
        const choice = window.confirm(
            " Choose Deployment Method:\n\n" +
            "OK - Deploy to Cloud (Permanent, Works after server shutdown)\n" +
            "Cancel - Download HTML (Offline Backup)"
        );
        
        if (!choice) {
            return this.downloadAsHTML(htmlCode, websiteName);
        }
        
       
        let result = await this.deployToGist(htmlCode, websiteName);
        
        if (!result.success) {
           
            result = await this.deployToJSONBin(htmlCode, websiteName);
        }
        
        if (!result.success) {
           
            result = await this.deployToTempStorage(htmlCode, websiteName);
        }
        
        return result;
    }
}

export default FreeDeploy;