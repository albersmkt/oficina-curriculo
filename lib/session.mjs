import {createHmac, timingSafeEqual, randomBytes} from 'node:crypto';
export const SESSION_SECONDS = 30 * 24 * 60 * 60;
export const COOKIE_NAME = 'oficina_session';
function equal(a,b) { const left=Buffer.from(a),right=Buffer.from(b); return left.length===right.length && timingSafeEqual(left,right); }
export function passwordMatches(value, secret) { return !!secret && typeof value==='string' && equal(value,secret); }
function sign(payload,secret) { return createHmac('sha256',secret).update(`oficina-session-v1:${payload}`).digest('base64url'); }
export function createSession(secret, now=Date.now()) { const payload=`${Math.floor(now/1000)+SESSION_SECONDS}.${randomBytes(24).toString('base64url')}`; return `${payload}.${sign(payload,secret)}`; }
export function validSession(token,secret,now=Date.now()) {
 if (!secret || typeof token!=='string' || token.length>256) return false;
 const parts=token.split('.'); if(parts.length!==3 || !/^\d+$/.test(parts[0])) return false;
 const expires=Number(parts[0]);
 return expires>Math.floor(now/1000) && expires<=Math.floor(now/1000)+SESSION_SECONDS && equal(parts[2],sign(`${parts[0]}.${parts[1]}`,secret));
}
export function authenticated(req) { const cookie=req.headers.get('cookie') || ''; const token=cookie.split(';').map(x=>x.trim()).find(x=>x.startsWith(`${COOKIE_NAME}=`))?.slice(COOKIE_NAME.length+1); return validSession(token,process.env.KIOSK_ACCESS_CODE); }
export function sameOrigin(req) { return req.headers.get('origin')===new URL(req.url).origin; }
export function sessionCookie(token, secure=process.env.NODE_ENV==='production') { return `${COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${token ? SESSION_SECONDS : 0}${secure ? '; Secure' : ''}`; }
