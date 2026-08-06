export type DeviceInfo = {
  deviceName: string;
  os: string;
  browser: string;
};

export type FormattedSession = {
  id: string;
  deviceName: string;
  os: string;
  browser: string;
  location: string;
  ip: string;
  loginTime: string;
  lastActive: string;
  isCurrent: boolean;
  isTrusted: boolean;
};

export type SecurityAlertItem = {
  id: string;
  type: string;
  text: string;
  date: string;
  severity: "low" | "medium" | "high";
};

export type AuditLogItem = {
  id: string;
  type: "Success" | "Failed" | "Update";
  method: string;
  desc: string;
  date: string;
};
