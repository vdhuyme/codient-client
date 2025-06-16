import { useAuthorize } from '@/contexts/authorize'

export default function PermissionGuard({ required, mode = 'every', children }) {
  const { user } = useAuthorize()
  const permissions = user?.permissions || []

  const requiredPermissions = Array.isArray(required) ? required : [required]

  const isAuthorized =
    mode === 'every'
      ? requiredPermissions.every((permission) => permissions.includes(permission))
      : requiredPermissions.some((permission) => permissions.includes(permission))

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}
