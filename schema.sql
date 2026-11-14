-- ========================================================
-- AI CREATIVE INTELLIGENCE STUDIO
-- PostgreSQL & Supabase Database Schema + RLS Security Policies
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (User Accounts & Credits)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'creator', 'business', 'professional')),
  credits_balance INT DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BRAND KITS TABLE (Brand Identity Storage)
CREATE TABLE IF NOT EXISTS public.brand_kits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  tagline TEXT,
  description TEXT,
  industry TEXT,
  colors JSONB DEFAULT '{"primary": "#6366F1", "secondary": "#3B82F6", "accent": "#10B981", "neutralDark": "#0B0F19", "neutralLight": "#F8FAFC"}'::jsonb,
  typography JSONB DEFAULT '{"headingFont": "Plus Jakarta Sans", "bodyFont": "Inter"}'::jsonb,
  logo_url TEXT,
  contact_info JSONB DEFAULT '{}'::jsonb,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS TABLE (Design Document Object Model - DDOM)
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  brand_kit_id UUID REFERENCES public.brand_kits(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('logo', 'letterhead', 'stationery', 'website', 'social', 'brand')),
  subcategory TEXT,
  ddom JSONB NOT NULL,
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT FALSE,
  export_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. EXPORT LOGS TABLE (Download History & Formats)
CREATE TABLE IF NOT EXISTS public.export_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('png', 'svg', 'pdf', 'jpg', 'html', 'react')),
  scale NUMERIC DEFAULT 1.0,
  file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users manage their own brand kits" 
  ON public.brand_kits FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own projects" 
  ON public.projects FOR ALL USING (auth.uid() = user_id OR is_template = TRUE);

CREATE POLICY "Users view their own exports" 
  ON public.export_logs FOR ALL USING (auth.uid() = user_id);
