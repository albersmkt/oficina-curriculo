export function formatPhone(value) {
 let digits=value.replace(/\D/g,'');
 if ((digits.length===12 || digits.length===13) && digits.startsWith('55')) digits=digits.slice(2);
 digits=digits.slice(0,11);
 if (!digits) return '';
 if (digits.length<=2) return `(${digits}`;
 const local=digits.slice(2), split=digits.length>10 ? 5 : 4;
 return `(${digits.slice(0,2)}) ${local.slice(0,split)}${local.length>split ? '-'+local.slice(split) : ''}`;
}
