import Incident from '../models/Incident.js';
import { getIO } from '../sockets/socket.js';
import { classifyIncident } from '../services/classification.service.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { sendIncidentEmail } from '../services/notification.service.js';

export const createIncident = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Auto Classification
    const { type, severity, assignedTeam } = classifyIncident(title, description);

    // Find Team Member
    // Get all responders from assigned team
    const responders = await User.find({
      team: assignedTeam,
      role: 'RESPONDER',
    });

    let assignedUser = null;

    if (responders.length > 0) {
      // Count active incidents for each responder
      const responderLoads = await Promise.all(
        responders.map(async (responder) => {
          const activeIncidentCount = await Incident.countDocuments({
            assignedTo: responder._id,

            status: {
              $in: ['ACTIVE', 'ACKNOWLEDGED', 'ESCALATED'],
            },
          });

          return {
            responder,
            activeIncidentCount,
          };
        })
      );

      // Sort by least active incidents
      responderLoads.sort((a, b) => a.activeIncidentCount - b.activeIncidentCount);

      // Pick least loaded responder
      assignedUser = responderLoads[0].responder;
    }

    const incident = await Incident.create({
      title,
      description,
      type,
      severity,
      assignedTo: assignedUser?._id,
      createdBy: req.user._id,
    });

    const populatedIncident = await Incident.findById(incident._id)
      .populate('assignedTo', 'name email team')
      .populate('createdBy', 'name email');

    await sendIncidentEmail(populatedIncident);

    // Realtime Event
    getIO().emit('incident-created', populatedIncident);

    res.status(201).json(populatedIncident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getIncidents = async (req, res) => {
  try {
    let query = {};

    // If user is responder,
    // show only assigned incidents
    if (req.user.role === 'RESPONDER') {
      query.assignedTo = req.user._id;
    }

    const incidents = await Incident.find(query)
      .populate('assignedTo', 'name email team')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json(incidents);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateIncidentStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const incident = await Incident.findById(req.params.id);

    if (!incident) {
      return res.status(404).json({
        message: 'Incident not found',
      });
    }

    // ADMIN can update everything
    if (req.user.role !== 'ADMIN') {
      // RESPONDER can update
      // only assigned incidents
      if (incident.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          message: 'Access denied',
        });
      }
    }

    incident.status = status;

    await incident.save();

    const updatedIncident = await Incident.findById(incident._id)
      .populate('assignedTo', 'name email team')
      .populate('createdBy', 'name email');

    getIO().emit('incident-updated', updatedIncident);

    res.status(200).json(updatedIncident);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
