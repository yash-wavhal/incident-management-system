export const classifyIncident = (title, description) => {
  const text = `${title} ${description}`.toLowerCase();

  // Infrastructure Keywords
  const infraKeywords = [
    'server',
    'database',
    'network',
    'cpu',
    'memory',
    'disk',
    'downtime',
    'latency',
    'crash',
  ];

  // Critical Severity Keywords
  const criticalKeywords = ['down', 'failure', 'critical', 'unreachable', 'outage', 'crash'];

  // High Severity Keywords
  const highKeywords = [
    'high cpu',
    'memory leak',
    'slow',
    'timeout',
    'packet loss',
    'high latency',
  ];

  // Low Severity Keywords
  const lowKeywords = ['ui bug', 'typo', 'alignment', 'color issue', 'minor'];

  let type = 'APPLICATION';

  let severity = 'MEDIUM';

  let assignedTeam = 'APPLICATION';

  // Detect Infrastructure Incident
  const isInfra = infraKeywords.some((keyword) => text.includes(keyword));

  if (isInfra) {
    type = 'INFRASTRUCTURE';

    assignedTeam = 'INFRA';
  }

  // Detect Severity Levels

  const isCritical = criticalKeywords.some((keyword) => text.includes(keyword));

  const isHigh = highKeywords.some((keyword) => text.includes(keyword));

  const isLow = lowKeywords.some((keyword) => text.includes(keyword));

  if (isCritical) {
    severity = 'CRITICAL';
  } else if (isHigh) {
    severity = 'HIGH';
  } else if (isLow) {
    severity = 'LOW';
  }

  return {
    type,
    severity,
    assignedTeam,
  };
};
