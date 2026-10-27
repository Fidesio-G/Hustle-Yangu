/* Supply the owner's verified email and optional checkout URL to enable enquiries. */
(() => {
  const contact = window.HUSTLEYANGU_CONTACT || {};
  const subjects = {sponsor:'HustleYangu sponsorship enquiry',story:'My story for HustleYangu',video:'Short video enquiry — US$80 service fee'};
  const bodies = {
    sponsor:'Name:\nBrand / company:\nWebsite:\nSponsorship goals:\nPreferred timing:\n',
    story:'Name:\nCompany / project:\nWebsite / social links:\nMy story:\nContact details:\n',
    video:'Name:\nCompany / project:\nWebsite / social links:\nMy story:\nFilming location:\nPreferred timing:\n\nI would like to discuss a short video with a US$80 production service fee.\n'
  };
  document.querySelectorAll('[data-enquiry]').forEach(link => {
    const kind=link.dataset.enquiry;
    const payment=kind==='video' && typeof contact.paymentUrl==='string' && contact.paymentUrl.startsWith('https://');
    if(payment){link.href=contact.paymentUrl;link.textContent='Book a short video · US$80 ↗';link.target='_blank';link.rel='noopener noreferrer';}
    else if(typeof contact.email==='string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)){
      link.href='mailto:'+encodeURIComponent(contact.email)+'?subject='+encodeURIComponent(subjects[kind])+'&body='+encodeURIComponent(bodies[kind]);
    } else return;
    link.removeAttribute('aria-disabled');
  });
})();
