"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditGroup() {
  const router = useRouter();
  const params = useParams();

  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/group/${params.id}`
      );

      const data = await response.json();

      if (data.success) {
        const group = data.group;

        setGroupName(group.group_name);
        setGroupType(group.group_type);
        setDescription(group.description);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateGroup = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/group/update/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            group_name: groupName,
            group_type: groupType,
            description,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Group Updated Successfully");
        router.push("/masters/groups");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white shadow rounded-xl p-8 w-[600px]">

        <h1 className="text-3xl font-bold mb-6">
          Edit Group
        </h1>

        <input
          type="text"
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-3 rounded w-full mb-6"
        />

        <button
          onClick={updateGroup}
          className="bg-green-600 text-white w-full py-3 rounded"
        >
          Update Group
        </button>

      </div>

    </div>
  );
}