import { Experience } from '@/components/experience'
import { worldFromParams } from '@/lib/world'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const initialWorld = worldFromParams(await searchParams)
  return <Experience initialWorld={initialWorld} />
}
