import Website from "../models/website.js";
import User from "../models/user.js";

export const Deploy = async (req, res) => {
    try {
        const { id } = req.params;
        
        console.log("Deploy request received for ID:", id);
        console.log("User ID:", req.user?._id);
        
        
        const website = await Website.findOne({
            _id: id,
            user: req.user._id
        });
        
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found or unauthorized"
            });
        }
        
       
        if (website.deploy) {
            return res.status(200).json({
                success: true,
                url: website.deployedUrl,
                message: "Website is already deployed!",
                alreadyDeployed: true,
                deployedUrl: website.deployedUrl
            });
        }
        
       
        if (!website.slug) {
            const baseSlug = website.title.toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            website.slug = `${baseSlug}-${website._id.toString().slice(-6)}`;
        }
        
       
        const baseUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const deployedUrl = `${baseUrl}/site/${website.slug}`;
        
        // Update website
        website.deploy = true;
        website.deployedUrl = deployedUrl;
        website.deployedAt = new Date();
        website.deployedVia = 'internal';
        
        await website.save();
        
        console.log("✅ Website deployed successfully!");
        console.log("URL:", deployedUrl);
        
        return res.status(200).json({
            success: true,
            url: deployedUrl,
            slug: website.slug,
            message: "Website deployed successfully! You can now view it live.",
            deployedAt: website.deployedAt,
            deployedUrl: deployedUrl
        });
        
    } catch (error) {
        console.error("❌ Deploy error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to deploy website",
            error: error.message
        });
    }
};


export const GetDeployedWebsite = async (req, res) => {
    try {
        const { slug } = req.params;
        
        console.log("🌐 Fetching deployed website for slug:", slug);
        
        const website = await Website.findOne({
            slug: slug,
            deploy: true
        });
        
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found or not deployed"
            });
        }
        
        return res.status(200).json({
            success: true,
            website: {
                _id: website._id,
                title: website.title,
                lcode: website.lcode,
                slug: website.slug,
                deployedAt: website.deployedAt,
                websiteType: website.websiteType
            }
        });
        
    } catch (error) {
        console.error("Error fetching deployed website:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch website",
            error: error.message
        });
    }
};


export const Undeploy = async (req, res) => {
    try {
        const { id } = req.params;
        
        const website = await Website.findOne({
            _id: id,
            user: req.user._id
        });
        
        if (!website) {
            return res.status(404).json({
                success: false,
                message: "Website not found"
            });
        }
        
        website.deploy = false;
        website.deployedUrl = null;
        await website.save();
        
        return res.status(200).json({
            success: true,
            message: "Website undeployed successfully"
        });
        
    } catch (error) {
        console.error("Undeploy error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to undeploy website"
        });
    }
};


export const GetAllDeployed = async (req, res) => {
    try {
        const websites = await Website.find({ deploy: true })
            .sort({ deployedAt: -1 })
            .select('title slug deployedAt websiteType');
        
        return res.status(200).json({
            success: true,
            websites: websites
        });
        
    } catch (error) {
        console.error("Error fetching deployed websites:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch deployed websites"
        });
    }
};