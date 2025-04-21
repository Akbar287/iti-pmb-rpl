import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const error = searchParams.get('error');
    const redirectUrl = `/login?msg=${error}`;

    return NextResponse.redirect(redirectUrl);
}
