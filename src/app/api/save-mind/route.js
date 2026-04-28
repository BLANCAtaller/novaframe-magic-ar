import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(request) {
  const data = await request.arrayBuffer();
  const buffer = Buffer.from(data);
  const targetPath = path.join(process.cwd(), 'public', 'alice.mind');
  fs.writeFileSync(targetPath, buffer);
  return NextResponse.json({ success: true, path: targetPath });
}
