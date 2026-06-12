export const formatTimestamp = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return 'N/A';
  }
};

export const formatVoltage = (volts) => {
  if (volts === undefined || volts === null) return '0.00 V';
  return `${Number(volts).toFixed(2)} V`;
};

export const formatBattery = (level) => {
  if (level === undefined || level === null) return '0%';
  return `${Math.round(level)}%`;
};
