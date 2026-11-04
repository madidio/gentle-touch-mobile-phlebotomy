import {createHmac,timingSafeEqual} from 'node:crypto';
export function patientToken(id,expiry,secret=process.env.PATIENT_LINK_SECRET){
 if(!secret||secret.length<32)throw new Error('Patient links are not configured');
 return `${expiry}.${createHmac('sha256',secret).update(`patient-manage:v1:${id}:${expiry}`).digest('base64url')}`;
}
export function verifyPatientToken(id,token,{secret=process.env.PATIENT_LINK_SECRET,now=Date.now()}={}){
 if(typeof id!=='string'||!/^[0-9a-f-]{36}$/i.test(id)||typeof token!=='string'||token.length>150)return false;
 const [expiry,signature,...extra]=token.split('.');
 if(extra.length||!/^\d{10,13}$/.test(expiry)||!signature||Number(expiry)<now)return false;
 try{const expected=patientToken(id,expiry,secret);return Buffer.byteLength(token)===Buffer.byteLength(expected)&&timingSafeEqual(Buffer.from(token),Buffer.from(expected));}catch{return false;}
}
export function patientManageURL(id,day){
 if(!process.env.PATIENT_LINK_SECRET)return null;
 const expiry=String(Date.parse(`${day}T23:59:59Z`)+30*86400000);
 return `https://omahagentletouchlabs.com/manage-appointment#${new URLSearchParams({id,token:patientToken(id,expiry)})}`;
}
