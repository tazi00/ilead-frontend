import { useForm } from "@tanstack/react-form";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import { labelService } from "@/features/leads/services/Lable.service";

function CreateLabelForm() {
  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
    },
    onSubmit: async ({ value }) => {
      try {
        await labelService.createLabel(value);
        Swal.fire("Success", "Label created successfully!", "success");
        form.reset(); // Reset form after success
      } catch (error) {
        Swal.fire(
          "Error",
          "Failed to create label. Please try again.",
          "error"
        );
      }
    },
  });

  return (
    <Card className="max-w-2xl mx-auto mt-10 p-6 bg-background/60 dark:bg-muted/40 border border-border shadow-lg rounded-2xl backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-6">Create a New Label</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        {form.Field({
          name: "title",
          validators: {
            onChange: ({ value }) =>
              !value
                ? "Title is required"
                : value.length < 3
                  ? "Min 3 characters"
                  : undefined,
          },
          children: (field) => (
            <div className="space-y-1">
              <label className="text-sm font-medium">Title</label>
              <Input
                className="bg-muted text-foreground ring-1 ring-border focus-visible:ring-2"
                type="text"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter label title"
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-xs text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          ),
        })}

        {form.Field({
          name: "description",
          validators: {
            onChange: ({ value }) =>
              !value
                ? "Description is required"
                : value.length < 5
                  ? "Min 5 characters"
                  : undefined,
          },
          children: (field) => (
            <div className="space-y-1">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                className="bg-muted text-foreground ring-1 ring-border focus-visible:ring-2"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter label description"
              />
              {field.state.meta.errors?.[0] && (
                <p className="text-xs text-red-500">
                  {field.state.meta.errors[0]}
                </p>
              )}
            </div>
          ),
        })}

        <Button
          type="submit"
          disabled={form.state.isSubmitting}
          className="w-full mt-4"
        >
          {form.state.isSubmitting ? "Creating..." : "Create Label"}
        </Button>
      </form>
    </Card>
  );
}

export default CreateLabelForm;
