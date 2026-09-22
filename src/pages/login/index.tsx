import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginErrorMessage, useLoginMutation } from '@/features/auth/api/login'
import { Button, NiyatMark, TextField } from '@/shared/ui'

const schema = z.object({
  login: z.string().trim().min(1, 'Enter your login'),
  password: z.string().min(1, 'Enter your password'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const loginMutation = useLoginMutation()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  return (
    <div className="flex h-full items-center justify-center bg-brand-deep p-4">
      <form
        noValidate
        onSubmit={handleSubmit((values) => loginMutation.mutate(values))}
        className="flex w-full max-w-sm flex-col gap-5 rounded-md bg-surface p-8"
      >
        <div className="flex flex-col items-center gap-4 pb-2 text-center">
          <NiyatMark size={48} />
          <div>
            <h1 className="text-xl font-semibold">Niyat Admin</h1>
            <p className="mt-1 text-fg-muted">Sign in with your admin account</p>
          </div>
        </div>

        <TextField
          label="Login"
          autoComplete="username"
          autoFocus
          error={errors.login?.message}
          {...register('login')}
        />
        <TextField
          label="Password"
          type="password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {loginMutation.isError && (
          <p role="alert" className="rounded-sm bg-danger-tint px-3 py-2 text-danger-text">
            {loginErrorMessage(loginMutation.error)}
          </p>
        )}

        <Button type="submit" size="lg" loading={loginMutation.isPending} className="w-full">
          Sign in
        </Button>
      </form>
    </div>
  )
}
