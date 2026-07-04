"use client";

import {
  useEffect,
  useState
} from "react";

import {
  useRouter,
  useParams
} from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function EditStockGroup() {

  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchGroup();
  }, []);

  const fetchGroup = async () => {

    const response = await fetch(
      `${API_BASE_URL}/api/stock-group/${id}`
    );

    const data = await response.json();

    if (data.success) {
      setGroupName(data.stockGroup.group_name);
      setDescription(data.stockGroup.description);
    }
  };

  const updateGroup = async () => {

    const response = await fetch(
      `${API_BASE_URL}/api/stock-group/update/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          group_name: groupName,
          description,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Stock Group Updated");
      router.push("/masters/stock-groups");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white w-[600px] p-8 rounded-xl shadow">

        <h1 className="text-3xl font-bold mb-6">
          Edit Stock Group
        </h1>

        <input
          className="border p-3 w-full mb-4"
          value={groupName}
          onChange={(e) =>
            setGroupName(e.target.value)
          }
        />

        <textarea
          className="border p-3 w-full mb-6"
          rows={4}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <button
          onClick={updateGroup}
          className="bg-green-600 text-white w-full py-3 rounded"
        >
          Update Stock Group
        </button>

      </div>

    </div>
  );
}