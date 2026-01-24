import React from "react";
import { cn } from "@/lib/utils";

interface TreeBranchProps {
  children: React.ReactNode;
  isLast?: boolean;
  horizontal?: boolean;
}

export const TreeBranch: React.FC<TreeBranchProps> = ({ children, isLast = false, horizontal = false }) => {
  if (horizontal) {
    return (
      <div className="flex flex-col items-center">
        {/* Vertical connector down from horizontal line */}
        <div className="w-0.5 h-4 bg-connector" />
        
        {/* The child node */}
        <div>
          {children}
        </div>
      </div>
    );
  }

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
