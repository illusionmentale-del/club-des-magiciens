-- Run this in your Supabase SQL Editor to add the newsletter flag
ALTER TABLE public.vip_requests 
ADD COLUMN IF NOT EXISTS wants_newsletter boolean DEFAULT false;
