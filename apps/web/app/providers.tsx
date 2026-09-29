"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ReactNode } from "react";
import { queryClient } from "./lib/queryClient";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#161b24",
            color: "#e8ecf1",
            border: "1px solid #2a3240",
            fontSize: "13px",
          },
          success: { iconTheme: { primary: "#20c77f", secondary: "#161b24" } },
          error: { iconTheme: { primary: "#f2495c", secondary: "#161b24" } },
        }}
      />
    </QueryClientProvider>
  );
}
