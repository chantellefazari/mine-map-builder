// Legacy P&ID Tag to Asset Number Mappings
// These tags are stored as searchable metadata only - they do not appear in asset names/numbers

export interface PidTagMapping {
  pidTag: string;
  assetNumber: string;
  description: string;
  status: "mapped" | "unmapped";
}

// Rev A P&ID tag mappings have been removed.
// All P&ID tag data is now served from Rev B (database-driven).
export const pidTagMappings: PidTagMapping[] = [];

// Helper function to get P&ID tag by asset number
export const getPidTagByAssetNumber = (assetNumber: string): string => {
  const mapping = pidTagMappings.find(m => m.assetNumber === assetNumber);
  return mapping?.pidTag || "";
};

// Helper function to get asset number by P&ID tag
export const getAssetNumberByPidTag = (pidTag: string): string => {
  const mapping = pidTagMappings.find(m => m.pidTag === pidTag);
  return mapping?.assetNumber || "";
};
