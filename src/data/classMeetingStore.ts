export type MeetingStatus = "published" | "draft" | "locked";
export type ClassMeeting = { id: string; number: number; title: string; className: string; startsAt: string; endsAt: string; status: MeetingStatus };
const now = Date.now();
let meetings: ClassMeeting[] = ["Pretest & Prangkat","Sudut","Garis-Garis Sejajar","Kesebangunan pada Segitiga","Kesebangunan pada Segitiga (2)","Kesebangunan pada Segi Empat","Kesebangunan pada Segi Empat (2)","Posttest & Postangket"].map((title, index) => ({ id: `meeting-${index + 1}`, number: index + 1, title, className: "VII-A", startsAt: new Date(now + (index < 2 ? (index - 1) * 86400000 : (index + 1) * 7 * 86400000)).toISOString(), endsAt: new Date(now + (index < 2 ? (index - 1) * 86400000 : (index + 1) * 7 * 86400000 + 5400000)).toISOString(), status: index < 2 ? "published" : "draft" }));
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((listener) => listener());
export const classMeetingStore = { list: () => meetings, save(item: ClassMeeting) { meetings = meetings.some((meeting) => meeting.id === item.id) ? meetings.map((meeting) => meeting.id === item.id ? item : meeting) : [...meetings, item]; notify(); }, subscribe(listener: () => void) { listeners.add(listener); return () => listeners.delete(listener); } };
