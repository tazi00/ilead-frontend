import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import clsx from "clsx";
import { userService } from "@/features/leads/services/User.service";

export default function UserProfileDetailsCard() {
  const [user, setUser] = useState<
    | null
    | Awaited<ReturnType<typeof userService.getUserDetails>>["data"]["data"]
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await userService.getUserDetails();
        setUser(res.data.data);
      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Failed to load user details.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getBooleanTag = (
    value: boolean,
    trueColor: string,
    falseColor: string,
    label: string
  ) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-700 dark:text-gray-300">{label}:</span>
      <span
        className={clsx(
          "text-xs font-semibold px-2.5 py-0.5 rounded-full",
          value ? trueColor : falseColor
        )}
      >
        {value ? "Yes" : "No"}
      </span>
    </div>
  );

  if (loading)
    return (
      <div className="p-4 text-gray-700 dark:text-gray-200">
        Loading user details...
      </div>
    );

  if (error)
    return <div className="p-4 text-red-500 dark:text-red-400">{error}</div>;

  if (!user) return null;

  return (
    <Card className="max-w-3xl mx-auto mt-6 bg-white text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-bold">User Profile</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Name:</strong>{" "}
          {user.name}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Email:</strong>{" "}
          {user.email}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Phone:</strong>{" "}
          {user.phone_number}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">Role:</strong>{" "}
          {user.role?.name}
        </div>
        <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Role Description:
          </strong>{" "}
          {user.role?.description || "N/A"}
        </div>

        {getBooleanTag(
          user.is_verified,
          "bg-green-100 text-green-800",
          "bg-gray-200 text-gray-700",
          "Verified"
        )}
        {getBooleanTag(
          user.is_banned,
          "bg-red-100 text-red-700",
          "bg-gray-200 text-gray-700",
          "Banned"
        )}
        {getBooleanTag(
          user.reported,
          "bg-yellow-100 text-yellow-800",
          "bg-gray-200 text-gray-700",
          "Reported"
        )}

        <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Profile Created At:
          </strong>{" "}
          {new Date(user.createdAt).toLocaleString()}
        </div>
        {/* <div>
          <strong className="text-gray-700 dark:text-gray-300">
            Updated At:
          </strong>{" "}
          {new Date(user.updatedAt).toLocaleString()}
        </div> */}

        {user.role?.permissions?.length > 0 && (
          <div>
            <strong className="text-gray-700 dark:text-gray-300">
              Permissions Granted:
            </strong>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              {user.role.permissions.map((perm: any) => (
                <li key={perm._id}>
                  <span className="font-medium">{perm.name}</span>:{" "}
                  <span className="text-gray-600 dark:text-gray-400">
                    {perm.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
