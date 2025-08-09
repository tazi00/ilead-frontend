import { useEffect, useState } from "react";
import { FaFacebookF } from "react-icons/fa";
import { labelService } from "@/features/leads/services/Lable.service";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Label } from "@/features/leads/types";
import { facebookIntegrationService } from "../../services/FacebookIntegration.service";
import Swal from "sweetalert2";

function FacebookIntegration() {
  const [selectedLabel, setSelectedLabel] = useState("");
  const [labels, setLabels] = useState<Label[]>([]);

  const handleLogin = async () => {
    try {
      const loginUrl = await facebookIntegrationService.getFacebookAuthUrl();

      const popup = window.open(loginUrl, "_blank", "width=600,height=700");

      const pollTimer = window.setInterval(() => {
        try {
          const success = popup?.localStorage.getItem("fb_integration_success");

          if (success) {
            window.clearInterval(pollTimer);
            popup?.close();
            Swal.fire("Success", "Facebook connected!", "success");
          }
        } catch (e) {
          // Swallow cross-origin frame access errors
        }
      }, 1000);
    } catch (error) {
      console.error("Failed to initiate Facebook login:", error);
      Swal.fire("Error", "Failed to connect to Facebook", "error");
    }
  };

  const handleSave = async () => {
    try {
      const response =
        await facebookIntegrationService.connectWithFacebookPage();

      // Optional: You can show response data in alert or log it
      console.log("Facebook page connection response:", response);

      Swal.fire("Success", "Facebook page connected successfully!", "success");
    } catch (error) {
      console.error("Failed to connect Facebook page:", error);
      Swal.fire("Error", "Failed to connect Facebook page", "error");
    }
  };

  useEffect(() => {
    const fetchLabels = async () => {
      try {
        const response = await labelService.labels();
        setLabels(response.data.data);
      } catch (error) {
        console.error("Error fetching labels:", error);
      }
    };

    fetchLabels();
  }, []);

  return (
    <div className="leads-sec mt-7">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-lg font-semibold">FaceBook Lead Integration</h2>
          <p className="text-sm text-gray-300">Login With FaceBook</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        <Button
          onClick={handleLogin}
          className="text-white w-full md:w-[320px]"
        >
          <FaFacebookF className="mr-2" /> Connect To Facebook
        </Button>

        <div className="flex flex-col w-full md:w-[320px]">
          <Select value={selectedLabel} onValueChange={setSelectedLabel}>
            <SelectTrigger className="w-full bg-[#2f3658] text-white border border-[#444c6b]">
              <SelectValue placeholder="Select label" />
            </SelectTrigger>
            <SelectContent>
              {labels.map((label) => (
                <SelectItem key={label._id} value={label._id}>
                  {label.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSave} className="text-white w-[80px]">
          Save
        </Button>
      </div>
    </div>
  );
}

export default FacebookIntegration;
