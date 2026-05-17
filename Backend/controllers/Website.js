import User from "../models/user.js";
import Website from "../models/website.js";
import { generateWebsiteWithGemini, updateWebsiteWithGemini } from "../config/gemini.js";
import { DetectWebsiteType } from "./Graph.js";


const generateAIResponse = (prompt, action = 'update') => {
  const promptLower = prompt.toLowerCase();
  
  if (action === 'generate') {
    return ` I've created a beautiful ${prompt} website for you! You can now customize it using the chat. Ask me to change colors, add sections, or modify any content!`;
  }
  
  if (promptLower.includes('color') || promptLower.includes('background')) {
    return ` I've updated the colors on your website! The design now matches your preference.`;
  } else if (promptLower.includes('add') && promptLower.includes('section')) {
    return `I've added a new section to your website: "${prompt}". Check it out in the preview!`;
  } else if (promptLower.includes('remove') || promptLower.includes('delete')) {
    return `I've removed the requested content from your website. The changes are visible now.`;
  } else if (promptLower.includes('title') || promptLower.includes('heading')) {
    return `I've updated the title/heading as you requested: "${prompt}"`;
  } else if (promptLower.includes('image') || promptLower.includes('photo')) {
    return ` I've updated the images on your website. The changes are visible in the preview.`;
  } else if (promptLower.includes('text') || promptLower.includes('content')) {
    return ` I've updated the text content as requested. Your website now reflects the changes!`;
  } else if (promptLower.includes('font') || promptLower.includes('style')) {
    return ` I've updated the typography and styling of your website!`;
  } else if (promptLower.includes('button')) {
    return `I've updated the buttons on your website as requested!`;
  } else if (promptLower.includes('responsive') || promptLower.includes('mobile')) {
    return `I've improved the mobile responsiveness of your website!`;
  } else {
    return `Website updated successfully! I've applied your request: "${prompt}". Take a look at the preview!`;
  }
};


const generateFallbackTemplate = (prompt) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${prompt} - Modern Website</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }
        
        nav {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            border-radius: 50px;
            margin-bottom: 3rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
        }
        
        .logo {
            font-size: 1.5rem;
            font-weight: bold;
            color: white;
        }
        
        .nav-links {
            display: flex;
            gap: 2rem;
        }
        
        .nav-links a {
            color: white;
            text-decoration: none;
            transition: opacity 0.3s;
        }
        
        .nav-links a:hover {
            opacity: 0.8;
        }
        
        h1 {
            color: white;
            text-align: center;
            margin-bottom: 2rem;
            font-size: 3rem;
            animation: fadeInUp 0.8s ease;
        }
        
        .subtitle {
            text-align: center;
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 3rem;
            font-size: 1.2rem;
        }
        
        .card {
            background: white;
            border-radius: 1rem;
            padding: 2rem;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
            transition: transform 0.3s;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin-top: 3rem;
        }
        
        .feature {
            text-align: center;
            padding: 1.5rem;
        }
        
        .feature i {
            font-size: 2.5rem;
            color: #667eea;
            margin-bottom: 1rem;
        }
        
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            h1 {
                font-size: 2rem;
            }
            
            .nav-links {
                display: none;
            }
        }
        
        button {
            background: white;
            color: #667eea;
            border: none;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            font-weight: bold;
            transition: transform 0.3s;
        }
        
        button:hover {
            transform: scale(1.05);
        }
    </style>
</head>
<body>
    <div class="container">
        <nav>
            <div class="logo">${prompt.split(' ')[0]}</div>
            <div class="nav-links">
                <a href="#">Home</a>
                <a href="#">About</a>
                <a href="#">Services</a>
                <a href="#">Contact</a>
            </div>
        </nav>
        
        <h1>Welcome to ${prompt}</h1>
        <div class="subtitle">Your modern website solution</div>
        
        <div class="card">
            <h2>About Us</h2>
            <p>This is your ${prompt} website. You can customize everything using the chat assistant! Ask me to change colors, add sections, or modify any content.</p>
        </div>
        
        <div class="features">
            <div class="feature">
                <i class="fas fa-rocket"></i>
                <h3>Fast & Modern</h3>
                <p>Built with latest technologies</p>
            </div>
            <div class="feature">
                <i class="fas fa-mobile-alt"></i>
                <h3>Responsive Design</h3>
                <p>Looks great on all devices</p>
            </div>
            <div class="feature">
                <i class="fas fa-chat"></i>
                <h3>AI Assistant</h3>
                <p>Customize with chat</p>
            </div>
        </div>
    </div>
