export interface Task {
  id: string
  title: string
  status: string
  assignee: string
}

export const tasks: Task[] = []
