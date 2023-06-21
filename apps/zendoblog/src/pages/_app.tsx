import type { AppProps } from "next/app";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import "@/styles/globals.css";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import PlausibleProvider from "next-plausible";
import {
  QueryClient,
  QueryClientProvider,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { Toaster, toast } from "sonner";

// Fonts
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-mono",
});

// Pages that don't require authentication
const publicPages = ["/"];

// Main Component
function MyApp({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const isPublicPage = publicPages.includes(pathname);

  return (
    <PlausibleProvider domain="zendo.blog">
      <ClerkProvider {...pageProps}>
        <QueryClientProvider client={new QueryClient()}>
          <div
            className={`${inter.variable} ${ibmPlexMono.variable} font-sans`}
          >
            {isPublicPage ? (
              <motion.div
                key={pathname}
                initial="pageInitial"
                animate="pageAnimate"
                exit={{ opacity: 0 }}
                variants={{
                  pageInitial: {
                    opacity: 0,
                    y: -10,
                  },
                  pageAnimate: {
                    opacity: 1,
                    y: 0,
                  },
                }}
              >
                <Component key={pathname} {...pageProps} />
              </motion.div>
            ) : (
              <>
                <SignedIn>
                  <motion.div
                    key={pathname}
                    initial="pageInitial"
                    animate="pageAnimate"
                    exit={{ opacity: 0, y: 10 }}
                    transition={{
                      type: "spring",
                      damping: 20,
                      stiffness: 100,
                      duration: 0.2,
                    }}
                    variants={{
                      pageInitial: {
                        opacity: 0,
                        y: -10,
                      },
                      pageAnimate: {
                        opacity: 1,
                        y: 0,
                      },
                    }}
                  >
                    <Component key={pathname} {...pageProps} />
                  </motion.div>
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            )}
            <div>
              <Toaster />
            </div>
          </div>

          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ClerkProvider>
    </PlausibleProvider>
  );
}

export default MyApp;
