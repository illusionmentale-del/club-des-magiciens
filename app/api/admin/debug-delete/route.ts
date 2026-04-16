import { NextResponse } from 'next/server';
import { deleteUserEntity } from '@/app/admin/actions';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    if (!userId) return NextResponse.json({ error: 'Missing userId' });

    try {
        await deleteUserEntity(userId);
        return NextResponse.json({ result: 'SUCCESS' });
    } catch (e: any) {
        return NextResponse.json({ result: 'ERROR', message: e.message, stack: e.stack });
    }
}
