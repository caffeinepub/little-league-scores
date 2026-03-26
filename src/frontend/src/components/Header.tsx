import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { LogIn, LogOut, Menu, Trophy, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import type { Page } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useIsAdmin } from "../hooks/useQueries";

interface HeaderProps {
  page: Page;
  setPage: (p: Page) => void;
}

export default function Header({ page, setPage }: HeaderProps) {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: isAdmin } = useIsAdmin();
  const [menuOpen, setMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
    } else {
      try {
        await login();
      } catch (err: any) {
        if (err?.message === "User is already authenticated") {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const navLinks: { label: string; value: Page }[] = [
    { label: "Scores", value: "scores" },
    { label: "Standings", value: "standings" },
    { label: "Schedule", value: "schedule" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-navy shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Trophy className="text-orange w-6 h-6" />
            <span className="font-display font-bold text-white text-lg tracking-wide uppercase">
              Little League Scores
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.value}
                type="button"
                className={`relative px-4 py-2 text-sm font-semibold transition-colors uppercase tracking-wide ${
                  page === link.value
                    ? "text-white"
                    : "text-white/60 hover:text-white/90"
                }`}
                onClick={() => setPage(link.value)}
                data-ocid={`nav.${link.value}.link`}
              >
                {link.label}
                {page === link.value && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange rounded-full"
                  />
                )}
              </button>
            ))}
            {isAdmin && (
              <span className="ml-3 text-orange text-xs font-bold uppercase tracking-widest px-2 py-0.5 bg-orange/10 rounded">
                Admin
              </span>
            )}
          </nav>

          {/* Auth button */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && (
              <span className="text-white/60 text-xs">
                {isAdmin ? "Admin" : "Logged in"}
              </span>
            )}
            <Button
              onClick={handleAuth}
              disabled={isLoggingIn}
              size="sm"
              className="bg-orange hover:bg-orange/90 text-white border-0 font-semibold"
              data-ocid="auth.button"
            >
              {isLoggingIn ? (
                "Signing in..."
              ) : isAuthenticated ? (
                <>
                  <LogOut className="w-4 h-4 mr-1" /> Logout
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-1" /> Login
                </>
              )}
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden text-white p-1"
            onClick={() => setMenuOpen((v) => !v)}
            data-ocid="nav.toggle"
          >
            {menuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-navy border-t border-white/10"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.value}
                  type="button"
                  className={`text-sm font-semibold text-left px-2 py-2 rounded transition-colors uppercase tracking-wide ${
                    page === link.value
                      ? "text-orange"
                      : "text-white/80 hover:text-white"
                  }`}
                  onClick={() => {
                    setPage(link.value);
                    setMenuOpen(false);
                  }}
                  data-ocid={`mobile.nav.${link.value}.link`}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 border-t border-white/10 mt-1">
                <Button
                  onClick={handleAuth}
                  disabled={isLoggingIn}
                  size="sm"
                  className="bg-orange hover:bg-orange/90 text-white border-0 self-start"
                  data-ocid="mobile.auth.button"
                >
                  {isLoggingIn
                    ? "Signing in..."
                    : isAuthenticated
                      ? "Logout"
                      : "Login"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
