import { useState } from "react";
import { useAllUsersResetPassword } from "../../hooks/useAllUsersResetPassword";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ResetPasswordForm() {
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { login, isLoading, isError, isSuccess, data, error } =
    useAllUsersResetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otp.trim() || !newPassword.trim()) {
      alert("Both fields are required.");
      return;
    }

    if (!/^\d{8}$/.test(otp)) {
      alert("OTP must be an 8-digit number.");
      return;
    }

    login({ otp, newPassword });
    setHasSubmitted(true);
  };

  return (
    <div className="login_form w-[450px] max-w-full lg:w-full mx-auto">
      <h3 className="text-2xl font-semibold text-center mb-6">
        Reset Your Password
      </h3>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="otp">8-digit OTP</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            maxLength={8}
            inputMode="numeric"
            pattern="\d{8}"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            type="password"
            placeholder="Enter your new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {hasSubmitted && isError && error && (
        <Alert variant="destructive" className="mt-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {hasSubmitted && isSuccess && data && (
        <Alert variant="default" className="mt-4">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ResetPasswordForm;
