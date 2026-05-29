import express from 'express';

import {
  createIncident,
  getIncidents,
  updateIncidentStatus,
} from '../controllers/incident.controller.js';

import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', protect, createIncident);

router.get('/', protect, getIncidents);

router.patch('/:id', protect, updateIncidentStatus);

export default router;
