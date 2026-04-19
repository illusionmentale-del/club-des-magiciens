-- Table to store authorized devices per user
CREATE TABLE IF NOT EXISTS public.user_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    device_id TEXT NOT NULL,
    device_name TEXT,
    last_active_at TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, device_id)
);

-- Enable RLS
ALTER TABLE public.user_devices ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own devices" 
    ON public.user_devices FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own devices" 
    ON public.user_devices FOR DELETE 
    USING (auth.uid() = user_id);

-- System/Service Role can do everything (Bypass RLS used in server actions)
CREATE POLICY "Service Role full access" 
    ON public.user_devices FOR ALL 
    USING (true);
