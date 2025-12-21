import { NextRequest, NextResponse } from 'next/server';

// NGROK URL from environment variable
const NGROK_URL = process.env.NGROK_URL;

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const query = request.nextUrl.search; // include original query string

  try {
    const response = await fetch(`${NGROK_URL}/${path}${query}`, {
      method: 'GET',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'Next.js-Proxy',
      },
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const path = params.path.join('/');
  const query = request.nextUrl.search; // include query string if any
  const body = await request.json();

  try {
    const response = await fetch(`${NGROK_URL}/${path}${query}`, {
      method: 'POST',
      headers: {
        'ngrok-skip-browser-warning': 'true',
        'User-Agent': 'Next.js-Proxy',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
