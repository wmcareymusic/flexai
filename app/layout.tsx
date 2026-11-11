import "./globals.css";
export const metadata = { title: "FlexAI - AI Guided Stretching", description: "Stretch smarter, not longer." };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}
