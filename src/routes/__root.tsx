// src/routes/__root.tsx
/// <reference types="vite/client" />;

import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";
import appCss from "@/styles/app.css?url";
import CreateFormContext from "@/context/formContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import Favicon from "favicon.svg?url";

const queryclient = new QueryClient();
export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Land Care",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        href: Favicon,
      },
    ],
  }),
  notFoundComponent: () => {
    return <p> This page is isn't available</p>;
  },
  component: RootComponent,
});

function RootComponent() {
  return (
    <>
      <CreateFormContext>
        <RootDocument>
          <QueryClientProvider client={queryclient}>
            <Outlet />
            <Toaster position="top-center" />
          </QueryClientProvider>
        </RootDocument>
      </CreateFormContext>
    </>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
