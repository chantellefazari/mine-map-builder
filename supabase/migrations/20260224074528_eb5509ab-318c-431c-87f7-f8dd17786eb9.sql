
-- Add new fields to suppliers table
ALTER TABLE public.suppliers
  ADD COLUMN IF NOT EXISTS abn text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_terms text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS preferred_freight_company text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS default_delivery_address text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS organises_freight boolean NOT NULL DEFAULT false;

-- Add freight/payment fields to purchase_requests
ALTER TABLE public.purchase_requests
  ADD COLUMN IF NOT EXISTS freight_company text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS supplier_abn text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS payment_terms text NOT NULL DEFAULT '';
