import { useForm } from "@tanstack/react-form";

import type { AnyFieldApi } from "@tanstack/react-form";
import { useAllUsersLogin } from "../../hooks/useAllUsersLogin";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.join(",")}</em>
      ) : null}
      {field.state.meta.isValidating ? "Validating..." : null}
    </>
  );
}

function AllUsersLoginForm() {
  const { login, isLoading, data, error } = useAllUsersLogin();
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      console.log("Form submitted with values:", value);
      await login({ email: value.email, password: value.password });
      form.reset();
    },
  });

  console.log(error);
  return (
    <div className="login_form w-[450px] max-w-full lg:w-full mx-auto">
      <h3 className="heading mt-3 mb-6">Welcome to ETC CRM! 👋</h3>
      {isLoading && <p>Loading...</p>}
      {!data?.status ? (
        <p className="error">{data?.message}</p>
      ) : (
        <p className="error">{data?.message}</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <div className="mb-4">
          <form.Field
            name="email"
            children={(field) => (
              <>
                <Label htmlFor={field.name} className="mb-2">
                  Email OR Mobile: <span>*</span>
                </Label>
                <Input
                  type="email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  placeholder="Email OR Mobile"
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <div>
          <form.Field
            name="password"
            children={(field) => (
              <>
                <Label htmlFor={field.name} className="mb-2">
                  Password: <span>*</span>
                </Label>
                <Input
                  type="password"
                  id={field.name}
                  name={field.name}
                  placeholder="******"
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                />
                <FieldInfo field={field} />
              </>
            )}
          />
        </div>
        <Link
          to="/forget-password"
          className={`justify-end w-full my-1 ${buttonVariants({ variant: "link", size: "sm" })}`}
        >
          Forgot Password?
        </Link>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <div>
              <Button type="submit" disabled={!canSubmit} className="w-full">
                {isSubmitting ? "..." : "Sign In"}
              </Button>
              <h3 className="small-primary text-sm text-center my-5">
                New on our platform?{" "}
                <Link to="/register" className="font-semibold">
                  Create an account
                </Link>
              </h3>
              <Button type="submit" disabled={!canSubmit} className="w-full">
                {isSubmitting ? "..." : "Join Our Channel"}
              </Button>
              {/* <h3 className="small-primary text-sm text-center my-5">
                Product by
              </h3>
              <img className="mx-auto" src={productByImg} alt="" /> */}
            </div>
          )}
        />
      </form>
    </div>
  );
}

export default AllUsersLoginForm;
