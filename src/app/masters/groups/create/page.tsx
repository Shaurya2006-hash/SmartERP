"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateGroup() {
  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("Assets");
  const [description, setDescription] = useState("");

  const createGroup = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const response = await fetch(
        "http://localhost:5000/api/group/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_id: companyId,
            group_name: groupName,
            group_type: groupType,
            description,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Group Created Successfully");
        router.push("/masters/groups");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow rounded-xl p-8 w-[600px]">

        <h1 className="text-3xl font-bold mb-6">
          Create Group
        </h1>

        <input
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        />

        <select
          value={groupType}
          onChange={(e) => setGroupType(e.target.value)}
          className="border p-3 rounded w-full mb-4"
        >
          <option>Assets</option>
          <option>Liabilities</option>
          <option>Income</option>
          <option>Expenses</option>
        </select>

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 rounded w-full mb-6"
        />

        <button
          onClick={createGroup}
          className="bg-blue-600 text-white w-full py-3 rounded"
        >
          Create Group
        </button>

      </div>
    </div>
  );
}