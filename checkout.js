(() => {
 const dialog=document.getElementById('checkout');
 const config=window.HUSTLEYANGU_PAYMENTS||{};
 const contact=window.HUSTLEYANGU_CONTACT||{};
 const info=document.getElementById('method-info');
 const form=document.getElementById('evidence-form');
 let method='mpesa';
 const labels={mpesa:'M-Pesa',bank:'Bank transfer',crypto:'Crypto'};
 function line(text){const p=document.createElement('p');p.textContent=text;info.append(p);}
 function select(value){
  method=value;form.elements.method.value=value;info.replaceChildren();
  document.querySelectorAll('[data-method]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.method===value)));
  const c=config[value];
  if(!contact.email)line('Payment confirmation by email is not available yet. Please arrange confirmation with HustleYangu before paying.');
  if(value==='mpesa'&&c&&c.paybill&&c.accountNumber){
   line('On your phone, open M-Pesa → Lipa na M-Pesa → Pay Bill.');
   line('Business number (Paybill): '+c.paybill);
   line('Account number: '+c.accountNumber);
   if(c.amountKES)line('Amount: KES '+c.amountKES);
   else line('Service price: US$80. The KES amount is awaiting confirmation. Please confirm the KES amount with HustleYangu before sending payment.');
   line('Enter your M-Pesa PIN on your phone, check the recipient details, then keep the transaction message for confirmation.');
  }else if(value==='bank'&&c&&c.bankName&&c.accountNumber){
   line('Bank: '+c.bankName);if(c.branch)line('Branch: '+c.branch);
   line('Account number: '+c.accountNumber);
   if(c.accountName)line('Account holder: '+c.accountName);
   if(c.routing)line('Routing / SWIFT: '+c.routing);
   if(c.currency&&c.amount)line('Amount: '+c.currency+' '+c.amount);
   else line('Service price: US$80. Confirm the transfer currency and amount with HustleYangu before paying.');
   if(!c.accountName)line('Account holder name is awaiting confirmation. Confirm it with HustleYangu before making a transfer.');
   line('Keep your bank transaction reference for payment confirmation.');
  }else if(value==='crypto'&&c&&c.token&&c.network&&c.address&&c.amount){
   line('Token: '+c.token);line('Network: '+c.network);line('Receiving address: '+c.address);line('Amount: '+c.amount+' '+c.token);line('Use only the network shown above. Keep your transaction hash for verification.');
  }else{line(labels[value]+' payments are not available yet. Receiving details have not been added.');}
 }
 document.getElementById('open-checkout').addEventListener('click',()=>{select(method);dialog.showModal();});
 document.querySelector('.checkout-close').addEventListener('click',()=>dialog.close());
 document.querySelectorAll('[data-method]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.method)));
 document.getElementById('confirm-payment').addEventListener('click',()=>{document.getElementById('payment-choice').hidden=true;document.getElementById('payment-evidence').hidden=false;form.elements.name.focus();});
 document.querySelector('.checkout-back').addEventListener('click',()=>{document.getElementById('payment-choice').hidden=false;document.getElementById('payment-evidence').hidden=true;document.querySelector('[data-method][aria-pressed="true"]').focus();});
 form.addEventListener('submit',event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const data=Object.fromEntries(new FormData(form));
  const text='HustleYangu short-video payment evidence\nService price: US$80\nVerification status: NOT VERIFIED\n\n'+Object.entries(data).map(([k,v])=>k+': '+v).join('\n');
  const status=document.getElementById('evidence-status');
  if(typeof contact.email==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)){
   window.location.href='mailto:'+encodeURIComponent(contact.email)+'?subject='+encodeURIComponent('Short-video payment evidence — '+data.company)+'&body='+encodeURIComponent(text);
   status.textContent='Your email draft is ready. Send it from your email app to submit your evidence. Payment has not been verified.';
  }else{
   const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='HustleYangu-payment-evidence.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
   status.textContent='Evidence saved to your device only—not submitted. The receiving email is not configured yet. Payment has not been verified.';
  }
  document.getElementById('production-next').hidden=false;
  document.getElementById('location-next').textContent=data.location==='Nairobi'?'For Nairobi: once payment is verified, we’ll contact you to arrange a filming location and date.':'Outside Nairobi: once payment is verified, we’ll request your company information, photos, product demonstrations and footage for the explainer. Share only materials you have permission to use.';
 });
})();
