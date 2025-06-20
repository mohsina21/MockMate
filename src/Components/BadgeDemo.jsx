import React from "react";
import { Badge } from "./badge";

const BadgeDemo = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-primary mb-6">Badge Examples</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
    </div>
  );
};

export default BadgeDemo;