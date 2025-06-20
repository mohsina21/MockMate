import React, { useState } from "react";
import { Select, SelectGroup, SelectValue } from "./select";

const SelectDemo = () => {
  const [role, setRole] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="bg-card p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary mb-4">Select Your Role</h2>
        <Select value={role} onValueChange={setRole}>
          <SelectGroup>
            <SelectValue placeholder="Choose a role..." />
            <option value="frontend">Frontend Developer</option>
            <option value="backend">Backend Developer</option>
            <option value="fullstack">Fullstack Developer</option>
            <option value="designer">UI/UX Designer</option>
          </SelectGroup>
        </Select>
        {role && (
          <div className="mt-6 text-lg text-foreground">
            You selected: <span className="font-semibold text-primary">{role}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectDemo;