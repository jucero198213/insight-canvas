import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TenantConfig } from '@/types';

interface TenantContextType {
  tenant: TenantConfig;
  setTenant: (tenant: TenantConfig) => void;
}

const defaultTenant: TenantConfig = {
  nome: 'AnalyticsPro',
  logo_url: null,
  cor_primaria: '#0d3b66',
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<TenantConfig>(defaultTenant);

  return (
    <TenantContext.Provider value={{ tenant, setTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
