import { createFileRoute } from "@tanstack/react-router";
import AllUsersLoginForm from "@/features/auth/components/AllUsersLoginForm/AllUsersLoginForm";

export const Route = createFileRoute("/_authLayout/user-login")({
  component: AllUsersLoginPage,
});

function AllUsersLoginPage() {
  return (
    <div className="login-page">
      <AllUsersLoginForm />
    </div>
  );
}
