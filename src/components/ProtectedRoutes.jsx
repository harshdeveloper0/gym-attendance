'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

const ProtectedRoute = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/login");
    } else {
      setLoading(false);
    }
  }, [session, status, router]);

  if (loading || status === "loading") {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
