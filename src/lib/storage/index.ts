import { DesignDocument, BrandKit, UserProjectSummary } from '../ddom/types';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  subscriptionTier: 'free' | 'creator' | 'business' | 'professional';
  creditsBalance: number;
  createdAt: string;
}

export interface ExportRecord {
  id: string;
  projectId: string;
  projectTitle: string;
  category: string;
  format: 'png' | 'svg' | 'pdf' | 'jpg' | 'html' | 'react';
  scale: number;
  timestamp: string;
  downloadUrl?: string;
  fileSize?: string;
}

const STORAGE_KEYS = {
  PROJECTS: 'aics_projects_v1',
  BRAND_KITS: 'aics_brand_kits_v1',
  EXPORTS: 'aics_exports_v1',
  PROFILE: 'aics_user_profile_v1',
};

export const DEFAULT_BRAND_KIT: BrandKit = {
  id: 'brand-kit-default',
  name: 'Nexus Horizon Dynamics',
  tagline: 'Architecting Tomorrow’s Intelligent Platforms',
  description: 'Enterprise AI & Cloud Infrastructure brand identity',
  industry: 'Artificial Intelligence & Cloud Computing',
  colors: {
    primary: '#6366F1',
    secondary: '#3B82F6',
    accent: '#22C55E',
    neutralDark: '#0B0F19',
    neutralLight: '#F8FAFC',
    background: '#0B0F19',
  },
  typography: {
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Inter',
    accentFont: 'Space Grotesk',
  },
  contactInfo: {
    email: 'contact@nexushorizon.ai',
    phone: '+1 (800) 555-0199',
    website: 'https://nexushorizon.ai',
    address: '100 Innovation Boulevard, Tech Park, Suite 400, San Francisco, CA 94107',
    registrationNumber: 'US-DEL-2024-884920',
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isDefault: true,
};

export const DEFAULT_PROFILE: UserProfile = {
  id: 'usr-default-demo',
  email: 'creator@nexushorizon.ai',
  fullName: 'Alex Vance',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  subscriptionTier: 'creator',
  creditsBalance: 85,
  createdAt: new Date().toISOString(),
};

class StorageAdapter {
  private isBrowser(): boolean {
    return typeof window !== 'undefined';
  }

  getProfile(): UserProfile {
    if (!this.isBrowser()) return DEFAULT_PROFILE;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) return JSON.parse(data);
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(DEFAULT_PROFILE));
      return DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  }

  updateProfile(updates: Partial<UserProfile>): UserProfile {
    const current = this.getProfile();
    const updated = { ...current, ...updates };
    if (this.isBrowser()) {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
    }
    return updated;
  }

  useCredits(amount: number = 1): { success: boolean; remaining: number } {
    const profile = this.getProfile();
    if (profile.creditsBalance < amount) {
      return { success: false, remaining: profile.creditsBalance };
    }
    const updated = this.updateProfile({ creditsBalance: profile.creditsBalance - amount });
    return { success: true, remaining: updated.creditsBalance };
  }

  addCredits(amount: number): number {
    const profile = this.getProfile();
    const updated = this.updateProfile({ creditsBalance: profile.creditsBalance + amount });
    return updated.creditsBalance;
  }

  listBrandKits(): BrandKit[] {
    if (!this.isBrowser()) return [DEFAULT_BRAND_KIT];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.BRAND_KITS);
      if (data) {
        const kits = JSON.parse(data);
        if (kits.length > 0) return kits;
      }
      localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify([DEFAULT_BRAND_KIT]));
      return [DEFAULT_BRAND_KIT];
    } catch {
      return [DEFAULT_BRAND_KIT];
    }
  }

  getBrandKit(id: string): BrandKit | null {
    const kits = this.listBrandKits();
    return kits.find((k) => k.id === id) || null;
  }

  saveBrandKit(kit: BrandKit): void {
    if (!this.isBrowser()) return;
    const kits = this.listBrandKits();
    const index = kits.findIndex((k) => k.id === kit.id);
    if (index >= 0) {
      kits[index] = { ...kit, updatedAt: new Date().toISOString() };
    } else {
      kits.unshift({ ...kit, updatedAt: new Date().toISOString() });
    }
    localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(kits));
  }

  deleteBrandKit(id: string): void {
    if (!this.isBrowser()) return;
    const kits = this.listBrandKits().filter((k) => k.id !== id);
    localStorage.setItem(STORAGE_KEYS.BRAND_KITS, JSON.stringify(kits));
  }

  listProjects(): UserProjectSummary[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) return [];
      const docs: DesignDocument[] = JSON.parse(data);
      return docs.map((doc) => ({
        id: doc.id,
        title: doc.title,
        category: doc.category,
        subcategory: doc.subcategory,
        updatedAt: doc.metadata.updatedAt,
        createdAt: doc.metadata.createdAt,
        layerCount: doc.layers?.length || 0,
        brandKitId: doc.brandKitId,
      }));
    } catch {
      return [];
    }
  }

  getProject(id: string): DesignDocument | null {
    if (!this.isBrowser()) return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) return null;
      const docs: DesignDocument[] = JSON.parse(data);
      return docs.find((d) => d.id === id) || null;
    } catch {
      return null;
    }
  }

  saveProject(doc: DesignDocument): void {
    if (!this.isBrowser()) return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      const docs: DesignDocument[] = data ? JSON.parse(data) : [];
      const index = docs.findIndex((d) => d.id === doc.id);
      const updatedDoc = {
        ...doc,
        metadata: {
          ...doc.metadata,
          updatedAt: new Date().toISOString(),
        },
      };
      if (index >= 0) {
        docs[index] = updatedDoc;
      } else {
        docs.unshift(updatedDoc);
      }
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(docs));
    } catch (e) {
      console.error('Failed to save project:', e);
    }
  }

  deleteProject(id: string): void {
    if (!this.isBrowser()) return;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROJECTS);
      if (!data) return;
      const docs: DesignDocument[] = JSON.parse(data);
      const filtered = docs.filter((d) => d.id !== id);
      localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(filtered));
    } catch (e) {
      console.error('Failed to delete project:', e);
    }
  }

  listExports(): ExportRecord[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXPORTS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  logExport(record: Omit<ExportRecord, 'id' | 'timestamp'>): void {
    if (!this.isBrowser()) return;
    try {
      const exports = this.listExports();
      const newRecord: ExportRecord = {
        ...record,
        id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        timestamp: new Date().toISOString(),
      };
      exports.unshift(newRecord);
      localStorage.setItem(STORAGE_KEYS.EXPORTS, JSON.stringify(exports.slice(0, 50)));
    } catch (e) {
      console.error('Failed to log export:', e);
    }
  }
}

export const storage = new StorageAdapter();
