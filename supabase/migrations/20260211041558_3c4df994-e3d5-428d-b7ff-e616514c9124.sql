
-- ============================================================
-- P0: updated_at Triggers (safe re-creation)
-- ============================================================

DROP TRIGGER IF EXISTS update_site_spares_updated_at ON public.site_spares;
CREATE TRIGGER update_site_spares_updated_at
  BEFORE UPDATE ON public.site_spares
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_visual_parts_catalogue_updated_at ON public.visual_parts_catalogue;
CREATE TRIGGER update_visual_parts_catalogue_updated_at
  BEFORE UPDATE ON public.visual_parts_catalogue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_suppliers_updated_at ON public.suppliers;
CREATE TRIGGER update_suppliers_updated_at
  BEFORE UPDATE ON public.suppliers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_supplier_catalogue_updated_at ON public.supplier_catalogue;
CREATE TRIGGER update_supplier_catalogue_updated_at
  BEFORE UPDATE ON public.supplier_catalogue
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_normalized_components_updated_at ON public.normalized_components;
CREATE TRIGGER update_normalized_components_updated_at
  BEFORE UPDATE ON public.normalized_components
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_po_uploads_updated_at ON public.po_uploads;
CREATE TRIGGER update_po_uploads_updated_at
  BEFORE UPDATE ON public.po_uploads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
