import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';
import { EventSchema } from '@chased/shared';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();
    const parsed = EventSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid event' }, { status: 400 });
    await supabase.from('events').insert({ user_id: user?.id ?? null, event_name: parsed.data.event_name, payload: parsed.data.payload, user_agent: req.headers.get('user-agent'), ip: req.headers.get('x-forwarded-for')?.split(',')[0] ?? null });
    return NextResponse.json({ success: true });
  } catch { return NextResponse.json({ success: false }); }
}
