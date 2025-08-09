import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

function FacebookCallback() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [data, setData] = useState<any>(null);
  const BASE_URL = `https://crm-server-tsnj.onrender.com/api`;

  useEffect(() => {
    const connectWithFacebook = async () => {
      const code = searchParams.get("code");
      const state = searchParams.get("state");

      if (!code || !state) {
        setStatus("error");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/facebook/connect`);
        setData(response.data);
        setStatus("success");
      } catch (error) {
        console.error("Facebook connection failed", error);
        setStatus("error");
      }
    };

    connectWithFacebook();
  }, [searchParams]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white bg-[#1a1f36] p-4">
      {status === "pending" && (
        <p className="text-lg">Connecting with Facebook...</p>
      )}
      {status === "success" && (
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">
            ✅ Facebook Connected Successfully!
          </h1>
          <p className="text-gray-300 mb-4">
            Your page and lead forms are now connected.
          </p>
          <div className="bg-[#2b314d] rounded p-4 text-left max-w-md mx-auto">
            {data?.data?.map((item: any, index: number) => (
              <div key={index} className="mb-2">
                <p>
                  <strong>Page:</strong> {item.page}
                </p>
                <p>
                  <strong>Form:</strong> {item.form}
                </p>
                <p>
                  <strong>Leads:</strong> {item.leads}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
      {status === "error" && (
        <div className="text-red-400">
          ❌ Failed to connect with Facebook. Please try again later.
        </div>
      )}
    </div>
  );
}

export default FacebookCallback;
