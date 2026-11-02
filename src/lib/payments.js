export const paymentsEnabled = import.meta.env.VITE_PAYMENTS_ENABLED === 'true';
export async function paymentApi(action, body={}, adminToken) {
 const r=await fetch(`/api/payments?action=${action}`,{method:'POST',headers:{'Content-Type':'application/json',...(adminToken?{Authorization:`Bearer ${adminToken}`}:{})},body:JSON.stringify(body)});
 const data=await r.json();if(!r.ok)throw new Error(data.error||'Payment service unavailable');return data;
}
