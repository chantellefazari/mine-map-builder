import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export interface FLPathSegment {
  level: string;
  label: string;
  code?: string;
  areaType?: string;
}

interface FLBreadcrumbContextType {
  currentPath: FLPathSegment[];
  reportExpand: (depth: number, segment: FLPathSegment) => void;
  reportCollapse: (depth: number) => void;
}

const FLBreadcrumbContext = createContext<FLBreadcrumbContextType>({
  currentPath: [],
  reportExpand: () => {},
  reportCollapse: () => {},
});

export const useFLBreadcrumb = () => useContext(FLBreadcrumbContext);

export const FLBreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<FLPathSegment[]>([]);
  // Use a ref to track the latest path for synchronous reads in callbacks
  const pathRef = useRef<FLPathSegment[]>([]);

  const reportExpand = useCallback((depth: number, segment: FLPathSegment) => {
    setCurrentPath(prev => {
      // Replace everything from this depth onward
      const newPath = [...prev.slice(0, depth), segment];
      pathRef.current = newPath;
      return newPath;
    });
  }, []);

  const reportCollapse = useCallback((depth: number) => {
    setCurrentPath(prev => {
      const newPath = prev.slice(0, depth);
      pathRef.current = newPath;
      return newPath;
    });
  }, []);

  return (
    <FLBreadcrumbContext.Provider value={{ currentPath, reportExpand, reportCollapse }}>
      {children}
    </FLBreadcrumbContext.Provider>
  );
};