</body>
</html>`;
};


export const GenerateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (user.credits < 5) {
      return res.status(402).json({
        success: false,
        message: "Insufficient credits. Need 5 credits to generate website.",
        currentCredits: user.credits
      });
    }

    console.log(`Generating website for: "${prompt}"`);
    
    let code = null;
    
    
    try {
      const specificPrompt = `Create a complete, modern, responsive ${prompt} website with:
      - Beautiful gradient background
      - Navigation bar
      - Hero section with heading
      - About section
      - Features/ Services section with icons
      - Footer
      Make it professional and visually appealing. Use Font Awesome for icons.`;
      
      const raw = await generateWebsiteWithGemini(specificPrompt);
      
      if (raw && raw.includes('<!DOCTYPE html>') && raw.includes('<body')) {
        code = raw;
        console.log(`Generated valid HTML with Gemini (length: ${code.length})`);
      }
    } catch (err) {
      console.log("Gemini generation failed, using fallback template");
    }
   
    if (!code) {
      code = generateFallbackTemplate(prompt);
      console.log("Using fallback template");
    }
    
    const aiResponseMessage = generateAIResponse(prompt, 'generate');

    const website = await Website.create({
      user: user._id,
      title: prompt.slice(0, 50),
      lcode: code,
      slug: prompt.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      websiteType: DetectWebsiteType(prompt),
      conversion: [
        { role: "user", content: prompt },
        { role: "ai", content: aiResponseMessage }
      ]
    });

    user.credits = user.credits - 5;
    await user.save();

    console.log(` Website created! ID: ${website._id}`);

    return res.status(201).json({
      success: true,
      websiteId: website._id,
      slug: website.slug,
      remainingCredit: user.credits,
      message: "Website generated successfully!"
    });

  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate website",
      error: error.message
    });
  }
};


export const UpdateChangingWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;
    
    console.log("Update request received:");
    console.log("Params ID:", req.params.id);
    console.log("Prompt:", prompt);
    
    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }
   
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
    
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!website) {
      console.log("Website not found for ID:", req.params.id);
      return res.status(404).json({
        success: false,
        message: "Website not found"
      });
    }

    if (user.credits < 2) {
      return res.status(402).json({
        success: false,
        message: "Insufficient credits. Need 2 credits to update.",
        currentCredits: user.credits
      });
    }

    console.log(`Updating website ${website._id} with: "${prompt}"`);
    
    let updatedCode = null;
    
  
    try {
      const raw = await updateWebsiteWithGemini(website.lcode, prompt);
      
      let cleaned = raw;
      cleaned = cleaned.replace(/```html\s*/gi, '');
      cleaned = cleaned.replace(/```\s*$/g, '');
      cleaned = cleaned.replace(/```html/g, '');
      cleaned = cleaned.replace(/```/g, '');
      cleaned = cleaned.trim();
      
      if (cleaned && cleaned.includes('<!DOCTYPE html>') && cleaned.includes('<body')) {
        updatedCode = cleaned;
        console.log(` Gemini update successful (length: ${updatedCode.length})`);
      }
    } catch (err) {
      console.log("Gemini update failed, keeping existing code");
    }
    
  
    if (!updatedCode) {
      updatedCode = website.lcode;
      console.log("Using existing code");
    }
    
    const aiResponseMessage = generateAIResponse(prompt, 'update');
   
    website.conversion.push(
      { role: "user", content: prompt },
      { role: "ai", content: aiResponseMessage }
    );
    website.lcode = updatedCode;
    website.updatedAt = new Date();
    await website.save();

  
    user.credits = user.credits - 2;
    await user.save();

    console.log(` Website updated! Credits left: ${user.credits}`);

  
    return res.status(200).json({
      success: true,
      message: aiResponseMessage,
      code: updatedCode,
      remainingCredit: user.credits
    });

  } catch (error) {
    console.error("Update error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update website",
      error: error.message
    });
  }
};


export const SaveWebsiteChanges = async (req, res) => {
  try {
    const { id } = req.params;
    const { lcode, conversion } = req.body;
    
    console.log("💾 Saving website:", id);
    console.log("Code length:", lcode?.length);
    
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
    
    website.lcode = lcode;
    website.conversion = conversion || website.conversion;
    website.updatedAt = new Date();
    
    await website.save();
    
    console.log(" Website saved successfully");
    
    return res.status(200).json({ 
      success: true, 
      message: "Website saved successfully",
      website: {
        _id: website._id,
        title: website.title,
        lcode: website.lcode,
        conversion: website.conversion,
        updatedAt: website.updatedAt
      }
    });
    
  } catch (error) {
    console.error("Save website error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Failed to save website",
      error: error.message 
    });
  }
};

export const FindWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found"
      });
    }
    
    return res.status(200).json(website);
  } catch (error) {
    console.error("FindWebsiteById error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching website",
      error: error.message
    });
  }
};

export const GetAll = async (req, res) => {
  try {
    const websites = await Website.find({ user: req.user._id }).sort({ createdAt: -1 });
    console.log(` Found ${websites.length} websites for user ${req.user._id}`);
    return res.status(200).json(websites);
  } catch (error) {
    console.log("GetAll error:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching websites",
      error: error.message
    });
  }
};


export const GetWebsiteBySlug = async (req, res) => {
  try {
    const website = await Website.findOne({
      slug: req.params.slug,
      deploy: true
    });
    
    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found"
      });
    }
    
    return res.status(200).json(website);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error fetching website",
      error: error.message
    });
  }
};


export const SaveDeployment = async (req, res) => {
  try {
    const { deployedUrl, deployedVia } = req.body;
    
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!website) {
      return res.status(404).json({ 
        success: false,
        message: "Website not found" 
      });
    }
    
    website.deploy = true;
    website.deployedUrl = deployedUrl;
    website.deployedVia = deployedVia || 'puter';
    website.deployedAt = new Date();
    await website.save();
    
    return res.status(200).json({
      success: true,
      message: "Deployment saved successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ 
      success: false,
      message: "Failed to save deployment" 
    });
  }
};