import type { OrgNode } from '@/stores/organization'

export const organizationTree: OrgNode[] = [
  {
    id: 'org-root',
    name: '华智集团',
    type: 'group',
    parentId: null,
    children: [
      {
        id: 'org-east',
        name: '华东事业部',
        type: 'division',
        parentId: 'org-root',
        children: [
          {
            id: 'org-shanghai',
            name: '上海分公司',
            type: 'branch',
            parentId: 'org-east',
          },
          {
            id: 'org-nanjing',
            name: '南京分公司',
            type: 'branch',
            parentId: 'org-east',
          },
        ],
      },
      {
        id: 'org-south',
        name: '华南事业部',
        type: 'division',
        parentId: 'org-root',
        children: [
          {
            id: 'org-shenzhen',
            name: '深圳分公司',
            type: 'branch',
            parentId: 'org-south',
          },
          {
            id: 'org-guangzhou',
            name: '广州工厂',
            type: 'factory',
            parentId: 'org-south',
          },
        ],
      },
      {
        id: 'org-north',
        name: '华北事业部',
        type: 'division',
        parentId: 'org-root',
        children: [
          {
            id: 'org-beijing',
            name: '北京分公司',
            type: 'branch',
            parentId: 'org-north',
          },
        ],
      },
    ],
  },
]

/** Flatten tree for search */
export function flattenOrgs(nodes: OrgNode[]): OrgNode[] {
  const result: OrgNode[] = []
  function walk(list: OrgNode[]) {
    for (const node of list) {
      result.push(node)
      if (node.children) walk(node.children)
    }
  }
  walk(nodes)
  return result
}
