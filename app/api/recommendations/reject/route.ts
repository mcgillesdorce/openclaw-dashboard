/**
 * Reject Recommendation
 */

import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, reason } = await request.json();

    const pythonScript = `
import sys
sys.path.insert(0, '${process.env.HOME}/.psychvid')
from recommendations_queue import RecommendationQueue

success = RecommendationQueue.reject('${id}', 'gilly_web', '${reason || 'No reason provided'}')
print('true' if success else 'false')
`;

    const result = execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8'
    }).trim();

    if (result === 'true') {
      return NextResponse.json({ success: true, message: 'Rejected' });
    } else {
      return NextResponse.json({ error: 'Rejection failed' }, { status: 400 });
    }
  } catch (error) {
    console.error('Rejection error:', error);
    return NextResponse.json({ error: 'Failed to reject' }, { status: 500 });
  }
}
