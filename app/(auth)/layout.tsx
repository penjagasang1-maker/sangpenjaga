export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-dark flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {children}
    </div>
  )
}
