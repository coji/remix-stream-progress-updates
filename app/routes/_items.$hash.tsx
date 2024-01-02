import { type LoaderFunctionArgs, defer, redirect } from '@remix-run/node'
import { useLoaderData, useParams } from '@remix-run/react'

export const loader = ({ params }: LoaderFunctionArgs) => {
  const { hash } = params
  if (!hash) return redirect('/')

  return defer({})
}

export default function ItemPage() {
  const loaderData = useLoaderData<typeof loader>()
  const { hash } = useParams()

  return <div>Item {hash}</div>
}
