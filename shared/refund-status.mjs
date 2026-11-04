export function cancellationStatusMessage(result){
 const amount=`$${((result.refund||0)/100).toFixed(2)}`;
 if(['pending','refund_pending'].includes(result.status))return `Appointment cancelled. Refund of ${amount} is pending with the payment provider.`;
 if(['failed','canceled','refund_failed'].includes(result.status))return 'Appointment cancelled, but the refund failed. Review it in Stripe and contact the patient.';
 if(['succeeded','refunded'].includes(result.status))return result.refund>0?`Appointment cancelled. Refund of ${amount} processed; bank/payment-provider processing times apply.`:'This refund was already processed. No additional refund was requested.';
 return 'Appointment cancelled. No new refund was issued.';
}
