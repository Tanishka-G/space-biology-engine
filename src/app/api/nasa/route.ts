import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const term = searchParams.get('term') || 'bio';

  try {
    const response = await fetch(`https://osdr.nasa.gov/osdr/data/search?term=${term}&size=5`);
    if (!response.ok) {
        throw new Error(`Failed to fetch from NASA API: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in NASA API route:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: `Internal Server Error: ${errorMessage}` }, { status: 500 });
  }
}
