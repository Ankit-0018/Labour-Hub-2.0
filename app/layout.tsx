import type React from "react"
import type { Metadata } from "next"
import "./global.css"
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "LabourHub - Hire Trusted Labour Workers",
  description: "Connect with trusted labour workers in your area. Plumbers, electricians, carpenters, and more.",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
