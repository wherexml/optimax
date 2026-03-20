import { useParams } from '@tanstack/react-router'

export default function WarRoom() {
  const { caseId } = useParams({ from: '/authenticated/warroom/$caseId' })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">War Room Detail</h1>
      <p className="mt-2 text-gray-500">Case ID: {caseId}</p>
    </div>
  )
}
