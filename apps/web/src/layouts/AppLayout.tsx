import UserButton from "@/components/UserButton";
import ZendoLogo from "@/components/ZendoLogo";
import Link from "next/link";
import { motion } from "framer-motion";
import Notifications from "@/components/Notifications";
import Feedback from "@/components/Feedback";
import Footer from "@/components/Footer";
import { useIsSubscribed } from "@/queries/subscription";
import AppChecks from "@/components/LoggedInUserChecks";
import { Loader } from "lucide-react";
import { HiOutlineInformationCircle } from "react-icons/hi";
import { useUser } from "@/utils/supabase/browser";
import { useRouter } from "next/router";
import { useEffect } from "react";

type Props = {
  children?: React.ReactNode;
  loading?: boolean;
};
export default function AppLayout({ children, loading = false }: Props) {
  const isSubscribed = useIsSubscribed();
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user && !loading) {
      console.log("User not found. Redirecting to sign-in page.");
      router.push("/sign-in");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  return (
    <div className={`flex min-h-screen flex-col border-b bg-zinc-50 font-sans`}>
      <AppChecks>
        <nav className="sticky top-0 z-20 mx-auto w-full max-w-5xl border-b bg-zinc-50">
          <div className="mx-auto flex h-full items-center justify-between px-4">
            <div className="z-20  flex h-full items-center gap-2">
              <Link
                tabIndex={-1}
                href="/blogs"
                className="rounded-md px-1 py-4 text-lg font-medium"
              >
                <ZendoLogo hideText />
              </Link>
            </div>

            <a
              className="
              sr-only px-4
              py-2 text-sm font-medium text-orange-600 hover:text-orange-700 focus:not-sr-only
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-200 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-50
            "
              href="#main"
            >
              Skip to content
            </a>

            <div className="flex items-center gap-1">
              <Feedback />
              <Link
                className="rounded-full px-3 py-4 text-sm font-medium text-slate-600 hover:text-orange-600"
                href="/docs/getting-started"
              >
                Docs
              </Link>
              <Notifications />
              <span className="ml-2">
                <UserButton />
              </span>
            </div>
          </div>
        </nav>
        {!isSubscribed && (
          <div className="sticky top-[58px] z-30 flex items-center justify-center">
            <Link
              href="/account"
              className="
              mx-auto flex max-w-5xl items-center rounded-b-2xl border-x border-b-2 border-yellow-400 bg-yellow-100
              p-1.5 px-4 text-center font-medium text-yellow-600"
            >
              <HiOutlineInformationCircle
                className="mr-1 text-yellow-600"
                size={20}
              />
              You don&apos;t have an active subscription. Please{" "}
              <span className="ml-1.5 underline"> subscribe to a plan</span>.
            </Link>
          </div>
        )}
        {loading ? (
          <div className="flex h-[600px] items-center justify-center">
            <Loader className="animate-spin text-orange-500" size={32} />
          </div>
        ) : (
          <motion.main
            id="main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-zinc-50 pb-24"
          >
            {children}
          </motion.main>
        )}
        <Footer />
      </AppChecks>
    </div>
  );
}
