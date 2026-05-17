import Website from "../models/website.js";


const getColorForType = (type) => {
  const colors = {
    'Portfolio': '#3B82F6',
    'E-commerce': '#10B981',
    'Blog': '#F59E0B',
    'Business': '#8B5CF6',
    'Landing Page': '#EC4899',
    'Other': '#6B7280'
  };
  return colors[type] || '#6B7280';
};


export const DetectWebsiteType = (prompt) => {
  const promptLower = prompt.toLowerCase();
  if (promptLower.includes('portfolio') || promptLower.includes('photographer') || promptLower.includes('artist')) {
    return 'Portfolio';
  } else if (promptLower.includes('ecommerce') || promptLower.includes('shop') || promptLower.includes('store') || promptLower.includes('product')) {
    return 'E-commerce';
  } else if (promptLower.includes('blog') || promptLower.includes('news') || promptLower.includes('article')) {
    return 'Blog';
  } else if (promptLower.includes('business') || promptLower.includes('company') || promptLower.includes('corporate')) {
    return 'Business';
  } else if (promptLower.includes('landing') || promptLower.includes('sales') || promptLower.includes('marketing')) {
    return 'Landing Page';
  }
  return 'Other';
};


export const GetDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    
    const websites = await Website.find({ user: userId });
    const totalWebsites = websites.length;
    const activeDeployments = websites.filter(w => w.deploy === true).length;
    const totalVisits = websites.reduce((sum, website) => sum + (website.analytics?.visits || 0), 0);

    const websitesWithLoadTime = websites.filter(w => w.analytics?.loadTime > 0);
    const averageLoadTime = websitesWithLoadTime.length > 0 
      ? (websitesWithLoadTime.reduce((sum, w) => sum + (w.analytics?.loadTime || 0), 0) / websitesWithLoadTime.length).toFixed(1)
      : 1.2;
    
    const websitesWithScore = websites.filter(w => w.analytics?.performanceScore > 0);
    const performanceScore = websitesWithScore.length > 0
      ? Math.round(websitesWithScore.reduce((sum, w) => sum + (w.analytics?.performanceScore || 0), 0) / websitesWithScore.length)
      : 94;
 
    const typeDistribution = {
      'Portfolio': 0,
      'E-commerce': 0,
      'Blog': 0,
      'Business': 0,
      'Landing Page': 0,
      'Other': 0
    };
    
    websites.forEach(website => {
      const type = website.websiteType || 'Other';
      if (typeDistribution[type] !== undefined) {
        typeDistribution[type]++;
      } else {
        typeDistribution['Other']++;
      }
    });
    
    const totalWithType = websites.length || 1;
    const pieChartData = Object.entries(typeDistribution)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({
        name,
        value: Math.round((value / totalWithType) * 100),
        color: getColorForType(name)
      }));
    
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentWebsites = await Website.find({
      user: userId,
      createdAt: { $gte: sevenDaysAgo }
    }).sort({ createdAt: -1 }).select('title createdAt deploy');
    
    const recentActivity = recentWebsites.map(website => ({
      id: website._id,
      title: website.title || 'Untitled',
      type: website.deploy ? 'deployed' : 'created',
      date: website.createdAt,
      status: website.deploy ? 'Live' : 'Draft'
    }));
    
    return res.status(200).json({
      success: true,
      stats: {
        totalWebsites,
        activeDeployments,
        totalVisits,
        averageLoadTime: parseFloat(averageLoadTime),
        performanceScore
      },
      charts: {
        websiteDistribution: pieChartData
      },
      recentActivity
    });
    
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message
    });
  }
};

export const TrackWebsiteVisit = async (req, res) => {
  try {
    const { slug } = req.params;
    
    const website = await Website.findOne({ slug, deploy: true });
    
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
 
    if (!website.analytics) {
      website.analytics = {};
    }
    
    website.analytics.visits = (website.analytics.visits || 0) + 1;
    website.analytics.lastVisitedAt = new Date();
    
   
    website.analytics.loadTime = parseFloat((Math.random() * 2 + 0.5).toFixed(1));
    website.analytics.performanceScore = Math.floor(Math.random() * 30) + 70;
    
    await website.save();
    
    return res.status(200).json({
      success: true,
      message: "Visit tracked successfully"
    });
    
  } catch (error) {
    console.error("Track visit error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to track visit"
    });
  }
};


export const GetWebsiteAnalytics = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id
    });
    
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    
    return res.status(200).json({
      success: true,
      analytics: {
        visits: website.analytics?.visits || 0,
        lastVisitedAt: website.analytics?.lastVisitedAt,
        loadTime: website.analytics?.loadTime || 0,
        performanceScore: website.analytics?.performanceScore || 0,
        createdAt: website.createdAt,
        lastModified: website.updatedAt,
        isDeployed: website.deploy,
        deployedUrl: website.deployedUrl
      }
    });
    
  } catch (error) {
    console.error("Get website analytics error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch website analytics"
    });
  }
};

export const UpdateWebsiteType = async (req, res) => {
  try {
    const { id } = req.params;
    const { websiteType } = req.body;
    
    const validTypes = ['Portfolio', 'E-commerce', 'Blog', 'Business', 'Landing Page', 'Other'];
    if (!validTypes.includes(websiteType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid website type"
      });
    }
    
    const website = await Website.findOne({
      _id: id,
      user: req.user._id
    });
    
    if (!website) {
      return res.status(404).json({ message: "Website not found" });
    }
    
    website.websiteType = websiteType;
    await website.save();
    
    return res.status(200).json({
      success: true,
      message: "Website type updated successfully",
      websiteType: website.websiteType
    });
    
  } catch (error) {
    console.error("Update website type error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update website type"
    });
  }
};