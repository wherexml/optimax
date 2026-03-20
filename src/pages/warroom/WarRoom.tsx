/**
 * War Room Detail Page
 *
 * P06 War Room 协同处置详情页
 * - Case摘要区: 事件级别、负责人、参会人、SLA倒计时、决策状态
 * - 任务看板: 五列看板式任务管理
 * - 方案对比: 推荐方案与备选方案对比 (FE-072)
 * - 会议纪要: 会议纪要与附件管理 (FE-073)
 * - 时间线: 完整事件时间线与评论系统 (FE-074)
 */

import { useState, useMemo } from 'react'
import { useParams } from '@tanstack/react-router'

import { mockCases } from '@/mocks/data/cases'
import { mockTasks, getTasksByCaseId } from '@/mocks/data/tasks'
import { mockSolutions, getSolutionsByCaseId } from '@/mocks/data/solutions'
import { getMinutesByCaseId, getAttachmentsByCaseId } from '@/mocks/data/minutes'
import { getActivitiesByCaseId, getCommentsByCaseId } from '@/mocks/data/warroom-activities'
import type { Case } from '@/types/case'
import type { CaseTask } from '@/types/case'
import type { Solution } from '@/types/solution'

import { CaseSummary } from '@/components/warroom/CaseSummary'
import { TaskBoard } from '@/components/warroom/TaskBoard'
import { SolutionComparison } from '@/components/warroom/SolutionComparison'
import { MeetingMinutes } from '@/components/warroom/MeetingMinutes'
import { WarRoomTimeline } from '@/components/warroom/WarRoomTimeline'
import { CommentSection } from '@/components/warroom/CommentSection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'

// ---------------------------------------------------------------------------
// Mock Case Service
// ---------------------------------------------------------------------------

function getCaseById(caseId: string): Case | undefined {
  return mockCases.find((c) => c.case_id === caseId)
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function WarRoom() {
  const { caseId } = useParams({ from: '/authenticated/warroom/$caseId' })
  const [activeTab, setActiveTab] = useState('tasks')

  // Get case data
  const caseData = useMemo(() => {
    const found = getCaseById(caseId)
    if (!found) {
      // Return a default mock case for development
      return mockCases[0]
    }
    return found
  }, [caseId])

  // Get tasks for this case
  const [tasks, setTasks] = useState<CaseTask[]>(() =>
    getTasksByCaseId(caseId).length > 0
      ? getTasksByCaseId(caseId)
      : mockTasks.filter((t) => t.source_case_id === mockCases[0].case_id)
  )

  // Get solutions for this case
  const [solutions, setSolutions] = useState<Solution[]>(() =>
    getSolutionsByCaseId(caseId).length > 0
      ? getSolutionsByCaseId(caseId)
      : mockSolutions.filter((s) => s.case_id === mockCases[0].case_id)
  )

  // Get minutes for this case
  const minutes = useMemo(() => getMinutesByCaseId(caseId), [caseId])

  // Get attachments for this case
  const attachments = useMemo(() => getAttachmentsByCaseId(caseId), [caseId])

  // Get activities for this case
  const activities = useMemo(() => getActivitiesByCaseId(caseId), [caseId])

  // Get comments for this case
  const comments = useMemo(() => getCommentsByCaseId(caseId), [caseId])

  // Handle task updates
  const handleTaskUpdate = (updatedTask: CaseTask) => {
    setTasks((prev) =>
      prev.map((t) => (t.task_id === updatedTask.task_id ? updatedTask : t))
    )
  }

  // Handle task creation
  const handleTaskCreate = () => {
    toast.info('新建任务功能开发中...')
  }

  // Handle case actions
  const handleAddParticipant = () => {
    toast.info('添加参会人功能开发中...')
  }

  const handleChangeOwner = () => {
    toast.info('修改负责人功能开发中...')
  }

  const handleCloseCase = () => {
    toast.info('关闭 Case 功能开发中...')
  }

  // Handle solution actions
  const handleSolutionApprove = (solutionId: string) => {
    setSolutions((prev) =>
      prev.map((s) =>
        s.solution_id === solutionId ? { ...s, status: 'approved' as const } : s
      )
    )
  }

  const handleSolutionReject = (solutionId: string, reason: string) => {
    setSolutions((prev) =>
      prev.map((s) =>
        s.solution_id === solutionId
          ? { ...s, status: 'rejected' as const, reason }
          : s
      )
    )
  }

  const handleSolutionAbandon = (solutionId: string, reason: string) => {
    setSolutions((prev) =>
      prev.map((s) =>
        s.solution_id === solutionId
          ? { ...s, status: 'abandoned' as const, reason }
          : s
      )
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Case Summary Header */}
      <CaseSummary
        caseData={caseData}
        onAddParticipant={handleAddParticipant}
        onChangeOwner={handleChangeOwner}
        onCloseCase={handleCloseCase}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <div className="bg-white border-b px-6">
            <TabsList className="h-12 bg-transparent border-b-0">
              <TabsTrigger
                value="tasks"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
              >
                任务看板
              </TabsTrigger>
              <TabsTrigger
                value="solutions"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
              >
                方案对比
              </TabsTrigger>
              <TabsTrigger
                value="minutes"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
              >
                会议纪要
              </TabsTrigger>
              <TabsTrigger
                value="timeline"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
              >
                时间线
              </TabsTrigger>
              <TabsTrigger
                value="comments"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-12 px-4"
              >
                评论
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="tasks" className="h-full mt-0 p-6">
              <TaskBoard
                tasks={tasks}
                caseId={caseData.case_id}
                onTaskUpdate={handleTaskUpdate}
                onTaskCreate={handleTaskCreate}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="solutions" className="h-full mt-0">
              <SolutionComparison
                solutions={solutions}
                caseId={caseData.case_id}
                onSolutionApprove={handleSolutionApprove}
                onSolutionReject={handleSolutionReject}
                onSolutionAbandon={handleSolutionAbandon}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="minutes" className="h-full mt-0">
              <MeetingMinutes
                minutes={minutes}
                attachments={attachments}
                caseId={caseData.case_id}
                onMinuteCreate={() => toast.info('创建会议纪要功能开发中...')}
                onMinuteUpdate={() => toast.info('更新会议纪要功能开发中...')}
                onAttachmentUpload={() => toast.info('上传附件功能开发中...')}
                onAttachmentDelete={() => toast.info('删除附件功能开发中...')}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="timeline" className="h-full mt-0">
              <WarRoomTimeline
                activities={activities}
                className="h-full"
              />
            </TabsContent>

            <TabsContent value="comments" className="h-full mt-0">
              <CommentSection
                comments={comments}
                caseId={caseData.case_id}
                participants={caseData.participants}
                onCommentCreate={() => toast.info('发表评论功能开发中...')}
                onCommentUpdate={() => toast.info('更新评论功能开发中...')}
                onCommentDelete={() => toast.info('删除评论功能开发中...')}
                className="h-full"
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
