import { createFileRoute } from '@tanstack/react-router'

import Dashboard from '@/lib/pages/main_dashboard'

export const Route = createFileRoute('/main-dashboard/$nhood')({
    component: NeighborhoodDash,
  });
  
  function NeighborhoodDash() {
    const { nhood } = Route.useParams()
    return <Dashboard neighborhood={nhood} />
  }