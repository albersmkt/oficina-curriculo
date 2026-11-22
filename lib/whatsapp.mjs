// Accept Brazilian numbers with DDD, optionally prefixed by +55.
export function whatsappUrl(value) {
 if (typeof value !== 'string' || /[^\d\s()+.-]/.test(value)) return null;
 let digits=value.replace(/\D/g,'');
 if ((digits.length===12 || digits.length===13) && digits.startsWith('55')) digits=digits.slice(2);
 if (!/^[1-9]\d(?:[2-5]\d{7}|9\d{8})$/.test(digits)) return null;
 return `https://wa.me/55${digits}`;
}
