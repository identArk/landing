import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Plausible } from "@/components/Plausible";

export function SignupPage() {
  useEffect(() => {
    window.location.href = "/signup.html";
  }, []);

  return (
    <>
      <Helmet>
        <title>Sign up — IdentArk</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Plausible />
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--fg-2)" }}>
        Redirecting…
      </div>
    </>
  );
}
