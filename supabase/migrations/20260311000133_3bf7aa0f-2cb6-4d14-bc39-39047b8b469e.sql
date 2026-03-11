INSERT INTO storage.buckets (id, name, public)
VALUES ('temp-pdfs', 'temp-pdfs', true)
ON CONFLICT (id) DO NOTHING;