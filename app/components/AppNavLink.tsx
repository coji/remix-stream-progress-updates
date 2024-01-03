import { NavLink, type NavLinkProps } from '@remix-run/react'

export const AppNavLink = ({ className, children, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        `rounded-md px-4 py-1 ${
          isActive
            ? 'text-white bg-blue-500 hover:active:bg-blue-600'
            : 'bg-slate-100'
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}
