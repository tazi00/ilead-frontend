import { createFileRoute } from "@tanstack/react-router";

import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";
export const Route = createFileRoute("/_authLayout/reset-password")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  return (
    <div className="reset-password-page">
      {" "}
      <ResetPasswordForm />
    </div>
  );
}
