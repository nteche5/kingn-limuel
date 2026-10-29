-- King Lemuel Properties: database security hardening (safe to run; deletes no data).
-- Visitors (anon / logged-in public users) may only READ active listings.
-- All create / edit / delete goes through the website's protected admin API,
-- which uses the server-only service role key (bypasses RLS).

ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ownership_documents ENABLE ROW LEVEL SECURITY;

-- Remove any existing permissive policies on these tables
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname, tablename FROM pg_policies
           WHERE schemaname = 'public' AND tablename IN ('properties','ownership_documents')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
  END LOOP;
END $$;

CREATE POLICY "Public can view active properties"
  ON public.properties FOR SELECT TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Public can view documents of active properties"
  ON public.ownership_documents FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.is_active = true));

-- No INSERT / UPDATE / DELETE policies for anon/authenticated => direct writes are denied.
REVOKE INSERT, UPDATE, DELETE ON public.properties FROM anon, authenticated;
REVOKE INSERT, UPDATE, DELETE ON public.ownership_documents FROM anon, authenticated;
GRANT SELECT ON public.properties, public.ownership_documents TO anon, authenticated;

-- Storage: files stay publicly viewable, but only the server (service role) may upload/change/delete.
DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname = 'storage' AND tablename = 'objects'
             AND (qual ILIKE '%property-files%' OR with_check ILIKE '%property-files%')
             AND cmd IN ('INSERT','UPDATE','DELETE','ALL')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', r.policyname);
  END LOOP;
END $$;
