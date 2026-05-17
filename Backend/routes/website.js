import express from "express";
import { Auth } from "../middleware/Auth.js";
import { 
  FindWebsiteById,
  GenerateWebsite,
  GetAll,
  GetWebsiteBySlug,
  SaveDeployment,
  SaveWebsiteChanges,
  UpdateChangingWebsite,
} from "../controllers/Website.js";
import { 
  GetDashboardStats, 
  GetWebsiteAnalytics, 
  TrackWebsiteVisit,
  UpdateWebsiteType 
} from "../controllers/Graph.js";

const WebsiteRoute = express.Router();

WebsiteRoute.get('/public/:slug', GetWebsiteBySlug);
WebsiteRoute.get('/track/:slug', TrackWebsiteVisit);

WebsiteRoute.get('/dashboard/stats', Auth, GetDashboardStats);
WebsiteRoute.get('/dashboard/analytics/:id', Auth, GetWebsiteAnalytics);
WebsiteRoute.post('/generate', Auth, GenerateWebsite);
WebsiteRoute.get('/all', Auth, GetAll);
WebsiteRoute.get('/getwebsite/:id', Auth, FindWebsiteById);
WebsiteRoute.get('/:id', Auth, FindWebsiteById);


WebsiteRoute.post('/update/:id', Auth, UpdateChangingWebsite);  

WebsiteRoute.put('/save/:id', Auth, SaveWebsiteChanges);
WebsiteRoute.post('/deploy/:id', Auth, SaveDeployment);
WebsiteRoute.put('/type/:id', Auth, UpdateWebsiteType);

export default WebsiteRoute;