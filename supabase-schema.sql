-- ============================================================
-- Supabase Database Schema for Abhinav Upadhyay / Assurance Digital
-- Run this in your Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================

-- 1. Create inquiries table for project leads and messages
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    service_type TEXT DEFAULT 'General Inquiry',
    message TEXT NOT NULL,
    status TEXT DEFAULT 'new'
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- 3. Allow anonymous public inserts from website visitors
CREATE POLICY "Allow public inquiries insert"
    ON public.inquiries
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- 4. Allow only service role / authenticated admins to view messages
CREATE POLICY "Allow authenticated read inquiries"
    ON public.inquiries
    FOR SELECT
    TO authenticated
    USING (true);
