import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
  ArrowDownUp,
  ChartColumnBig,
  CloudUpload,
  List,
  Plus,
  Settings,
} from "lucide-react";

export const Route = createFileRoute("/_dashboardLayout/lead")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="leads-sec mt-7">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="views">
                <ul className="flex items-center">
                  <li>
                    <button>
                      <List />
                    </button>
                  </li>
                  <li>
                    <button>
                      <ChartColumnBig />
                    </button>
                  </li>
                </ul>
              </div>{" "}
              <CardTitle className="text-2xl">Leads</CardTitle>
            </div>
            <div>
              <ul className="flex items-center gap-3">
                <li>
                  <Button size={"icon"}>
                    <Plus />
                  </Button>
                </li>
                <li>
                  <Button size={"icon"}>
                    <CloudUpload />
                  </Button>
                </li>
                <li>
                  <Button size={"icon"}>
                    <Settings />
                  </Button>
                </li>
                <li>
                  <Button size={"icon"}>
                    <ArrowDownUp />
                  </Button>
                </li>
              </ul>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form action=""></form>
        </CardContent>
      </Card>
      <Outlet />
    </section>
  );
}
