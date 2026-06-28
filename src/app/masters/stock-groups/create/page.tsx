"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStockGroup() {

  const router = useRouter();

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  const createGroup = async () => {

    const companyId =
      localStorage.getItem("companyId");

    const response = await fetch(
      "http://localhost:5000/api/stock-group/create",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          company_id: companyId,
          group_name: groupName,
          description,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Stock Group Created");
      router.push("/masters/stock-groups");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white w-[600px] p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Create Stock Group
        </h1>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Stock Group Name"
          value={groupName}
          onChange={(e) =>
            setGroupName(e.target.value)
          }
        />

        <textarea
          className="border p-3 w-full mb-6"
          placeholder="Description"
          rows={4}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          onClick={createGroup}
          className="bg-blue-600 text-white w-full py-3 rounded"
        >
          Create Stock Group
        </button>

      </div>

    </div>
  );
}