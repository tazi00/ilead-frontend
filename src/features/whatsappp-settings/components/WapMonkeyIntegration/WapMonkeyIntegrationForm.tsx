import { useForm } from "@tanstack/react-form";

import { Trash2, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/features/auth/hooks/useUser";

import { useCreateWapmonkey } from "../../hooks/useCreateWapmonkey";
import { useEffect } from "react";

function WapMonkeyIntegration() {
  const { data: user } = useUser();
  const { saveApiKey, isSaving } = useCreateWapmonkey();

  const existingKey =
    user?.property?.meta?.wapmonkey_api_key ||
    user?.property?.meta?.get?.("wapmonkey_api_key") ||
    "";
  const form = useForm({
    defaultValues: {
      wapmonkey_key: "",
    },

    onSubmit: async ({ value }) => {
      saveApiKey(
        { wapmonkey_key: value.wapmonkey_key },
        {
          onSuccess: () => console.log("API key saved"),
        }
      );
    },
  });

  useEffect(() => {
    if (existingKey) {
      form.setFieldValue("wapmonkey_key", existingKey);
    }
  }, [existingKey]);

  const handleDelete = () => {
    form.setFieldValue("wapmonkey_key", "");
  };

  const handleRefreshCredit = () => {
    console.log("Refreshing credit...");
  };

  return (
    <div className="bg-primary p-5 rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        WhatsApp Integration
      </h2>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="flex items-center gap-3"
      >
        <form.Field
          name="wapmonkey_key"
          children={(field) => (
            <input
              type="text"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              placeholder="Enter WhatsApp API Key"
              className="flex-1 bg-primary border border-gray-700 text-white px-4 py-2 rounded-lg focus:ring focus:ring-indigo-400 focus:border-indigo-400 outline-none"
            />
          )}
        />

        {/* DELETE BUTTON */}
        <Button
          type="button"
          onClick={handleDelete}
          variant={"destructive"}
          size={"icon"}
        >
          <Trash2 size={18} />
        </Button>

        <Button type="submit" disabled={isSaving} variant="default" size="icon">
          <Save size={18} />
        </Button>

        <Button
          type="button"
          onClick={handleRefreshCredit}
          variant={"outline"}
          size={"icon"}
        >
          <RotateCcw size={18} />
        </Button>
      </form>

      {/* CREDIT DISPLAY */}
      <div className="mt-3 text-gray-300">
        <span className="text-sm">Credit</span>
        <div className="text-lg font-semibold">3,797</div>
      </div>
    </div>
  );
}

export default WapMonkeyIntegration;
