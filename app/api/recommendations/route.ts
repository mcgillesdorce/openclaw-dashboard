/**
 * Recommendations API
 * Fetches and manages agent recommendations
 */

import { execSync } from 'child_process';
import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';

const QUEUE_DIR = path.join(process.env.HOME || '/home/openclaw', '.psychvid', 'recommendations');

export async function GET() {
  try {
    // Ensure directory exists
    if (!fs.existsSync(QUEUE_DIR)) {
      fs.mkdirSync(QUEUE_DIR, { recursive: true });
    }

    // Read all recommendation files
    const files = fs.readdirSync(QUEUE_DIR).filter(f => f.endsWith('.json'));
    const recommendations = files.map(file => {
      const content = fs.readFileSync(path.join(QUEUE_DIR, file), 'utf-8');
      return JSON.parse(content);
    });

    // Sort by timestamp (newest first)
    recommendations.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(recommendations);
  } catch (error) {
    console.error('Recommendations fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch recommendations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, role, title, description, reasoning, confidence, impact, tags, data } = body;

    // Call Python to submit recommendation
    const pythonScript = `
import sys
import json
sys.path.insert(0, '${process.env.HOME}/.psychvid')
from recommendations_queue import RecommendationQueue

rec = RecommendationQueue.submit(
    agent='${agent}',
    role='${role}',
    title='${title.replace(/'/g, "\\'")}',
    description='${description.replace(/'/g, "\\'")}',
    reasoning='${reasoning.replace(/'/g, "\\'")}',
    confidence=${confidence},
    impact='${impact.replace(/'/g, "\\'")}',
    tags=${JSON.stringify(tags)},
    data=${JSON.stringify(data)}
)
print(json.dumps(rec.to_dict()))
`;

    const result = execSync(`python3 -c "${pythonScript.replace(/"/g, '\\"')}"`, {
      encoding: 'utf-8'
    });

    const rec = JSON.parse(result);
    return NextResponse.json(rec, { status: 201 });
  } catch (error) {
    console.error('Recommendation submit error:', error);
    return NextResponse.json({ error: 'Failed to submit recommendation' }, { status: 500 });
  }
}
