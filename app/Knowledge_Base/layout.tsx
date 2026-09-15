import { Nav } from "@/components/nav"
import { GeometricBackground } from "@/components/geometric-bg"

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <><GeometricBackground /><Nav /><main className="relative z-10 mx-auto max-w-6xl px-4 pb-24 pt-24 sm:px-6">{children}</main></>
}
