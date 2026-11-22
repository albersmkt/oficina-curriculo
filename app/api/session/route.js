import {authenticated, passwordMatches, createSession, sessionCookie, sameOrigin} from '../../../lib/session.mjs';
export const runtime='nodejs';
const json=(body,status=200,cookie)=>Response.json(body,{status,headers:{'Cache-Control':'no-store',...(cookie?{'Set-Cookie':cookie}:{})}});
export async function GET(req) { return json({authenticated:authenticated(req)}); }
export async function POST(req) {
 if(!sameOrigin(req)) return json({error:'Origem inválida.'},403);
 if(!process.env.KIOSK_ACCESS_CODE) return json({error:'Configure KIOSK_ACCESS_CODE na Vercel para entrar.'},503);
 try {
 const body=await req.text(); if(body.length>4096) return json({error:'Solicitação inválida.'},400);
 const {password}=JSON.parse(body);
 if(!passwordMatches(password,process.env.KIOSK_ACCESS_CODE)) return json({error:'Senha incorreta.'},401);
 return json({authenticated:true},200,sessionCookie(createSession(process.env.KIOSK_ACCESS_CODE)));
 } catch {return json({error:'Solicitação inválida.'},400);}
}
export async function DELETE(req) {
 if(!sameOrigin(req)) return json({error:'Origem inválida.'},403);
 return json({authenticated:false},200,sessionCookie(''));
}
