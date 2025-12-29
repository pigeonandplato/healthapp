-- ============================================
-- Supabase RLS Policy Update for Master Videos
-- ============================================
-- Run this in Supabase SQL Editor to allow all users to read master exercise videos
-- ============================================

-- Drop existing policy if it exists (optional, for clean setup)
DROP POLICY IF EXISTS "Allow read master exercise videos" ON settings;

-- Create policy to allow all authenticated users to read master exercise videos
CREATE POLICY "Allow read master exercise videos"
ON settings
FOR SELECT
TO authenticated
USING (key LIKE 'master_exercise_video_%');

-- Optional: Also allow authenticated users to write master videos
-- (This allows any authenticated user to update master videos, not just admin)
-- If you want to restrict writes to admin only, you'll need a more complex policy
-- or handle it in application logic (which we're already doing)
DROP POLICY IF EXISTS "Allow write master exercise videos" ON settings;

CREATE POLICY "Allow write master exercise videos"
ON settings
FOR INSERT
TO authenticated
WITH CHECK (key LIKE 'master_exercise_video_%');

CREATE POLICY "Allow update master exercise videos"
ON settings
FOR UPDATE
TO authenticated
USING (key LIKE 'master_exercise_video_%')
WITH CHECK (key LIKE 'master_exercise_video_%');

-- ============================================
-- Verify the policies were created:
-- ============================================
-- SELECT * FROM pg_policies WHERE tablename = 'settings';

