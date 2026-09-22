import { useAuthStore } from '@/features/auth/model/store'

// Placeholder: real form (react-hook-form + zod + auth API) comes with the design.
export default function LoginPage() {
  const setToken = useAuthStore((s) => s.setToken)

  return (
    <div className="flex h-full items-center justify-center">
      <button type="button" onClick={() => setToken('dev-token')}>
        Sign in (dev)
      </button>
    </div>
  )
}
