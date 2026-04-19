import { headers, cookies } from 'next/headers';
import { createClient } from './supabase/server';
import { redirect } from 'next/navigation';

const MAX_DEVICES = 2;

export async function enforceDeviceLimit(userId: string) {
    const cookieStore = await cookies();
    const deviceSessionId = cookieStore.get('device_session_id')?.value;
    
    if (!deviceSessionId) {
        // Should not happen if middleware is working correctly
        return;
    }

    const supabase = await createClient();

    // Use Admin Client to bypass RLS for registering and updating devices
    const { createClient: createAdminClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createAdminClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // 1. Get all known devices for the user (Can use normal client since SELECT is allowed)
    const { data: devices, error } = await supabase
        .from('user_devices')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

    if (error && error.code !== 'PGRST116') {
        console.error("Error fetching user devices", error);
        return; // Fail open to not block users on DB error
    }

    const currentDevices = devices || [];
    const isKnownDevice = currentDevices.some(d => d.device_id === deviceSessionId);

    if (isKnownDevice) {
        // Device is known, just update last_active_at using Admin
        supabaseAdmin.from('user_devices')
            .update({ last_active_at: new Date().toISOString() })
            .eq('user_id', userId)
            .eq('device_id', deviceSessionId)
            .then();
        return;
    }

    // 2. Device is unknown! Check limit.
    if (currentDevices.length >= MAX_DEVICES) {
        // Limit reached. Reject!
        redirect('/device-limit');
    }

    // 3. Under limit! Register this new device.
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || 'Appareil inconnu';
    
    let deviceName = 'Appareil inconnu';
    if (userAgent.includes('Macintosh')) deviceName = 'Mac';
    else if (userAgent.includes('Windows')) deviceName = 'PC Windows';
    else if (userAgent.includes('iPhone')) deviceName = 'iPhone';
    else if (userAgent.includes('iPad')) deviceName = 'iPad';
    else if (userAgent.includes('Android')) deviceName = 'Appareil Android';
    
    await supabaseAdmin.from('user_devices').insert({
        user_id: userId,
        device_id: deviceSessionId,
        device_name: deviceName,
    });
}
