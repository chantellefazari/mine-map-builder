import React, { createContext, useContext, useState, useCallback } from "react";

export interface FLPathSegment {
  level: string;
  label: string;
  code?: string;
  areaType?: string;
}

interface FLBreadcrumbContextType {
  currentPath: FLPathSegment[];
  setFullPath: (path: FLPathSegment[]) => void;
  clearPath: () => void;
}

const FLBreadcrumbContext = createContext<FLBreadcrumbContextType>({
  currentPath: [],
  setFullPath: () => {},
  clearPath: () => {},
});

export const useFLBreadcrumb = () => useContext(FLBreadcrumbContext);

export const FLBreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<FLPathSegment[]>([]);

  const setFullPath = useCallback((path: FLPathSegment[]) => {
    setCurrentPath(path);
  }, []);

  const clearPath = useCallback(() => {
    setCurrentPath([]);
  }, []);

  return (
    <FLBreadcrumbContext.Provider value={{ currentPath, setFullPath, clearPath }}>
      {children}
    </FLBreadcrumbContext.Provider>
  );
};
