"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateStockItem() {
  const router = useRouter();

  const [groups, setGroups] = useState<any[]>([]);
  const [units, setUnits] = useState<any[]>([]);

  const [itemName, setItemName] = useState("");
  const [sku, setSku] = useState("");
  const [groupId, setGroupId] = useState("");
  const [unitId, setUnitId] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [gstPercentage, setGstPercentage] = useState("");

  useEffect(() => {
    fetchGroups();
    fetchUnits();
  }, []);

  const fetchGroups = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `http://localhost:5000/api/stock-group/all/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setGroups(data.stockGroups);
    }
  };

  const fetchUnits = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `http://localhost:5000/api/unit/all/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setUnits(data.units);
    }
  };

  const createItem = async () => {
    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      "http://localhost:5000/api/stock-item/create",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          company_id: companyId,
          group_id: groupId,
          unit_id: unitId,
          item_name: itemName,
          sku,
          purchase_price: purchasePrice,
          selling_price: sellingPrice,
          quantity,
          gst_percentage: gstPercentage,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Stock Item Created Successfully");
      router.push("/masters/stock-items");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white w-[700px] rounded-xl shadow p-8">

        <h1 className="text-3xl font-bold mb-6">
          Create Stock Item
        </h1>

        <input
          className="border p-3 w-full mb-4"
          placeholder="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
        />

        <input
          className="border p-3 w-full mb-4"
          placeholder="SKU"
          value={sku}
          onChange={(e) => setSku(e.target.value)}
        />

        <select
          className="border p-3 w-full mb-4"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
        >
          <option value="">Select Stock Group</option>

          {groups.map((group: any) => (
            <option key={group.id} value={group.id}>
              {group.group_name}
            </option>
          ))}
        </select>

        <select
          className="border p-3 w-full mb-4"
          value={unitId}
          onChange={(e) => setUnitId(e.target.value)}
        >
          <option value="">Select Unit</option>

          {units.map((unit: any) => (
            <option key={unit.id} value={unit.id}>
              {unit.unit_name}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-3 w-full mb-4"
          placeholder="Purchase Price"
          value={purchasePrice}
          onChange={(e) =>
            setPurchasePrice(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-3 w-full mb-4"
          placeholder="Selling Price"
          value={sellingPrice}
          onChange={(e) =>
            setSellingPrice(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-3 w-full mb-4"
          placeholder="Opening Quantity"
          value={quantity}
          onChange={(e) =>
            setQuantity(e.target.value)
          }
        />

        <input
          type="number"
          className="border p-3 w-full mb-6"
          placeholder="GST Percentage"
          value={gstPercentage}
          onChange={(e) =>
            setGstPercentage(e.target.value)
          }
        />

        <button
          onClick={createItem}
          className="bg-blue-600 text-white w-full py-3 rounded"
        >
          Create Stock Item
        </button>

      </div>

    </div>
  );
}