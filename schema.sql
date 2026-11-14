-- ========================================================
-- AI CREATIVE INTELLIGENCE STUDIO
-- Enterprise PostgreSQL & Supabase Database Security Schema
-- Row Level Security (RLS) + Column Constraints + Security Auditing
-- ========================================================

-- Enable standard cryptographic extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Revoke default public schema permissions to enforce strict principle of least privilege
ALTER DEFAULT PRIVILEGES REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- ========================================================
-- 1. PROFILES TABLE (User Accounts & Credits)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT CHECK (char_length(full_name) <= 120),
  avatar_url TEXT CHECK (char_length(avatar_url) <= 2048),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'creator', 'business', 'professional')),
  credits_balance INT DEFAULT 50 CHECK (credits_balance >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 2. BRAND KITS TABLE (Brand Identity Storage)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.brand_kits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL CHECK (char_length(name) >= 1 AND char_length(name) <= 150),
  tagline TEXT CHECK (char_length(tagline) <= 250),
  description TEXT CHECK (char_length(description) <= 1000),
  industry TEXT CHECK (char_length(industry) <= 100),
  colors JSONB DEFAULT '{"primary": "#6366F1", "secondary": "#3B82F6", "accent": "#10B981", "neutralDark": "#0B0F19", "neutralLight": "#F8FAFC"}'::jsonb NOT NULL,
  typography JSONB DEFAULT '{"headingFont": "Plus Jakarta Sans", "bodyFont": "Inter"}'::jsonb NOT NULL,
  logo_url TEXT CHECK (char_length(logo_url) <= 2048),
  contact_info JSONB DEFAULT '{}'::jsonb NOT NULL,
  is_default BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 3. PROJECTS TABLE (Design Document Object Model - DDOM)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  brand_kit_id UUID REFERENCES public.brand_kits(id) ON DELETE SET NULL,
  title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 200),
  category TEXT NOT NULL CHECK (category IN ('logo', 'letterhead', 'stationery', 'website', 'social', 'brand')),
  subcategory TEXT CHECK (char_length(subcategory) <= 80),
  ddom JSONB NOT NULL,
  thumbnail_url TEXT CHECK (char_length(thumbnail_url) <= 2048),
  is_template BOOLEAN DEFAULT FALSE NOT NULL,
  export_count INT DEFAULT 0 CHECK (export_count >= 0) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 4. EXPORT LOGS TABLE (Download History & Security Auditing)
-- ========================================================
CREATE TABLE IF NOT EXISTS public.export_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  format TEXT NOT NULL CHECK (format IN ('png', 'svg', 'pdf', 'jpg', 'html', 'react')),
  scale NUMERIC DEFAULT 1.0 CHECK (scale >= 0.25 AND scale <= 5.0) NOT NULL,
  file_url TEXT CHECK (char_length(file_url) <= 2048),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- 5. SECURITY AUDIT LOGS TABLE
-- ========================================================
CREATE TABLE IF NOT EXISTS public.security_audit_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL CHECK (char_length(event_type) <= 100),
  ip_address TEXT CHECK (char_length(ip_address) <= 45),
  user_agent TEXT CHECK (char_length(user_agent) <= 500),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.export_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_audit_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Brand Kits Granular Policies (Prevents user_id spoofing on INSERT)
DROP POLICY IF EXISTS "brand_kits_select" ON public.brand_kits;
CREATE POLICY "brand_kits_select" ON public.brand_kits 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "brand_kits_insert" ON public.brand_kits;
CREATE POLICY "brand_kits_insert" ON public.brand_kits 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "brand_kits_update" ON public.brand_kits;
CREATE POLICY "brand_kits_update" ON public.brand_kits 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "brand_kits_delete" ON public.brand_kits;
CREATE POLICY "brand_kits_delete" ON public.brand_kits 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Projects Granular Policies
DROP POLICY IF EXISTS "projects_select" ON public.projects;
CREATE POLICY "projects_select" ON public.projects 
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR is_template = TRUE);

DROP POLICY IF EXISTS "projects_insert" ON public.projects;
CREATE POLICY "projects_insert" ON public.projects 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_update" ON public.projects;
CREATE POLICY "projects_update" ON public.projects 
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "projects_delete" ON public.projects;
CREATE POLICY "projects_delete" ON public.projects 
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Export Logs Policies
DROP POLICY IF EXISTS "export_logs_select" ON public.export_logs;
CREATE POLICY "export_logs_select" ON public.export_logs 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "export_logs_insert" ON public.export_logs;
CREATE POLICY "export_logs_insert" ON public.export_logs 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Security Audit Logs (Users can only view their own logs, cannot tamper or delete)
DROP POLICY IF EXISTS "security_audit_logs_select" ON public.security_audit_logs;
CREATE POLICY "security_audit_logs_select" ON public.security_audit_logs 
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "security_audit_logs_insert" ON public.security_audit_logs;
CREATE POLICY "security_audit_logs_insert" ON public.security_audit_logs 
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Enforce updated_at timestamp automation via secure internal trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_brand_kits_updated_at ON public.brand_kits;
CREATE TRIGGER trigger_brand_kits_updated_at
  BEFORE UPDATE ON public.brand_kits
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();
