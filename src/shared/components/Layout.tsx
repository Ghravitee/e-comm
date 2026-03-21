import React from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
// import { DebugAuth } from "./DebugAuth";

export const Layout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">{children}</main>
      {/* <DebugAuth /> */}
      <Footer />
    </div>
  );
};
