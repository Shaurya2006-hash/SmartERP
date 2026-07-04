"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function StockItemsPage() {
  const router = useRouter();

  const [items, setItems] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const companyId = localStorage.getItem("companyId");

      const response = await fetch(
        `${API_BASE_URL}/api/stock-item/all/${companyId}`
      );

      const data = await response.json();

     if (data.success) {
  setItems(data.stockItems || []);
}
    } catch (error) {
      console.log(error);
    }
  };

  const deleteItem = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this Stock Item?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `${API_BASE_URL}/api/stock-item/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      fetchItems();
    } catch (error) {
      console.log(error);
    }
  };

  const searchItem = async (value: string) => {
    setSearch(value);

    if (value === "") {
      fetchItems();
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stock-item/search?name=${value}`
      );

      const data = await response.json();

if (data.success) {
  setItems(data.stockItems || []);
}
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Stock Items
        </h1>

        <button
          onClick={() =>
            router.push("/masters/stock-items/create")
          }
          className="bg-blue-600 text-white px-5 py-2 rounded"
        >
          + Create Stock Item
        </button>

      </div>

      <input
        type="text"
        placeholder="Search Stock Item"
        value={search}
        onChange={(e) => searchItem(e.target.value)}
        className="border w-full p-3 rounded mb-6"
      />

      <div className="grid md:grid-cols-3 gap-6">

        {items.map((item: any) => (

          <div
            key={item.id}
            className="bg-white rounded-xl shadow p-5"
          >

            <h2 className="text-xl font-bold">
              {item.item_name}
            </h2>

            <p className="mt-2">
              SKU :
              <span className="font-semibold ml-2">
                {item.sku}
              </span>
            </p>

            <p>
              Group :
              <span className="font-semibold ml-2">
                {item.group_name}
              </span>
            </p>

            <p>
              Unit :
              <span className="font-semibold ml-2">
                {item.unit_name}
              </span>
            </p>

            <p>
              Purchase :
              <span className="font-semibold ml-2">
                ₹ {item.purchase_price}
              </span>
            </p>

            <p>
              Selling :
              <span className="font-semibold ml-2">
                ₹ {item.selling_price}
              </span>
            </p>

            <p>
              Qty :
              <span className="font-semibold ml-2">
                {item.quantity}
              </span>
            </p>

            <p>
              GST :
              <span className="font-semibold ml-2">
                {item.gst_percentage} %
              </span>
            </p>

            <div className="flex gap-3 mt-5">

              <button
                onClick={() =>
                  router.push(
                    `/masters/stock-items/edit/${item.id}`
                  )
                }
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => deleteItem(item.id)}
                className="bg-red-600 text-white px-4 py-2 rounded"
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