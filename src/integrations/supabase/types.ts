export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      audit_log: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: string
          new_data: Json | null
          old_data: Json | null
          operation: string
          record_id: string
          table_name: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          record_id: string
          table_name: string
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          record_id?: string
          table_name?: string
        }
        Relationships: []
      }
      normalized_components: {
        Row: {
          alias_descriptions: string | null
          component_type: string
          created_at: string
          description_cleaned: string
          duplicate_key: string | null
          id: string
          image_url: string | null
          is_master: boolean | null
          last_ordered_date: string | null
          last_ordered_po: string | null
          last_unit_price: number | null
          linked_asset: string | null
          manufacturer: string | null
          model: string | null
          notes: string | null
          part_number: string | null
          review_flag: boolean | null
          supplier: string | null
          total_orders_in_period: number | null
          total_qty_ordered: number | null
          total_spend: number | null
          updated_at: string
          upload_id: string | null
        }
        Insert: {
          alias_descriptions?: string | null
          component_type?: string
          created_at?: string
          description_cleaned: string
          duplicate_key?: string | null
          id?: string
          image_url?: string | null
          is_master?: boolean | null
          last_ordered_date?: string | null
          last_ordered_po?: string | null
          last_unit_price?: number | null
          linked_asset?: string | null
          manufacturer?: string | null
          model?: string | null
          notes?: string | null
          part_number?: string | null
          review_flag?: boolean | null
          supplier?: string | null
          total_orders_in_period?: number | null
          total_qty_ordered?: number | null
          total_spend?: number | null
          updated_at?: string
          upload_id?: string | null
        }
        Update: {
          alias_descriptions?: string | null
          component_type?: string
          created_at?: string
          description_cleaned?: string
          duplicate_key?: string | null
          id?: string
          image_url?: string | null
          is_master?: boolean | null
          last_ordered_date?: string | null
          last_ordered_po?: string | null
          last_unit_price?: number | null
          linked_asset?: string | null
          manufacturer?: string | null
          model?: string | null
          notes?: string | null
          part_number?: string | null
          review_flag?: boolean | null
          supplier?: string | null
          total_orders_in_period?: number | null
          total_qty_ordered?: number | null
          total_spend?: number | null
          updated_at?: string
          upload_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "normalized_components_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "po_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          link: string
          message: string
          pr_id: string | null
          title: string
          user_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string
          message?: string
          pr_id?: string | null
          title?: string
          user_email?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          link?: string
          message?: string
          pr_id?: string | null
          title?: string
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      pm_asset_link_staging: {
        Row: {
          asset_match_key: string | null
          committed: boolean
          committed_at: string | null
          committed_by: string | null
          created_at: string
          current_linked_asset: string | null
          id: string
          match_confidence: string
          matched_asset_area: string | null
          matched_asset_id: string | null
          matched_asset_name: string | null
          matched_asset_parent: string | null
          pm_equipment_ref: string
          pm_frequency: string
          pm_template_id: string
          pm_template_name: string
          updated_at: string
          validation_status: string
        }
        Insert: {
          asset_match_key?: string | null
          committed?: boolean
          committed_at?: string | null
          committed_by?: string | null
          created_at?: string
          current_linked_asset?: string | null
          id?: string
          match_confidence?: string
          matched_asset_area?: string | null
          matched_asset_id?: string | null
          matched_asset_name?: string | null
          matched_asset_parent?: string | null
          pm_equipment_ref?: string
          pm_frequency?: string
          pm_template_id: string
          pm_template_name: string
          updated_at?: string
          validation_status?: string
        }
        Update: {
          asset_match_key?: string | null
          committed?: boolean
          committed_at?: string | null
          committed_by?: string | null
          created_at?: string
          current_linked_asset?: string | null
          id?: string
          match_confidence?: string
          matched_asset_area?: string | null
          matched_asset_id?: string | null
          matched_asset_name?: string | null
          matched_asset_parent?: string | null
          pm_equipment_ref?: string
          pm_frequency?: string
          pm_template_id?: string
          pm_template_name?: string
          updated_at?: string
          validation_status?: string
        }
        Relationships: []
      }
      pm_master_list: {
        Row: {
          acceptable_criteria: string[]
          asset_number: string
          created_at: string
          discipline: string
          duty_type: string
          equipment_type: string
          estimated_duration: string
          frequency: string
          id: string
          inspection_points: Json
          isolation_requirements: string
          lubrication_notes: string
          oem_references: string
          pm_name: string
          purpose: string
          required_ppe: string[]
          required_tools: string[]
          resources: string
          safety_notes: string[]
          signs_of_failure: string[]
          skill_level: string
          status: string
          tasks: Json
          updated_at: string
        }
        Insert: {
          acceptable_criteria?: string[]
          asset_number?: string
          created_at?: string
          discipline: string
          duty_type?: string
          equipment_type: string
          estimated_duration?: string
          frequency: string
          id?: string
          inspection_points?: Json
          isolation_requirements?: string
          lubrication_notes?: string
          oem_references?: string
          pm_name: string
          purpose?: string
          required_ppe?: string[]
          required_tools?: string[]
          resources?: string
          safety_notes?: string[]
          signs_of_failure?: string[]
          skill_level?: string
          status?: string
          tasks?: Json
          updated_at?: string
        }
        Update: {
          acceptable_criteria?: string[]
          asset_number?: string
          created_at?: string
          discipline?: string
          duty_type?: string
          equipment_type?: string
          estimated_duration?: string
          frequency?: string
          id?: string
          inspection_points?: Json
          isolation_requirements?: string
          lubrication_notes?: string
          oem_references?: string
          pm_name?: string
          purpose?: string
          required_ppe?: string[]
          required_tools?: string[]
          resources?: string
          safety_notes?: string[]
          signs_of_failure?: string[]
          skill_level?: string
          status?: string
          tasks?: Json
          updated_at?: string
        }
        Relationships: []
      }
      pm_templates: {
        Row: {
          acceptable_criteria: string[]
          approved_by: string
          asset_number: string
          confined_space_risk: boolean
          created_at: string
          discipline: string
          electrical_tasks: string[]
          emergency_stops_location: string
          environmental_hazards: string
          equipment_type: string
          estimated_duration: string
          hot_work_required: boolean
          id: string
          inspection_tasks: string[]
          isolations: Json
          last_review_date: string
          location_area: string
          loto_required: boolean
          lubrication: Json
          mechanical_tasks: string[]
          pm_frequency: string
          pm_title: string
          post_work_checks: string[]
          ppe: Json
          pre_start_checks: string[]
          prepared_by: string
          revision: string
          signs_of_failure: string[]
          skill_level: string
          status: string
          stored_energy_hazards: string
          tools: Json
          updated_at: string
          working_at_heights_risk: boolean
        }
        Insert: {
          acceptable_criteria?: string[]
          approved_by?: string
          asset_number?: string
          confined_space_risk?: boolean
          created_at?: string
          discipline: string
          electrical_tasks?: string[]
          emergency_stops_location?: string
          environmental_hazards?: string
          equipment_type: string
          estimated_duration?: string
          hot_work_required?: boolean
          id?: string
          inspection_tasks?: string[]
          isolations?: Json
          last_review_date?: string
          location_area?: string
          loto_required?: boolean
          lubrication?: Json
          mechanical_tasks?: string[]
          pm_frequency: string
          pm_title: string
          post_work_checks?: string[]
          ppe?: Json
          pre_start_checks?: string[]
          prepared_by?: string
          revision?: string
          signs_of_failure?: string[]
          skill_level?: string
          status?: string
          stored_energy_hazards?: string
          tools?: Json
          updated_at?: string
          working_at_heights_risk?: boolean
        }
        Update: {
          acceptable_criteria?: string[]
          approved_by?: string
          asset_number?: string
          confined_space_risk?: boolean
          created_at?: string
          discipline?: string
          electrical_tasks?: string[]
          emergency_stops_location?: string
          environmental_hazards?: string
          equipment_type?: string
          estimated_duration?: string
          hot_work_required?: boolean
          id?: string
          inspection_tasks?: string[]
          isolations?: Json
          last_review_date?: string
          location_area?: string
          loto_required?: boolean
          lubrication?: Json
          mechanical_tasks?: string[]
          pm_frequency?: string
          pm_title?: string
          post_work_checks?: string[]
          ppe?: Json
          pre_start_checks?: string[]
          prepared_by?: string
          revision?: string
          signs_of_failure?: string[]
          skill_level?: string
          status?: string
          stored_energy_hazards?: string
          tools?: Json
          updated_at?: string
          working_at_heights_risk?: boolean
        }
        Relationships: []
      }
      po_line_items: {
        Row: {
          created_at: string
          extra_references: string | null
          id: string
          item_description: string
          manufacturer: string | null
          model: string | null
          part_number: string | null
          po_date: string | null
          po_number: string | null
          qty: number | null
          row_index: number | null
          supplier: string | null
          total_price: number | null
          unit_price: number | null
          upload_id: string
        }
        Insert: {
          created_at?: string
          extra_references?: string | null
          id?: string
          item_description: string
          manufacturer?: string | null
          model?: string | null
          part_number?: string | null
          po_date?: string | null
          po_number?: string | null
          qty?: number | null
          row_index?: number | null
          supplier?: string | null
          total_price?: number | null
          unit_price?: number | null
          upload_id: string
        }
        Update: {
          created_at?: string
          extra_references?: string | null
          id?: string
          item_description?: string
          manufacturer?: string | null
          model?: string | null
          part_number?: string | null
          po_date?: string | null
          po_number?: string | null
          qty?: number | null
          row_index?: number | null
          supplier?: string | null
          total_price?: number | null
          unit_price?: number | null
          upload_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_line_items_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "po_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      po_tracker: {
        Row: {
          attachment_url: string | null
          comments: string
          confirmed_on_site: boolean
          created_at: string
          date_received: string | null
          eta: string | null
          freight_company: string
          freight_required: boolean
          freight_tracking_number: string
          id: string
          order_date: string | null
          po_number: string
          pr_id: string | null
          status: string
          supervisor: string
          supplier: string
          total_value: number
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          comments?: string
          confirmed_on_site?: boolean
          created_at?: string
          date_received?: string | null
          eta?: string | null
          freight_company?: string
          freight_required?: boolean
          freight_tracking_number?: string
          id?: string
          order_date?: string | null
          po_number: string
          pr_id?: string | null
          status?: string
          supervisor?: string
          supplier?: string
          total_value?: number
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          comments?: string
          confirmed_on_site?: boolean
          created_at?: string
          date_received?: string | null
          eta?: string | null
          freight_company?: string
          freight_required?: boolean
          freight_tracking_number?: string
          id?: string
          order_date?: string | null
          po_number?: string
          pr_id?: string | null
          status?: string
          supervisor?: string
          supplier?: string
          total_value?: number
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "po_tracker_pr_id_fkey"
            columns: ["pr_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "po_tracker_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      po_tracker_lines: {
        Row: {
          created_at: string
          id: string
          notes: string
          part_description: string
          part_number: string
          po_tracker_id: string
          quantity_ordered: number
          received_qty: number
          unit_price: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string
          part_description?: string
          part_number?: string
          po_tracker_id: string
          quantity_ordered?: number
          received_qty?: number
          unit_price?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string
          part_description?: string
          part_number?: string
          po_tracker_id?: string
          quantity_ordered?: number
          received_qty?: number
          unit_price?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "po_tracker_lines_po_tracker_id_fkey"
            columns: ["po_tracker_id"]
            isOneToOne: false
            referencedRelation: "po_tracker"
            referencedColumns: ["id"]
          },
        ]
      }
      po_uploads: {
        Row: {
          category: string
          created_at: string
          date_range_covered: string | null
          file_name: string | null
          file_type: string | null
          id: string
          notes: string | null
          processed_at: string | null
          status: string | null
          supplier_name: string
          updated_at: string
          uploaded_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          date_range_covered?: string | null
          file_name?: string | null
          file_type?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          status?: string | null
          supplier_name: string
          updated_at?: string
          uploaded_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          date_range_covered?: string | null
          file_name?: string | null
          file_type?: string | null
          id?: string
          notes?: string | null
          processed_at?: string | null
          status?: string | null
          supplier_name?: string
          updated_at?: string
          uploaded_at?: string
        }
        Relationships: []
      }
      processing_functional_locations: {
        Row: {
          area: string
          area_code: string
          created_at: string
          fl_code: string
          id: string
          sub_area: string
          sub_area_code: string
          system_name: string
        }
        Insert: {
          area: string
          area_code: string
          created_at?: string
          fl_code: string
          id?: string
          sub_area: string
          sub_area_code: string
          system_name: string
        }
        Update: {
          area?: string
          area_code?: string
          created_at?: string
          fl_code?: string
          id?: string
          sub_area?: string
          sub_area_code?: string
          system_name?: string
        }
        Relationships: []
      }
      processing_naming_conventions: {
        Row: {
          category: string | null
          code: string
          convention_type: string
          created_at: string
          description: string | null
          example: string | null
          id: string
          meaning: string
        }
        Insert: {
          category?: string | null
          code: string
          convention_type: string
          created_at?: string
          description?: string | null
          example?: string | null
          id?: string
          meaning: string
        }
        Update: {
          category?: string | null
          code?: string
          convention_type?: string
          created_at?: string
          description?: string | null
          example?: string | null
          id?: string
          meaning?: string
        }
        Relationships: []
      }
      processing_pid_tags: {
        Row: {
          asset_number: string
          created_at: string
          description: string
          id: string
          pid_tag: string
          status: string
        }
        Insert: {
          asset_number: string
          created_at?: string
          description: string
          id?: string
          pid_tag: string
          status?: string
        }
        Update: {
          asset_number?: string
          created_at?: string
          description?: string
          id?: string
          pid_tag?: string
          status?: string
        }
        Relationships: []
      }
      processing_plant_assets: {
        Row: {
          area_code: string
          area_label: string
          asset_name: string
          asset_number: string
          components: Json | null
          created_at: string
          facility: string
          functional_location: string | null
          id: string
          parent_asset_label: string
          pid_tags: string[] | null
          sub_area: string
          updated_at: string
        }
        Insert: {
          area_code: string
          area_label: string
          asset_name: string
          asset_number: string
          components?: Json | null
          created_at?: string
          facility?: string
          functional_location?: string | null
          id?: string
          parent_asset_label: string
          pid_tags?: string[] | null
          sub_area: string
          updated_at?: string
        }
        Update: {
          area_code?: string
          area_label?: string
          asset_name?: string
          asset_number?: string
          components?: Json | null
          created_at?: string
          facility?: string
          functional_location?: string | null
          id?: string
          parent_asset_label?: string
          pid_tags?: string[] | null
          sub_area?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          full_name?: string
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      purchase_request_lines: {
        Row: {
          created_at: string
          estimated_cost: number
          gl_code: string
          id: string
          part_description: string
          purchase_request_id: string
          quantity: number
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          estimated_cost?: number
          gl_code?: string
          id?: string
          part_description?: string
          purchase_request_id: string
          quantity?: number
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          estimated_cost?: number
          gl_code?: string
          id?: string
          part_description?: string
          purchase_request_id?: string
          quantity?: number
          sort_order?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "purchase_request_lines_purchase_request_id_fkey"
            columns: ["purchase_request_id"]
            isOneToOne: false
            referencedRelation: "purchase_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      purchase_requests: {
        Row: {
          admin_notes: string
          admin_reviewed_at: string | null
          admin_reviewed_by: string
          approval_amount: number
          approval_comment: string
          approval_tier: string
          approved_at: string | null
          approved_by: string | null
          assigned_approver: string
          comments: string
          created_at: string
          delivery_address: string
          department: string
          description_scope: string
          estimated_freight_cost: number
          freight_company: string
          id: string
          payment_terms: string
          pr_number: string
          priority: string
          quote_url: string | null
          rejection_reason: string
          request_title: string
          required_date: string | null
          status: string
          submitted_at: string | null
          supervisor_name: string
          supervisor_user_id: string | null
          supplier_abn: string
          supplier_id: string | null
          supplier_name: string
          supplier_organises_freight: boolean
          updated_at: string
          work_order_id: string | null
        }
        Insert: {
          admin_notes?: string
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string
          approval_amount?: number
          approval_comment?: string
          approval_tier?: string
          approved_at?: string | null
          approved_by?: string | null
          assigned_approver?: string
          comments?: string
          created_at?: string
          delivery_address?: string
          department?: string
          description_scope?: string
          estimated_freight_cost?: number
          freight_company?: string
          id?: string
          payment_terms?: string
          pr_number: string
          priority?: string
          quote_url?: string | null
          rejection_reason?: string
          request_title?: string
          required_date?: string | null
          status?: string
          submitted_at?: string | null
          supervisor_name?: string
          supervisor_user_id?: string | null
          supplier_abn?: string
          supplier_id?: string | null
          supplier_name?: string
          supplier_organises_freight?: boolean
          updated_at?: string
          work_order_id?: string | null
        }
        Update: {
          admin_notes?: string
          admin_reviewed_at?: string | null
          admin_reviewed_by?: string
          approval_amount?: number
          approval_comment?: string
          approval_tier?: string
          approved_at?: string | null
          approved_by?: string | null
          assigned_approver?: string
          comments?: string
          created_at?: string
          delivery_address?: string
          department?: string
          description_scope?: string
          estimated_freight_cost?: number
          freight_company?: string
          id?: string
          payment_terms?: string
          pr_number?: string
          priority?: string
          quote_url?: string | null
          rejection_reason?: string
          request_title?: string
          required_date?: string | null
          status?: string
          submitted_at?: string | null
          supervisor_name?: string
          supervisor_user_id?: string | null
          supplier_abn?: string
          supplier_id?: string | null
          supplier_name?: string
          supplier_organises_freight?: boolean
          updated_at?: string
          work_order_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "purchase_requests_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "purchase_requests_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      site_config: {
        Row: {
          config_key: string
          config_value: Json
          created_at: string
          description: string | null
          id: string
          updated_at: string
        }
        Insert: {
          config_key: string
          config_value: Json
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Update: {
          config_key?: string
          config_value?: Json
          created_at?: string
          description?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_spares: {
        Row: {
          aisle: string | null
          alternate_part_number: string | null
          asset_tag: string | null
          bin_location: string | null
          category: string | null
          condition: string | null
          created_at: string | null
          critical_spare_id: string | null
          description: string
          id: string
          image_urls: string[] | null
          is_critical: boolean | null
          last_purchase_date: string | null
          lead_time_days: number | null
          manufacturer: string | null
          max_qty: number | null
          min_qty: number | null
          notes: string | null
          oem_part_number: string | null
          part_number: string | null
          preferred_supplier: string | null
          qty_on_hand: number | null
          rack: string | null
          reorder_point: number | null
          specifications: string | null
          status: string | null
          storage_type: string | null
          subcategory: string | null
          unit_cost: number | null
          uom: string | null
          updated_at: string | null
          warehouse_area: string | null
        }
        Insert: {
          aisle?: string | null
          alternate_part_number?: string | null
          asset_tag?: string | null
          bin_location?: string | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          critical_spare_id?: string | null
          description: string
          id?: string
          image_urls?: string[] | null
          is_critical?: boolean | null
          last_purchase_date?: string | null
          lead_time_days?: number | null
          manufacturer?: string | null
          max_qty?: number | null
          min_qty?: number | null
          notes?: string | null
          oem_part_number?: string | null
          part_number?: string | null
          preferred_supplier?: string | null
          qty_on_hand?: number | null
          rack?: string | null
          reorder_point?: number | null
          specifications?: string | null
          status?: string | null
          storage_type?: string | null
          subcategory?: string | null
          unit_cost?: number | null
          uom?: string | null
          updated_at?: string | null
          warehouse_area?: string | null
        }
        Update: {
          aisle?: string | null
          alternate_part_number?: string | null
          asset_tag?: string | null
          bin_location?: string | null
          category?: string | null
          condition?: string | null
          created_at?: string | null
          critical_spare_id?: string | null
          description?: string
          id?: string
          image_urls?: string[] | null
          is_critical?: boolean | null
          last_purchase_date?: string | null
          lead_time_days?: number | null
          manufacturer?: string | null
          max_qty?: number | null
          min_qty?: number | null
          notes?: string | null
          oem_part_number?: string | null
          part_number?: string | null
          preferred_supplier?: string | null
          qty_on_hand?: number | null
          rack?: string | null
          reorder_point?: number | null
          specifications?: string | null
          status?: string | null
          storage_type?: string | null
          subcategory?: string | null
          unit_cost?: number | null
          uom?: string | null
          updated_at?: string | null
          warehouse_area?: string | null
        }
        Relationships: []
      }
      supplier_catalogue: {
        Row: {
          alternate_part_numbers: string
          component_description: string
          component_type: string
          created_at: string
          id: string
          image_url: string | null
          notes: string
          oem_brand: string
          oem_part_number: string
          priority_tag: string
          supplier_id: string | null
          supplier_name: string
          updated_at: string
        }
        Insert: {
          alternate_part_numbers?: string
          component_description: string
          component_type?: string
          created_at?: string
          id?: string
          image_url?: string | null
          notes?: string
          oem_brand?: string
          oem_part_number?: string
          priority_tag?: string
          supplier_id?: string | null
          supplier_name?: string
          updated_at?: string
        }
        Update: {
          alternate_part_numbers?: string
          component_description?: string
          component_type?: string
          created_at?: string
          id?: string
          image_url?: string | null
          notes?: string
          oem_brand?: string
          oem_part_number?: string
          priority_tag?: string
          supplier_id?: string | null
          supplier_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_catalogue_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      suppliers: {
        Row: {
          abn: string
          code: string
          contact: string
          created_at: string
          default_delivery_address: string
          email: string
          id: string
          is_preferred: boolean
          location: string
          mobile: string
          name: string
          notes: string
          organises_freight: boolean
          payment_terms: string
          preferred_freight_company: string
          type: string
          updated_at: string
          what_used_for: string
          work_phone: string
        }
        Insert: {
          abn?: string
          code?: string
          contact?: string
          created_at?: string
          default_delivery_address?: string
          email?: string
          id?: string
          is_preferred?: boolean
          location?: string
          mobile?: string
          name: string
          notes?: string
          organises_freight?: boolean
          payment_terms?: string
          preferred_freight_company?: string
          type?: string
          updated_at?: string
          what_used_for?: string
          work_phone?: string
        }
        Update: {
          abn?: string
          code?: string
          contact?: string
          created_at?: string
          default_delivery_address?: string
          email?: string
          id?: string
          is_preferred?: boolean
          location?: string
          mobile?: string
          name?: string
          notes?: string
          organises_freight?: boolean
          payment_terms?: string
          preferred_freight_company?: string
          type?: string
          updated_at?: string
          what_used_for?: string
          work_phone?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_tab_permissions: {
        Row: {
          created_at: string
          granted: boolean
          id: string
          tab_key: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          granted?: boolean
          id?: string
          tab_key: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          granted?: boolean
          id?: string
          tab_key?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      visual_parts_catalogue: {
        Row: {
          associated_asset: string | null
          bin_location: string | null
          category: string
          created_at: string
          criticality: string
          id: string
          image_urls: string[] | null
          lead_time_days: number | null
          max_qty: number | null
          min_qty: number | null
          notes: string | null
          part_name: string
          qty_in_stock: number | null
          site_part_number: string
          supplier: string | null
          unit_price: number | null
          updated_at: string
          warehouse_area: string | null
        }
        Insert: {
          associated_asset?: string | null
          bin_location?: string | null
          category?: string
          created_at?: string
          criticality?: string
          id?: string
          image_urls?: string[] | null
          lead_time_days?: number | null
          max_qty?: number | null
          min_qty?: number | null
          notes?: string | null
          part_name: string
          qty_in_stock?: number | null
          site_part_number: string
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string
          warehouse_area?: string | null
        }
        Update: {
          associated_asset?: string | null
          bin_location?: string | null
          category?: string
          created_at?: string
          criticality?: string
          id?: string
          image_urls?: string[] | null
          lead_time_days?: number | null
          max_qty?: number | null
          min_qty?: number | null
          notes?: string | null
          part_name?: string
          qty_in_stock?: number | null
          site_part_number?: string
          supplier?: string | null
          unit_price?: number | null
          updated_at?: string
          warehouse_area?: string | null
        }
        Relationships: []
      }
      work_order_parts: {
        Row: {
          comment: string
          created_at: string
          id: string
          last_updated_by: string
          last_updated_date: string
          location: string
          part_description: string
          part_number: string
          quantity_required: number
          status: string
          updated_at: string
          work_order_id: string
        }
        Insert: {
          comment?: string
          created_at?: string
          id?: string
          last_updated_by?: string
          last_updated_date?: string
          location?: string
          part_description?: string
          part_number?: string
          quantity_required?: number
          status?: string
          updated_at?: string
          work_order_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          last_updated_by?: string
          last_updated_date?: string
          location?: string
          part_description?: string
          part_number?: string
          quantity_required?: number
          status?: string
          updated_at?: string
          work_order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_parts_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      work_order_parts_audit: {
        Row: {
          changed_at: string
          changed_by: string
          field_changed: string
          id: string
          new_value: string | null
          old_value: string | null
          work_order_id: string
          work_order_part_id: string
        }
        Insert: {
          changed_at?: string
          changed_by?: string
          field_changed: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          work_order_id: string
          work_order_part_id: string
        }
        Update: {
          changed_at?: string
          changed_by?: string
          field_changed?: string
          id?: string
          new_value?: string | null
          old_value?: string | null
          work_order_id?: string
          work_order_part_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_order_parts_audit_work_order_id_fkey"
            columns: ["work_order_id"]
            isOneToOne: false
            referencedRelation: "work_orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_order_parts_audit_work_order_part_id_fkey"
            columns: ["work_order_part_id"]
            isOneToOne: false
            referencedRelation: "work_order_parts"
            referencedColumns: ["id"]
          },
        ]
      }
      work_orders: {
        Row: {
          asset_id: string | null
          assigned_to: string | null
          created_at: string
          date_completed: string | null
          date_raised: string | null
          functional_location: string | null
          id: string
          labour_hours: Json
          operations_handover_date: string
          operations_handover_name: string
          parts_used: string | null
          priority: string
          problem_description: string | null
          requested_by: string | null
          required_tooling: string | null
          resources_required: string
          returned_to_service: string
          scope_of_works: string | null
          status: string
          supervisor_name: string
          supervisor_sign_date: string
          technician_name: string
          technician_sign_date: string
          trade: string | null
          updated_at: string
          wo_number: string
          work_performed: string | null
          work_type: string
        }
        Insert: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string
          date_completed?: string | null
          date_raised?: string | null
          functional_location?: string | null
          id?: string
          labour_hours?: Json
          operations_handover_date?: string
          operations_handover_name?: string
          parts_used?: string | null
          priority?: string
          problem_description?: string | null
          requested_by?: string | null
          required_tooling?: string | null
          resources_required?: string
          returned_to_service?: string
          scope_of_works?: string | null
          status?: string
          supervisor_name?: string
          supervisor_sign_date?: string
          technician_name?: string
          technician_sign_date?: string
          trade?: string | null
          updated_at?: string
          wo_number: string
          work_performed?: string | null
          work_type?: string
        }
        Update: {
          asset_id?: string | null
          assigned_to?: string | null
          created_at?: string
          date_completed?: string | null
          date_raised?: string | null
          functional_location?: string | null
          id?: string
          labour_hours?: Json
          operations_handover_date?: string
          operations_handover_name?: string
          parts_used?: string | null
          priority?: string
          problem_description?: string | null
          requested_by?: string | null
          required_tooling?: string | null
          resources_required?: string
          returned_to_service?: string
          scope_of_works?: string | null
          status?: string
          supervisor_name?: string
          supervisor_sign_date?: string
          technician_name?: string
          technician_sign_date?: string
          trade?: string | null
          updated_at?: string
          wo_number?: string
          work_performed?: string | null
          work_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      next_po_number: { Args: never; Returns: string }
      next_pr_number: { Args: never; Returns: string }
      next_wo_number: { Args: never; Returns: string }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
