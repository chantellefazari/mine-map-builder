import React from "react";

interface TreeBranchProps {
  children: React.ReactNode;
  isLast?: boolean;
}

export const TreeBranch: React.FC<TreeBranchProps> = ({ children, isLast = false }) => {
  return (
    <div className="flex items-center relative">
      {/* Horizontal connector from vertical line */}
      <div className="w-3 h-0.5 bg-connector" />
      
      {/* The child node */}
      <div className="py-1">
        {children}
      </div>
    </div>
  );
};
