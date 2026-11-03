export const BOOKING_DAYS = 90;
export const WEEKDAY_WINDOWS = ['Morning (6am-9am)','Midday (9am-12pm)','Afternoon (12pm-3pm)','Evening (3pm-6pm)'];
export const SATURDAY_WINDOWS = ['Morning (8am-11am)','Midday (11am-2pm)','Afternoon (2pm-3pm)'];
export const WINDOW_MINUTES = {
 'Morning (6am-9am)':[360,540], 'Midday (9am-12pm)':[540,720],
 'Afternoon (12pm-3pm)':[720,900], 'Evening (3pm-6pm)':[900,1080],
 'Morning (8am-11am)':[480,660], 'Midday (11am-2pm)':[660,840], 'Afternoon (2pm-3pm)':[840,900],
 // Keep historical appointments valid; these labels are no longer automatically offered.
 'Afternoon (1pm-4pm)':[780,960], 'Evening (4pm-6pm)':[960,1080],
};
export const ALL_WINDOWS = Object.keys(WINDOW_MINUTES);
export function validDay(day) {
 return typeof day==='string' && /^\d{4}-\d{2}-\d{2}$/.test(day) && !Number.isNaN(Date.parse(day+'T12:00:00Z')) && new Date(day+'T12:00:00Z').toISOString().slice(0,10)===day;
}
export function addDays(day,count) {
 const date=new Date(day+'T12:00:00Z');date.setUTCDate(date.getUTCDate()+count);return date.toISOString().slice(0,10);
}
export function windowsForDay(day) {
 if(!validDay(day)) return [];
 const weekday=new Date(day+'T12:00:00Z').getUTCDay();
 return weekday===0?[]:weekday===6?SATURDAY_WINDOWS:WEEKDAY_WINDOWS;
}
export function recurringSlots(today) {
 const slots=[];
 for(let offset=1;offset<=BOOKING_DAYS;offset++) {
  const day=addDays(today,offset);
  for(const window of windowsForDay(day)) slots.push({day,window,start:WINDOW_MINUTES[window][0],end:WINDOW_MINUTES[window][1]});
 }
 return slots;
}
export const overlaps = (a,b)=>a[0]<b[1] && b[0]<a[1];
