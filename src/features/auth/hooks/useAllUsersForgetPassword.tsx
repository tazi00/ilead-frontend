import { useMutation } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
// import { loginService } from "../services/login.service";

import { authService } from "../services/Auth.service";

export function useAllUsersForgetPassword() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: async ({ emailOrPhone }: { emailOrPhone: string }) => {
      return authService.forgetPasswordForAll({ emailOrPhone });
    },
    onSuccess: (data) => {
      console.log(data);

      if (data.status === "SUCCESS") {
        console.log("Reset successful:", data.message);
        // localStorage.setItem("user", JSON.stringify(data.data.user));
        // queryClient.setQueryData(["user"], data);
        setTimeout(() => {
          router.history.push("/reset-password");
        }, 2000); // Simulate a delay for the user experience
        // Redirect to dashboard or another pages
      }
      if (!data.status || data.status !== "SUCCESS") {
        console.log("Login successful:", data.message);
      }
    },
    onError: (error) => {
      console.error("Login failed:", error.name, error.message);
    },
  });

  return {
    login: mutation.mutate,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
    error: mutation.error,
  };
}
