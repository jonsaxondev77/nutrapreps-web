import { NextResponse } from 'next/server';

export async function GET() {
  const connectionString = process.env.APPLICATIONINSIGHTS_CONNECTION_STRING;
  return NextResponse.json({ connectionString });
}