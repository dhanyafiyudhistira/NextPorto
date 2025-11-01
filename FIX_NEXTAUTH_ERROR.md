# NextAuth JWT Session Error Fix

## Problem
The error `token.id is not a function` occurs at line 67 in `src/lib/auth.ts` in the session callback.

## Root Cause
The code is attempting to call `token.id()` as a function, but `token.id` is a property, not a function.

## Solution

### Location: `src/lib/auth.ts` (around line 67)

**INCORRECT CODE:**
```typescript
session: async ({ session, token }) => {
  if (session.user) {
    session.user.id = token.id();  // ❌ WRONG - token.id is not a function
  }
  return session;
}
```

**CORRECT CODE:**
```typescript
session: async ({ session, token }) => {
  if (session.user) {
    session.user.id = token.id;  // ✅ CORRECT - access as property
  }
  return session;
}
```

## Additional Properties to Check

Make sure all token properties are accessed as properties, not function calls:

```typescript
session: async ({ session, token }) => {
  if (session.user) {
    session.user.id = token.id;        // ✅ Property access
    session.user.email = token.email;  // ✅ Property access
    session.user.name = token.name;    // ✅ Property access
    session.user.role = token.role;    // ✅ Property access (if you have roles)
  }
  return session;
},
```

## How to Apply This Fix

1. Open `src/lib/auth.ts`
2. Find line 67 (or search for `token.id()`)
3. Change `token.id()` to `token.id`
4. Save the file
5. Restart your Next.js development server

The error should be resolved after this change.
