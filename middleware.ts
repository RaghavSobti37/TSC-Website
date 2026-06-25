import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/** When BLANK10_ROOT=1 (harshad-duhita-tsc Vercel project), serve /blank-10 at /. */
export function middleware(req: NextRequest) {
  if (process.env.BLANK10_ROOT === '1' && req.nextUrl.pathname === '/') {
    return NextResponse.rewrite(new URL('/blank-10', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/',
};
