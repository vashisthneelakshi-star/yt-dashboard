import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { loginSchema } from './validations'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null
        const user = await prisma.user.findUnique({ where: { username: parsed.data.username } })
        if (!user || user.status !== 'ACTIVE') return null
        const valid = await bcrypt.compare(parsed.data.password, user.passwordHash)
        if (!valid) return null
        await prisma.activityLog.create({ data: { userId: user.id, event: 'LOGIN', device: 'Web' } }).catch(()=>{})
        return { id: user.id, name: user.name, username: user.username, email: user.email??'', role: user.role, status: user.status, mustChangePassword: user.mustChangePassword }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.username = (user as any).username; token.role = (user as any).role; token.status = (user as any).status; token.mustChangePassword = (user as any).mustChangePassword }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id as string; session.user.username = token.username as string; session.user.role = token.role as string; session.user.status = token.status as string; session.user.mustChangePassword = token.mustChangePassword as boolean
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },
  session: { strategy: 'jwt', maxAge: 8*60*60 },
})
