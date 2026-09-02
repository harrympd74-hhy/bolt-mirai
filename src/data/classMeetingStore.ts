export type MeetingStatus = "published" | "draft" | "locked";
export type ClassMeeting = { id: string; number: number; title: string; className: string; startsAt: string; endsAt: string; accentColor: "teal" | "blue" | "yellow" | "cream" | "gray"; status: MeetingStatus };
const dates = ["2027-03-22", "2027-03-24", "2027-03-29", "2027-03-31", "2027-04-05", "2027-04-07", "2027-04-12", "2027-04-14"];
const titles = ["Pretest & Prangkat", "Sudut", "Garis-Garis Sejajar", "Kesebangunan pada Segitiga", "Kesebangunan pada Segitiga (2)", "Kesebangunan pada Segi Empat", "Kesebangunan pada Segi Empat (2)", "Posttest & Postangket"];
const localDate = (date: string, time: string) => new Date(`${date}T${time}:00`).toISOString();
let meetings: ClassMeeting[] = dates.map((date, index) => ({ id: `meeting-${index + 1}`, number: index + 1, title: titles[index], className: "VII-A", startsAt: localDate(date, "07:30"), endsAt: localDate(date, "09:00"), accentColor: index === 0 ? "teal" : index === 1 ? "blue" : index % 3 === 0 ? "yellow" : "cream", status: index < 2 ? "published" : "draft" }));
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
export const classMeetingStore = { list: () => meetings, save(item: ClassMeeting) { meetings = meetings.some((meeting) => meeting.id === item.id) ? meetings.map((meeting) => meeting.id === item.id ? item : meeting) : [...meetings, item]; notify(); }, subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); } };
