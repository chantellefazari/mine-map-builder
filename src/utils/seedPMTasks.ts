
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { pmInspectionData } from "./pmInspectionData";

export const seedPMTasks = async () => {
  try {
    console.log("Starting PM Task Seeding...");
    let successCount = 0;
    let failCount = 0;

    for (const [pmName, data] of Object.entries(pmInspectionData)) {
      // 1. Find the PM ID
      const { data: pmData, error: pmError } = await supabase
        .from("pm_master_list")
        .select("id, pm_name")
        .eq("pm_name", pmName)
        .maybeSingle();

      if (pmError) {
        console.error(`Error finding PM '${pmName}':`, pmError);
        failCount++;
        continue;
      }

      if (!pmData) {
        console.warn(`PM '${pmName}' not found in database. Skipping.`);
        failCount++;
        continue;
      }

      // 2. Prepare the payload based on the data type
      let updatePayload: any = {};

      if (Array.isArray(data)) {
        // Standard simple task list
        updatePayload = { tasks: data };
      } else if (data.sections) {
        // Sectioned data (e.g., Mobile Equipment, Filter Press)
        updatePayload = { tasks: data.sections };
      } else if (data.items) {
        // List of items (e.g., RCD circuits)
        updatePayload = { tasks: data.items };
      } else {
        // Complex object (e.g., Mill Daily with specific fields)
        updatePayload = { tasks: data };
      }

      // 3. Update the record
      const { error: updateError } = await supabase
        .from("pm_master_list")
        .update(updatePayload)
        .eq("id", pmData.id);

      if (updateError) {
        console.error(`Error updating PM '${pmName}':`, updateError);
        failCount++;
      } else {
        console.log(`Successfully updated '${pmName}'`);
        successCount++;
      }
    }

    toast.success(`Seeding Complete: ${successCount} updated, ${failCount} failed.`);
    return { success: true, successCount, failCount };

  } catch (error) {
    console.error("Seeding failed:", error);
    toast.error("Seeding failed check console.");
    return { success: false, error };
  }
};
