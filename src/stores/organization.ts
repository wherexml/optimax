import { create } from 'zustand'

export interface OrgNode {
  id: string
  name: string
  type: 'group' | 'division' | 'branch' | 'factory'
  parentId: string | null
  children?: OrgNode[]
}

interface OrganizationState {
  currentOrg: OrgNode | null
  setCurrentOrg: (org: OrgNode) => void
}

export const useOrganizationStore = create<OrganizationState>((set) => ({
  currentOrg: null,
  setCurrentOrg: (org: OrgNode) => set({ currentOrg: org }),
}))
