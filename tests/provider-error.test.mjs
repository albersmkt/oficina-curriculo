import test from 'node:test';
import assert from 'node:assert/strict';
import {providerError} from '../lib/provider-error.mjs';
const response=(status,code)=>Response.json({error:{code,message:'sensitive-secret-user-text'}},{status});
test('distinguishes quota from temporary rate limits',async()=>{
 assert.match(await providerError(response(429,'insufficient_quota')),/créditos/);
 assert.match(await providerError(response(429,'rate_limit_exceeded')),/Aguarde/);
});
test('actionable messages for authentication, permissions, model and invalid requests',async()=>{
 for(const [status,pattern] of [[401,/OPENAI_API_KEY/],[403,/permissões/],[404,/OPENAI_MODEL/],[400,/configuração/],[500,/temporariamente/]]) {
 const message=await providerError(response(status));assert.match(message,pattern);assert.ok(!message.includes('sensitive-secret-user-text'));
 }
});
test('handles non-json provider failures without exposing body',async()=>{
 assert.match(await providerError(new Response('private html',{status:502})),/temporariamente/);
});
