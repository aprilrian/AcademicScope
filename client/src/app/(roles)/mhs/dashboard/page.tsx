import React from "react";
import { Separator } from "@/components/ui/separator";

export default function DashboardPage() {
  return (
    <div className="hidden space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview Mahasiswa
        </p>
      </div>
      <Separator className="my-6" />
    </div>
  );
};


