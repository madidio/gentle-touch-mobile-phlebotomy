import pg from 'pg';
import Stripe from 'stripe';
import { createHash, timingSafeEqual } from 'node:crypto';
import { price } from './pricing.mjs';
let pool;
export const db = () => pool ||= new pg.Pool({connectionString:process.env.DATABASE_URL, max:3, ssl:process.env.PG_SSL === 'disable' ? false : {rejectUnauthorized:true}});
export function stripeMode(key=process.env.STRIPE_SECRET_KEY) {
 const value=key?.trim()||'';
 if (/^(sk|rk)_live_/.test(value)) return 'live';
 if (/^(sk|rk)_test_/.test(value)) return 'test';
 return null;
}
export function stripe() {
 const key=process.env.STRIPE_SECRET_KEY?.trim();
 const mode=stripeMode(key);
 const invalid=message=>{throw Object.assign(new Error(message),{status:503});};
 if(!key) invalid('STRIPE_SECRET_KEY is missing in this deployment.');
 if(key.startsWith('pk_')) invalid('STRIPE_SECRET_KEY contains a publishable key. Use a server secret or restricted key.');
 if(key.startsWith('whsec_')) invalid('STRIPE_SECRET_KEY contains a webhook signing secret. Save that under STRIPE_WEBHOOK_SECRET instead.');
 if(!mode) invalid('STRIPE_SECRET_KEY has an unsupported format. Paste only the secret or restricted API key value, without quotes or a variable-name prefix.');
 if(mode==='live' && process.env.PAYMENTS_LIVE_ENABLED!=='true') invalid('Live Stripe processing is disabled in this deployment.');
 if(process.env.VERCEL_ENV==='production' && mode!=='live') invalid('Production requires a live Stripe secret or restricted key; a test key is configured.');
 return new Stripe(key, {apiVersion:'2024-06-20', timeout:15000, maxNetworkRetries:2});
}
export const hash = s => createHash('sha256').update(s).digest('hex');
export function admin(req) {
 const expected=process.env.PAYMENTS_ADMIN_TOKEN;
 const actual=(req.headers.authorization||'').replace(/^Bearer /,'');
 if (!expected || expected.length<32 || !actual || !timingSafeEqual(Buffer.from(hash(actual)),Buffer.from(hash(expected)))) throw Object.assign(new Error('Administrator authentication required'),{status:401});
}
export async function transaction(fn) {
 const c=await db().connect();
 try {await c.query('BEGIN'); const result=await fn(c); await c.query('COMMIT'); return result;}
 catch(e){await c.query('ROLLBACK');throw e;} finally {c.release();}
}
export async function routePrice(address) {
 const normalize=value=>String(value).toLowerCase().replace(/[^a-z0-9]/g,'');
 if(normalize(address)===normalize('623 N 132nd St Omaha NE 68154'))return price(0);
 const r=await fetch('https://routes.googleapis.com/directions/v2:computeRoutes',{method:'POST',signal:AbortSignal.timeout(15000),headers:{'Content-Type':'application/json','X-Goog-Api-Key':process.env.GOOGLE_ROUTES_API_KEY?.trim(),'X-Goog-FieldMask':'routes.distanceMeters'},body:JSON.stringify({origin:{address:'623 N 132nd St, Omaha, NE 68154'},destination:{address},travelMode:'DRIVE',routingPreference:'TRAFFIC_UNAWARE',computeAlternativeRoutes:false,units:'IMPERIAL'})});
 const data=await r.json();
 if(!r.ok || !data.routes?.length) {
  const reason = data.error?.details?.find(x => typeof x.reason === 'string')?.reason;
  const messages = {
   API_KEY_INVALID: 'The Google Routes key is invalid. Check GOOGLE_ROUTES_API_KEY for this deployment.',
   SERVICE_DISABLED: 'Google Routes API is not enabled in the Google Cloud project.',
   BILLING_DISABLED: 'Google Cloud billing must be enabled for Routes API.',
   API_KEY_SERVICE_BLOCKED: 'The Google key restrictions must allow Routes API.',
   API_KEY_HTTP_REFERRER_BLOCKED: 'The Google key has website restrictions; this integration requires a server key.',
   API_KEY_IP_ADDRESS_BLOCKED: 'Google rejected the server IP restriction on this key.',
  };
  throw Object.assign(new Error(messages[reason] || `Could not calculate driving distance${data.error?.status ? ' ('+data.error.status+')' : ''}. Check the full address or call us.`),{status:422});
 }
 return price(data.routes[0].distanceMeters);
}
export const fail = (message,status=409) => {throw Object.assign(new Error(message),{status});};
