export function bookingAlert(booking,today){
 if(booking.change_request?.status==='pending'&&booking.status==='paid')return {key:`${booking.id}:change:${booking.change_request.id}`,title:'Patient requested a change',action:'Review change request'};
 if(booking.visit_completed_at)return null;
 if(booking.day<today)return null;
 if(booking.invoice_requested && !booking.channel && ['quoted','pending'].includes(booking.status))return {key:`${booking.id}:request`,title:'New invoice request',action:'Review and email invoice'};
 if(booking.status==='paid')return {key:`${booking.id}:paid`,title:'Appointment confirmed — paid',action:'Review appointment'};
 if(booking.status==='cancelled')return {key:`${booking.id}:cancelled`,title:'Appointment cancelled',action:'Review cancellation'};
 if(booking.status==='expired')return {key:`${booking.id}:expired`,title:'Hold or checkout expired',action:'Review released window'};
 return null;
}
