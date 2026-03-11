import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PMData, PMTask, PMInspectionPoint } from "@/components/pm-design/PMFrequencySection";
import { PMTemplateData } from "@/components/pm-design/PMTemplateDocument";
import { Json } from "@/integrations/supabase/types";

// ── PM Master List ──────────────────────────────────────────

function rowToPMData(row: any): PMData {
  return {
    id: row.id,
    pmName: row.pm_name,
    equipmentType: row.equipment_type,
    frequency: row.frequency as PMData["frequency"],
    purpose: row.purpose ?? "",
    discipline: row.discipline as PMData["discipline"],
    dutyType: (row.duty_type ?? "Online") as PMData["dutyType"],
    estimatedDuration: row.estimated_duration ?? "",
    skillLevel: row.skill_level ?? "",
    requiredTools: row.required_tools ?? [],
    requiredPPE: row.required_ppe ?? [],
    isolationRequirements: row.isolation_requirements ?? "",
    safetyNotes: row.safety_notes ?? [],
    tasks: (row.tasks as any[] ?? []) as PMTask[],
    inspectionPoints: (row.inspection_points as any[] ?? []) as PMInspectionPoint[],
    acceptableCriteria: row.acceptable_criteria ?? [],
    signsOfFailure: row.signs_of_failure ?? [],
    lubricationNotes: row.lubrication_notes ?? "",
    oemReferences: row.oem_references ?? "",
    status: row.status as PMData["status"],
    assetNumber: row.asset_number ?? "",
    resources: row.resources ?? "",
  };
}

function pmDataToRow(pm: Partial<PMData>) {
  const row: Record<string, any> = {};
  if (pm.pmName !== undefined) row.pm_name = pm.pmName;
  if (pm.equipmentType !== undefined) row.equipment_type = pm.equipmentType;
  if (pm.frequency !== undefined) row.frequency = pm.frequency;
  if (pm.purpose !== undefined) row.purpose = pm.purpose;
  if (pm.discipline !== undefined) row.discipline = pm.discipline;
  if (pm.dutyType !== undefined) row.duty_type = pm.dutyType;
  if (pm.estimatedDuration !== undefined) row.estimated_duration = pm.estimatedDuration;
  if (pm.skillLevel !== undefined) row.skill_level = pm.skillLevel;
  if (pm.requiredTools !== undefined) row.required_tools = pm.requiredTools;
  if (pm.requiredPPE !== undefined) row.required_ppe = pm.requiredPPE;
  if (pm.isolationRequirements !== undefined) row.isolation_requirements = pm.isolationRequirements;
  if (pm.safetyNotes !== undefined) row.safety_notes = pm.safetyNotes;
  if (pm.tasks !== undefined) row.tasks = pm.tasks as unknown as Json;
  if (pm.inspectionPoints !== undefined) row.inspection_points = pm.inspectionPoints as unknown as Json;
  if (pm.acceptableCriteria !== undefined) row.acceptable_criteria = pm.acceptableCriteria;
  if (pm.signsOfFailure !== undefined) row.signs_of_failure = pm.signsOfFailure;
  if (pm.lubricationNotes !== undefined) row.lubrication_notes = pm.lubricationNotes;
  if (pm.oemReferences !== undefined) row.oem_references = pm.oemReferences;
  if (pm.status !== undefined) row.status = pm.status;
  if ((pm as any).assetNumber !== undefined) row.asset_number = (pm as any).assetNumber;
  if ((pm as any).resources !== undefined) row.resources = (pm as any).resources;
  return row;
}

export function usePMasterList() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["pm-master-list"],
    queryFn: async (): Promise<PMData[]> => {
      const { data, error } = await supabase
        .from("pm_master_list")
        .select("*")
        .order("pm_name");
      if (error) throw error;
      return (data ?? []).map(rowToPMData);
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (pm: PMData) => {
      const row = pmDataToRow(pm);
      const { error } = await supabase.from("pm_master_list").upsert({ id: pm.id, ...row } as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pm-master-list"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pm_master_list").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pm-master-list"] }),
  });

  return {
    pms: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    upsertPM: upsertMutation.mutateAsync,
    deletePM: deleteMutation.mutateAsync,
  };
}

