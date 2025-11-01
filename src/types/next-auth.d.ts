/**
 * TypeScript type definitions for NextAuth
 * Extends NextAuth types to include custom user properties
 */

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Extended User interface with custom properties
   */
  interface User {
    id: string
    email: string
    name: string
    role: string
  }

  /**
   * Extended Session interface with custom user properties
   */
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface with custom properties
   */
  interface JWT {
    id: string
    role: string
  }
}
