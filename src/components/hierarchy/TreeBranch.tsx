import React from "react";

interface TreeBranchProps {
  children: React.ReactNode;
  isLast?: boolean;
}

export const TreeBranch: React.FC<TreeBranchProps> = ({ children, isLast = false }) => {
  return (
    <div className="flex items-start">
      {/* Horizontal connector from vertical line */}
      <div className="w-3 h-0.5 bg-connector mt-3 -ml-2" />
      
      {/* The child node */}
      <div>
        {children}
      </div>
    </div>
  );
};
