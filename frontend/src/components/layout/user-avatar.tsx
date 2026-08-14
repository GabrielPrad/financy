import * as AvatarPrimitive from '@radix-ui/react-avatar'
import type { User } from '@/graphql/types'
import { getInitials } from '@/lib/format'
import { cn } from '@/lib/utils'

interface UserAvatarProps {
  user: Pick<User, 'name' | 'avatarUrl'>
  className?: string
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn('relative flex size-9 shrink-0 overflow-hidden rounded-full', className)}
    >
      {user.avatarUrl ? (
        <AvatarPrimitive.Image
          src={user.avatarUrl}
          alt={user.name}
          className="size-full object-cover"
        />
      ) : null}

      <AvatarPrimitive.Fallback className="flex size-full items-center justify-center bg-brand-100 text-xs font-semibold text-brand-700">
        {getInitials(user.name)}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  )
}
