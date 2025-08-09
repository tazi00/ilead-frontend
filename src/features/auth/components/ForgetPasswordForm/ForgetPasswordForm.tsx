import { useState } from "react";
import { useAllUsersForgetPassword } from "../../hooks/useAllUsersForgetPassword";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function ForgetPasswordForm() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const { login, isLoading, isError, isSuccess, data, error } =
    useAllUsersForgetPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!emailOrPhone.trim()) {
      alert("Please provide a valid email or phone number.");
      return;
    }

    login({ emailOrPhone });
    setHasSubmitted(true);
  };

  return (
    <div className="login_form w-[450px] max-w-full lg:w-full mx-auto">
      <h3 className="heading mt-3 mb-6">
        Forgot your password?
        <br />
      </h3>
      <h3 className="heading mt-3 mb-6">
        Enter your email or phone number to reset it
      </h3>
      {isLoading && <p>Loading...</p>}
      {!data?.status ? (
        <p className="error">{data?.message}</p>
      ) : (
        <p className="error">{data?.message}</p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="emailOrPhone">Email or Phone</Label>
          <Input
            id="emailOrPhone"
            type="text"
            placeholder="Enter your email or phone"
            value={emailOrPhone}
            onChange={(e) => setEmailOrPhone(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : "Submit"}
        </Button>
      </form>

      {hasSubmitted && isError && error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {hasSubmitted && isSuccess && data && (
        <Alert variant="default">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{data.message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

export default ForgetPasswordForm;
