import React, { createContext, useContext, useState, useCallback } from "react";

export interface FLPathSegment {
  level: string;
  label: string;
  code?: string;
  areaType?: string;
}

interface FLBreadcrumbContextType {
  currentPath: FLPathSegment[];
  storedFL: string | null;
  setFullPath: (path: FLPathSegment[], storedFL?: string | null) => void;
  clearPath: () => void;
}

const FLBreadcrumbContext = createContext<FLBreadcrumbContextType>({
  currentPath: [],
  storedFL: null,
  setFullPath: () => {},
  clearPath: () => {},
});

export const useFLBreadcrumb = () => useContext(FLBreadcrumbContext);

export const FLBreadcrumbProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPath, setCurrentPath] = useState<FLPathSegment[]>([]);
  const [storedFL, setStoredFL] = useState<string | null>(null);

  const setFullPath = useCallback((path: FLPathSegment[], fl?: string | null) => {
    setCurrentPath(path);
    setStoredFL(fl ?? null);
  }, []);

  const clearPath = useCallback(() => {
    setCurrentPath([]);
    setStoredFL(null);
  }, []);

  return (
    <FLBreadcrumbContext.Provider value={{ currentPath, storedFL, setFullPath, clearPath }}>
      {children}
    </FLBreadcrumbContext.Provider>
  );
};
