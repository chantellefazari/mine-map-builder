interface MobileEquipmentHeaderProps {
  columns?: string[];
}

const defaultColumns = ["Make/Model", "Serial No", "Hours", "Next Service Due"];

export const MobileEquipmentHeader = ({ columns = defaultColumns }: MobileEquipmentHeaderProps) => {
  return (
    <div className={`grid border-b border-border text-xs`} style={{ gridTemplateColumns: `repeat(${columns.length}, minmax(0, 1fr))` }}>
      {columns.map((col, idx) => (
        <div key={col} className={idx < columns.length - 1 ? "border-r border-border" : ""}>
          <div className="bg-muted px-2 py-1.5 font-semibold border-b border-border text-center">{col}</div>
          <div className="px-2 py-2 min-h-[32px]"></div>
        </div>
      ))}
    </div>
  );
};
