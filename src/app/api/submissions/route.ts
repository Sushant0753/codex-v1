import { NextResponse } from 'next/server';
import { prisma } from '../../../../prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const problemId = searchParams.get('problemId');

  if (!problemId) {
    return NextResponse.json({ error: 'Missing problemId' }, { status: 400 });
  }

  try {
    const submissions = await prisma.submission.findMany({
      where: {
        problemId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Failed to fetch submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}
