import express from "express";
import { Auth } from "../middleware/Auth.js";
import { 
    Deploy, 
    GetDeployedWebsite, 
    Undeploy,
    GetAllDeployed 
} from "../controllers/DeployController.js";

const DeployRoute = express.Router();


DeployRoute.post('/deploy/:id', Auth, Deploy);
DeployRoute.post('/undeploy/:id', Auth, Undeploy);


DeployRoute.get('/website/:slug', GetDeployedWebsite);
DeployRoute.get('/all', GetAllDeployed);

export default DeployRoute;