// ── PM Templates ────────────────────────────────────────────

function rowToTemplate(row: any): PMTemplateData {
  return {
    id: row.id,
    pmTitle: row.pm_title,
    equipmentType: row.equipment_type,
    pmFrequency: row.pm_frequency,
    discipline: row.discipline as PMTemplateData["discipline"],
    estimatedDuration: row.estimated_duration ?? "",
    skillLevel: row.skill_level ?? "",
    locationArea: row.location_area ?? "",
    revision: row.revision ?? "A",
    preparedBy: row.prepared_by ?? "",
    approvedBy: row.approved_by ?? "",
    lastReviewDate: row.last_review_date ?? "",
    status: row.status as PMTemplateData["status"],
    isolations: (row.isolations ?? { electrical: false, mechanical: false, hydraulic: false, pneumatic: false }) as PMTemplateData["isolations"],
    lotoRequired: row.loto_required ?? false,
    storedEnergyHazards: row.stored_energy_hazards ?? "",
    confinedSpaceRisk: row.confined_space_risk ?? false,
    workingAtHeightsRisk: row.working_at_heights_risk ?? false,
    hotWorkRequired: row.hot_work_required ?? false,
    environmentalHazards: row.environmental_hazards ?? "",
    emergencyStopsLocation: row.emergency_stops_location ?? "",
    ppe: (row.ppe ?? {}) as PMTemplateData["ppe"],
    tools: (row.tools ?? {}) as PMTemplateData["tools"],
    preStartChecks: row.pre_start_checks ?? [],
    inspectionTasks: row.inspection_tasks ?? [],
    mechanicalTasks: row.mechanical_tasks ?? [],
    electricalTasks: row.electrical_tasks ?? [],
    acceptableCriteria: row.acceptable_criteria ?? [],
    signsOfFailure: row.signs_of_failure ?? [],
    lubrication: (row.lubrication ?? {}) as PMTemplateData["lubrication"],
    postWorkChecks: row.post_work_checks ?? [],
  };
}

export function usePMTemplates() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["pm-templates"],
    queryFn: async (): Promise<PMTemplateData[]> => {
      const { data, error } = await supabase
        .from("pm_templates")
        .select("*")
        .order("pm_title");
      if (error) throw error;
      return (data ?? []).map(rowToTemplate);
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (template: PMTemplateData) => {
      const { id, ...rest } = template;
      const row: Record<string, any> = {
        id,
        pm_title: rest.pmTitle,
        equipment_type: rest.equipmentType,
        pm_frequency: rest.pmFrequency,
        discipline: rest.discipline,
        estimated_duration: rest.estimatedDuration,
        skill_level: rest.skillLevel,
        location_area: rest.locationArea,
        revision: rest.revision,
        prepared_by: rest.preparedBy,
        approved_by: rest.approvedBy,
        last_review_date: rest.lastReviewDate,
        status: rest.status,
        isolations: rest.isolations as unknown as Json,
        loto_required: rest.lotoRequired,
        stored_energy_hazards: rest.storedEnergyHazards,
        confined_space_risk: rest.confinedSpaceRisk,
        working_at_heights_risk: rest.workingAtHeightsRisk,
        hot_work_required: rest.hotWorkRequired,
        environmental_hazards: rest.environmentalHazards,
        emergency_stops_location: rest.emergencyStopsLocation,
        ppe: rest.ppe as unknown as Json,
        tools: rest.tools as unknown as Json,
        pre_start_checks: rest.preStartChecks,
        inspection_tasks: rest.inspectionTasks,
        mechanical_tasks: rest.mechanicalTasks,
        electrical_tasks: rest.electricalTasks,
        acceptable_criteria: rest.acceptableCriteria,
        signs_of_failure: rest.signsOfFailure,
        lubrication: rest.lubrication as unknown as Json,
        post_work_checks: rest.postWorkChecks,
      };
      const { error } = await supabase.from("pm_templates").upsert(row as any);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pm-templates"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("pm_templates").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pm-templates"] }),
  });

  return {
    templates: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    upsertTemplate: upsertMutation.mutateAsync,
    deleteTemplate: deleteMutation.mutateAsync,
  };
}
