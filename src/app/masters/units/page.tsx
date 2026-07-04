"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function UnitsPage() {
  const router = useRouter();

  const [units, setUnits] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUnits();
  }, []);

  const fetchUnits = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `${API_BASE_URL}/api/unit/all/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setUnits(data.units);
    }
  };

  const deleteUnit = async (id: number) => {
    if (!confirm("Delete this Unit?")) return;

    await fetch(
      `${API_BASE_URL}/api/unit/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchUnits();
  };

  const searchUnit = async (value: string) => {
    setSearch(value);

    if (value === "") {
      fetchUnits();
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/unit/search?name=${value}`
    );

    const data = await response.json();

    if (data.success) {
      setUnits(data.units);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">
          Units
        </h1>

        <button
          onClick={() =>
            router.push("/masters/units/create")
          }
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          + Create Unit
        </button>
      </div>

      <input
        className="border p-3 w-full mb-6 rounded"
        placeholder="Search Unit"
        value={search}
        onChange={(e) =>
          searchUnit(e.target.value)
        }
      />

      <div className="grid md:grid-cols-3 gap-5">

        {units.map((unit:any)=>(
          <div
            key={unit.id}
            className="bg-white rounded-xl shadow p-5"
          >

            <h2 className="text-2xl font-bold">
              {unit.unit_name}
            </h2>

            <p className="text-gray-600">
              Symbol : {unit.symbol}
            </p>

            <div className="flex gap-2 mt-5">

              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded"
                onClick={()=>
                  router.push(`/masters/units/edit/${unit.id}`)
                }
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-4 py-2 rounded"
                onClick={()=>deleteUnit(unit.id)}
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