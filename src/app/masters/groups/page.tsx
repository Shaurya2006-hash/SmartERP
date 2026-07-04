"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function GroupsPage() {
  const router = useRouter();

  const [groups, setGroups] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `${API_BASE_URL}/api/group/all/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setGroups(data.groups);
    }
  };

  const deleteGroup = async (id: number) => {
    if (!confirm("Delete Group?")) return;

    await fetch(
      `${API_BASE_URL}/api/group/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchGroups();
  };

  const searchGroup = async (value: string) => {
    setSearch(value);

    if (value === "") {
      fetchGroups();
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/group/search?name=${value}`
    );

    const data = await response.json();

    if (data.success) {
      setGroups(data.groups);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Groups
        </h1>

        <button
          onClick={() =>
            router.push("/masters/groups/create")
          }
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          + Create Group
        </button>
      </div>

      <input
        className="border p-3 w-full mb-6 rounded"
        placeholder="Search Group"
        value={search}
        onChange={(e) =>
          searchGroup(e.target.value)
        }
      />

      <div className="grid md:grid-cols-3 gap-5">
        {groups.map((group: any) => (
          <div
            key={group.id}
            className="bg-white rounded-xl shadow p-5"
          >
            <h2 className="font-bold text-xl">
              {group.group_name}
            </h2>

            <p>{group.group_type}</p>

            <p>{group.description}</p>

            <div className="flex gap-2 mt-4">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={() =>
                  router.push(
                    `/masters/groups/edit/${group.id}`
                  )
                }
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={() =>
                  deleteGroup(group.id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}