import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const prisma = new PrismaClient()
async function main() {
  const existing = await prisma.user.findFirst({ where:{role:'ADMIN'} })
  if (existing) { console.log('Admin already exists. Skipping.'); return }
  await prisma.user.create({
    data: { name:'System Admin', username:'admin', email:'admin@patrika.com', passwordHash:await bcrypt.hash('Admin@123',12), role:'ADMIN', status:'ACTIVE', mustChangePassword:true }
  })
  await prisma.setting.createMany({
    data:[
      {key:'youtube_api_key',value:''},
      {key:'monthly_target',value:'50'},
      {key:'app_name',value:'YT Studio Pro'},
      {key:'organization_name',value:'Patrika Group'},
    ], skipDuplicates:true
  })
  console.log('✅ Admin created: username=admin | Password: Admin@123 | CHANGE ON FIRST LOGIN')
}
main().catch(e=>{console.error(e);process.exit(1)}).finally(()=>prisma.$disconnect())
