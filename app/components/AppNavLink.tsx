import { NavLink, type NavLinkProps } from '@remix-run/react'

export const AppNavLink = ({ className, children, ...props }: NavLinkProps) => {
  return (
    <NavLink
      className={({ isActive }) =>
        `rounded hover:bg-blue-100 hover:active:bg-blue-300 hover:text-black px-2 py-1 ${
          isActive ? 'text-white bg-blue-500' : ''
        }`
      }
      {...props}
    >
      {children}
    </NavLink>
  )
}
