import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginButtons } from "@/components/auth/login-buttons";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getSession } from "@/lib/auth";

const LoginPage = async () => {
  const session = await getSession();

  if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <Card className="w-87.5">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Using your preferred login method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card text-muted-foreground px-2">
                  Or continue with
                </span>
              </div>
            </div>
            <Suspense fallback={<div className="h-9" />}>
              <LoginButtons />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
