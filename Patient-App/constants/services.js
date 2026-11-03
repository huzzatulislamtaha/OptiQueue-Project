export const SERVICES = [
  {
    id: "general",
    prefix: "A",
    title: "General Consultation",
    subtitle: "General doctor consultation",
    icon: "medkit-outline",
    avgMinutes: 4,
    counter: "Counter 01",
  },
  {
    id: "specialist",
    prefix: "B",
    title: "Specialist Consultation",
    subtitle: "Consult with a specialist",
    icon: "person-outline",
    avgMinutes: 5,
    counter: "Counter 02",
  },
  {
    id: "diagnostic",
    prefix: "C",
    title: "Diagnostic / Laboratory",
    subtitle: "Blood test, imaging & reports",
    icon: "flask-outline",
    avgMinutes: 3,
    counter: "Lab Desk",
  },
  {
    id: "pharmacy",
    prefix: "D",
    title: "Pharmacy Service",
    subtitle: "Medicine collection",
    icon: "medical-outline",
    avgMinutes: 2,
    counter: "Pharmacy",
  },
];

export function formatToken(prefix, number) {
  return `${prefix}-${String(number).padStart(3, "0")}`;
}

export function formatWait(minutes) {
  if (minutes <= 0) return "Now";
  if (minutes === 1) return "1 min";
  return `${minutes} min`;
}