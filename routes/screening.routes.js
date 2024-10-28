import express from 'express';
const router = express.Router();

import {addScreening,upcomingScreening,pastScreening,isScreened,movieDetails} from "../controllers/screening.controller.js"


router.post('/add', addScreening);

router.get('/upcoming', upcomingScreening);

router.get('/past', pastScreening);

router.post('/isScreened', isScreened);

router.post('/details',movieDetails);

export default router
