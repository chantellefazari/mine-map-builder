
-- Notifications table for in-app alerts
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_email TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  message TEXT NOT NULL DEFAULT '',
  link TEXT NOT NULL DEFAULT '',
  is_read BOOLEAN NOT NULL DEFAULT false,
  pr_id UUID REFERENCES public.purchase_requests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Allow public insert on notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on notifications" ON public.notifications FOR DELETE USING (true);

-- Add approval fields to purchase_requests
ALTER TABLE public.purchase_requests
  ADD COLUMN IF NOT EXISTS approval_tier TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS assigned_approver TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS rejection_reason TEXT NOT NULL DEFAULT '';

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
