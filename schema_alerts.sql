-- Table to store broadcast messages (global alerts)
CREATE TABLE public.global_alerts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    link_url TEXT,
    target_audience TEXT DEFAULT 'kids', -- Can be 'kids', 'adults', or 'all'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.global_alerts ENABLE ROW LEVEL SECURITY;

-- Everyone can view alerts
CREATE POLICY "Alerts are viewable by everyone." ON public.global_alerts
    FOR SELECT USING (true);

-- Only admins can create/update alerts (Admin check is typically done application-side or via complex RLS, for simplicity here we rely on the backend API checks for insertion)
CREATE POLICY "Admins can manage alerts" ON public.global_alerts
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Table to track which user has dismissed/read which alert
CREATE TABLE public.user_alerts_read (
    alert_id UUID REFERENCES public.global_alerts(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    read_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (alert_id, user_id)
);

-- Enable RLS
ALTER TABLE public.user_alerts_read ENABLE ROW LEVEL SECURITY;

-- Users can only see/insert their own read receipts
CREATE POLICY "Users can manage their own read receipts" ON public.user_alerts_read
    FOR ALL USING (auth.uid() = user_id);
