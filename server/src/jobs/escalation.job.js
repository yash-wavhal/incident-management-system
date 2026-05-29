import Incident from '../models/Incident.js';
import { getIO } from '../sockets/socket.js';

export const startEscalationJob = () => {
  setInterval(async () => {
    try {
      // Find Critical Active Incidents
      const incidents = await Incident.find({
        severity: 'CRITICAL',
        status: 'ACTIVE',
      });

      const now = new Date();

      for (const incident of incidents) {
        const createdAt = new Date(incident.createdAt);

        const diffInMinutes = (now - createdAt) / (1000 * 60);

        // Escalate after 2 mins
        if (diffInMinutes >= 2) {
          incident.status = 'ESCALATED';

          await incident.save();

          const updatedIncident = await Incident.findById(incident._id)
            .populate('assignedTo', 'name email team')
            .populate('createdBy', 'name email');

          // Emit realtime update
          getIO().emit('incident-escalated', updatedIncident);

          console.log(`Incident Escalated: ${incident.title}`);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  }, 10000); // runs every 10 sec
};
