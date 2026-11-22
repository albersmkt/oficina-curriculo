import test from 'node:test';
import assert from 'node:assert/strict';
import {validate,instructions} from '../lib/policy.mjs';
test('rejects empty, unknown and oversized requests',()=>{for(const value of [null,{}, {field:'objective',style:'Simples e direto',text:''},{field:'objective',style:'Simples e direto',text:'a'.repeat(3001)}]) assert.throws(()=>validate(value));});
test('only selected field context is retained',()=>assert.deepEqual(validate({field:'skills',style:'Primeiro emprego',text:' organização ',name:'Private',email:'private@example.com'}),{field:'skills',style:'Primeiro emprego',text:'organização'}));
test('policy asks for facts and clarification',()=>{const prompt=instructions('objective','Primeiro emprego');assert.match(prompt,/Não invente/);assert.match(prompt,/350/);assert.match(prompt,/pergunta/);});
