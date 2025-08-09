import { createFileRoute } from "@tanstack/react-router";
import ForgetPasswordForm from "@/features/auth/components/ForgetPasswordForm";

export const Route = createFileRoute("/_authLayout/forget-password")({
  component: ForgetPasswordPage,
});

function ForgetPasswordPage() {
  return (
    <div className="forget-password-page">
      {" "}
      <ForgetPasswordForm />
    </div>
  );
}
