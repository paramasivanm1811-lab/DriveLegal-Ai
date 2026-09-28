import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import defaultLawsData from '@/data/laws.json'

export type Law = {
  id: string
  tier: 'state' | 'local'
  district: string // 'All' if tier is 'state'
  title: string
  desc: string
  authority: string
  penalty: string
  vehicleType?: string
  category?: 'City' | 'Highway' | 'General'
}

export type User = {
  role: 'public' | 'admin'
  name?: string
  passkey?: string
}

interface AppState {
  user: User
  laws: Law[]
  language: 'en' | 'ta'
  toggleLanguage: () => void
  fetchLaws: () => Promise<void>
  loginAsAdmin: (name: string, passkey: string) => void
  logout: () => void
  addLaw: (law: Omit<Law, 'id'>) => Promise<void>
  deleteLaw: (id: string) => Promise<void>
}

const DEFAULT_LAWS: Law[] = defaultLawsData as Law[];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      user: { role: 'public' },
      laws: DEFAULT_LAWS,
      language: 'en',
      
      toggleLanguage: () => set((state) => ({ language: state.language === 'en' ? 'ta' : 'en' })),
      loginAsAdmin: (name, passkey) => set({ user: { role: 'admin', name, passkey } }),
      logout: () => set({ user: { role: 'public', name: undefined, passkey: undefined } }),
      
      fetchLaws: async () => {
        try {
          const res = await fetch('/api/laws');
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            set({ laws: data });
          }
        } catch (e) {
          console.error("Failed to fetch laws");
        }
      },
      addLaw: async (law) => {
        try {
          const passkey = useStore.getState().user.passkey || 'admin123';
          const res = await fetch('/api/laws', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'x-admin-passkey': passkey
            },
            body: JSON.stringify(law)
          });
          if (!res.ok) {
            throw new Error('Failed to add law');
          }
          const newLaw = await res.json();
          set((state) => ({ laws: [newLaw, ...state.laws] }));
        } catch (e) {
          console.error("Failed to add law", e);
          throw e;
        }
      },
      deleteLaw: async (id) => {
        try {
          const passkey = useStore.getState().user.passkey || 'admin123';
          const res = await fetch(`/api/laws/${id}`, { 
            method: 'DELETE',
            headers: { 'x-admin-passkey': passkey }
          });
          if (!res.ok) {
            throw new Error('Failed to delete law');
          }
          set((state) => ({ laws: state.laws.filter(l => l.id !== id) }));
        } catch (e) {
          console.error("Failed to delete law", e);
          throw e;
        }
      }
    }),
    {
      name: 'drivelegal-tn-storage',
      version: 1, // Bumping version clears old localStorage cache to load new expanded laws
    }
  )
)
