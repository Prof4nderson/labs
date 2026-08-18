CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  activity TEXT,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL DEFAULT 0,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT INSERT ON public.submissions TO anon;
GRANT SELECT, INSERT ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit" ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can read submissions" ON public.submissions FOR SELECT TO authenticated USING (true);

CREATE POLICY "Anyone can upload entregas" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'entregas');
CREATE POLICY "Authenticated can read entregas" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'entregas');