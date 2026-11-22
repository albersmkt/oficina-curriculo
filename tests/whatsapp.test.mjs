import test from 'node:test';
import assert from 'node:assert/strict';
import {whatsappUrl} from '../lib/whatsapp.mjs';
test('Brazilian phone links normalize DDD, punctuation and country code',()=>{
 for(const input of ['(11) 91234-5678','11912345678','+55 (11) 91234-5678']) assert.equal(whatsappUrl(input),'https://wa.me/5511912345678');
 assert.equal(whatsappUrl('55912345678'),'https://wa.me/5555912345678');
 assert.equal(whatsappUrl('(11) 3456-7890'),'https://wa.me/551134567890');
});
test('invalid or missing phones cannot create links',()=>{
 for(const input of ['',null,'912345678','00000000000','abc11912345678','+1 212 555 1234']) assert.equal(whatsappUrl(input),null);
});
