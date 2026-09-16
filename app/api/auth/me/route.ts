import { jwtVerify } from 'jose'
const secret=new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-production-now')
export async function GET(req:Request){const cookie=req.headers.get('cookie')??''; const token=cookie.split(';').find(c=>c.trim().startsWith('session='))?.split('=')[1]; if(!token)return Response.json({user:null});try{const {payload}=await jwtVerify(token,secret);return Response.json({user:payload})}catch{return Response.json({user:null})}}
