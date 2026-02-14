import { useNavigate } from "react-router-dom"

import { Button } from "../components/ui/button"

export function ApprovalPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("authUser")
    navigate("/", { replace: true })
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl rounded-xl border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-foreground">Approval</h1>
        <p className="mt-2 text-sm text-muted-foreground">User landing page route is active.</p>
        <Button className="mt-6" variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </main>
  )
}
