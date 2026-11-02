import React,{useEffect,useState} from 'react';
import {paymentApi} from '@/lib/payments';
export default function PaymentResult(){
 const [message,setMessage]=useState('Checking your payment confirmation…');
 useEffect(()=>{let active=true;let timer;
 const check=async()=>{try{const saved=JSON.parse(sessionStorage.getItem('gentle-touch-payment')||'null');if(!saved){setMessage('Please contact us to confirm your appointment. Returning from Stripe alone does not confirm payment.');return;}
 const r=await paymentApi('status',saved);if(!active)return;
 setMessage(r.status==='paid'?'Payment verified. Your appointment window is confirmed.':['cancelled','expired','refunded','refund_pending','refund_failed'].includes(r.status)?`Appointment status: ${r.status.replaceAll('_',' ')}. Contact us with questions.`:'Payment confirmation is pending. Please do not pay again.');
 if(r.status==='pending')timer=setTimeout(check,3000);
 }catch(e){if(active)setMessage(e.message);}};check();return()=>{active=false;clearTimeout(timer);};},[]);
 return <main className="mx-auto max-w-3xl px-6 py-20"><h1 className="text-3xl font-bold text-primary">Appointment payment</h1><p role="status" className="my-6">{message}</p><a className="underline" href="/">Return home</a></main>;
}
