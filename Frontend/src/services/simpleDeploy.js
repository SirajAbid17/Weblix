class SimpleDeploy {
    static downloadAsHTML(htmlCode, websiteName) {
        try {
           
            let cleanHtml = htmlCode;
            
           
            if (!cleanHtml.includes('<base')) {
                cleanHtml = cleanHtml.replace('<head>', '<head><base target="_blank">');
            }
            
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
                message: "✅ Website downloaded! Open with any browser.",
                isDownload: true
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static createDataURL(htmlCode) {
        try {
            const dataUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlCode)}`;
            return {
                success: true,
                url: dataUrl,
                message: " Data URL created! (Save this URL)",
                isDataUrl: true
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default SimpleDeploy;