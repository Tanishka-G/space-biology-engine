
import { NextRequest, NextResponse } from 'next/server';
import { pipeline } from '@xenova/transformers';

export async function POST(req: NextRequest) {
  try {
    const { keywords } = await req.json();

    if (!keywords || !Array.isArray(keywords)) {
      return NextResponse.json({ error: 'Keywords are required' }, { status: 400 });
    }

    const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    
    const embeddings = await Promise.all(keywords.map(async (keyword) => {
        const result = await extractor(keyword, { pooling: 'mean', normalize: true });
        return { keyword, embedding: Array.from(result.data) };
    }));

    return NextResponse.json({ embeddings });

  } catch (error) {
    console.error('Embedding Error:', error);
    return NextResponse.json({ error: 'Failed to generate embeddings' }, { status: 500 });
  }
}
