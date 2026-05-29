import nodemailer from 'nodemailer';

export const sendIncidentEmail = async (incident) => {
  try {
    // Only send for CRITICAL incidents
    if (incident.severity !== 'CRITICAL' && incident.severity !== 'HIGH') {
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',

      auth: {
        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,

      to: process.env.EMAIL_USER,

      subject: `🚨 CRITICAL INCIDENT ALERT`,

      html: `
          <h2>Critical Incident Detected</h2>

          <p>
            <strong>Title:</strong>
            ${incident.title}
          </p>

          <p>
            <strong>Description:</strong>
            ${incident.description}
          </p>

          <p>
            <strong>Severity:</strong>
            ${incident.severity}
          </p>

          <p>
            <strong>Type:</strong>
            ${incident.type}
          </p>

          <p>
            <strong>Status:</strong>
            ${incident.status}
          </p>

          <p>
            <strong>Assigned To:</strong>
            ${incident.assignedTo?.name || 'N/A'}
          </p>

          <p>
            <strong>Team:</strong>
            ${incident.assignedTo?.team || 'N/A'}
          </p>
        `,
    };

    await transporter.sendMail(mailOptions);

    console.log('📧 Critical Incident Email Sent');
  } catch (error) {
    console.log('Email Error:', error.message);
  }
};
