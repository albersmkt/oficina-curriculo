import {authenticated, sameOrigin} from '../../../lib/session.mjs';
import {validate, instructions} from '../../../lib/policy.mjs';
export const runtime = 'nodejs';
const json = (body, status=200) => Response.json(body, {status, headers:{'Cache-Control':'no-store'}});
export async function POST(req) {
 const secret = process.env.KIOSK_ACCESS_CODE;
 if (!secret || !process.env.OPENAI_API_KEY) return json({error:'A IA ainda não foi configurada. Você pode continuar preenchendo manualmente.'},503);
 if (!sameOrigin(req)) return json({error:'Origem inválida.'},403);
 if (!authenticated(req)) return json({error:'Entre em Meu acesso à IA para continuar. Seu texto foi preservado.'},401);
 let input;
 try { const raw = await req.text(); if (raw.length > 16000) return json({error:'Texto muito longo.'},413); input = validate(JSON.parse(raw)); }
 catch { return json({error:'Informe um texto de até 3.000 caracteres e um estilo válido.'},400); }
 try {
 const response = await fetch('https://api.openai.com/v1/chat/completions', {method:'POST', signal:AbortSignal.timeout(25000), headers:{'Authorization':`Bearer ${process.env.OPENAI_API_KEY}`,'Content-Type':'application/json'}, body:JSON.stringify({model:process.env.OPENAI_MODEL || 'gpt-4.1-mini',store:false,max_completion_tokens:700,messages:[{role:'system',content:instructions(input.field,input.style)},{role:'user',content:input.text}],response_format:{type:'json_schema',json_schema:{name:'resume_revision',strict:true,schema:{type:'object',properties:{suggestion:{type:'string'},question:{type:'string'}},required:['suggestion','question'],additionalProperties:false}}}})});
 if (!response.ok) return json({error:'O serviço de IA está indisponível. Tente novamente mais tarde ou continue manualmente.'},502);
 const data = await response.json(); const result = JSON.parse(data.choices?.[0]?.message?.content || '{}');
 if (typeof result.suggestion !== 'string' || typeof result.question !== 'string' || result.suggestion.length > (input.field === 'objective' ? 350 : 1200) || result.question.length > 1000) throw new Error('Invalid response');
 return json(result);
 } catch { return json({error:'Não foi possível obter a sugestão. Seu texto foi preservado; tente novamente.'},502); }
}
