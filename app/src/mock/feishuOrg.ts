// Demo directory only. A production integration must resolve Feishu user and
// department IDs server-side before creating or deciding an approval.
interface FeishuMember {
  id: string
  name: string
  departmentId: string
  managerId: string | null
}

const MEMBERS: FeishuMember[] = [
  { id: 'u-emily', name: 'Emily Carter', departmentId: 'dept-us-pd', managerId: null },
  { id: 'u-sarah', name: 'Sarah Thompson', departmentId: 'dept-us-pd', managerId: 'u-emily' },
  { id: 'u-josh', name: 'Josh Miller', departmentId: 'dept-us-pd', managerId: 'u-sarah' },
  { id: 'u-mike', name: 'Mike Torres', departmentId: 'dept-us-pd', managerId: 'u-sarah' },
  { id: 'u-wei', name: 'Wei Zhang', departmentId: 'dept-cn-pd', managerId: null },
  { id: 'u-xiaomei', name: 'Xiaomei Li', departmentId: 'dept-cn-pd', managerId: 'u-wei' },
]

export function getFeishuMember(id: string) {
  return MEMBERS.find(member => member.id === id) ?? null
}

export function resolveDepartmentManager(userId: string) {
  const member = getFeishuMember(userId)
  if (!member) return null
  const manager = MEMBERS.find(candidate => candidate.id === member.managerId)
  return manager && manager.departmentId === member.departmentId ? manager : null
}

export function canReviewRequest(reviewerId: string, requesterId: string, approverId: string) {
  const reviewer = getFeishuMember(reviewerId)
  const requester = getFeishuMember(requesterId)
  const currentManager = resolveDepartmentManager(requesterId)
  return Boolean(reviewer && requester && reviewer.id !== requester.id
    && reviewer.departmentId === requester.departmentId && reviewer.id === approverId
    && currentManager?.id === reviewer.id)
}
