export default function ReaderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-gold selection:text-black">
      {children}
    </div>
  )
}
