import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { SignJWT } from 'jose'
const secret = new TextEncoder().encode(process.env.JWT_SECRET ?? 'dev-secret-change-in-production-now')
export async function POST(req:Request){
 const {email,password,name,workspace}=await req.json()
 if(!email || !password || password.length<8 || !workspace) return Response.json({error:'Enter a valid email, workspace, and password with at least 8 characters.'},{status:400})
 await db.execute(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT, workspace TEXT, password_hash TEXT NOT NULL, created_at TEXT DEFAULT (datetime('now')))`)
 const found=await db.execute({sql:'SELECT id FROM users WHERE email=?',args:[email]})
 if(found.rows.length) return Response.json({error:'An account with this email already exists.'},{status:409})
 const hash=await bcrypt.hash(password,12)
 await db.execute({sql:'INSERT INTO users (email,name,workspace,password_hash) VALUES (?,?,?,?)',args:[email,name??'',workspace,hash]})
 const token=await new SignJWT({email,name:name??'',workspace}).setProtectedHeader({alg:'HS256'}).setExpirationTime('7d').sign(secret)
 return new Response(JSON.stringify({ok:true}),{status:201,headers:{'Content-Type':'application/json','Set-Cookie':`session=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800; Secure`}})
}
