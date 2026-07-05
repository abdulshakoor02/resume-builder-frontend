import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  variant?: "default" | "auth";
}

export default function Layout({ children, variant = "default" }: LayoutProps) {
  if (variant === "auth") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas p-4">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
