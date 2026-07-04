"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function SalesVoucherPage() {

  const router = useRouter();

  const [vouchers, setVouchers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSalesVouchers();
  }, []);

  const fetchSalesVouchers = async () => {

    const companyId = localStorage.getItem("companyId");

    const response = await fetch(
      `${API_BASE_URL}/api/voucher/sales/all/${companyId}`
    );

    const data = await response.json();

    if (data.success) {
      setVouchers(data.vouchers);
    }

  };

  const deleteVoucher = async (id: number) => {

    if (!confirm("Delete Sales Voucher?")) return;

    await fetch(
      `${API_BASE_URL}/api/voucher/sales/delete/${id}`,
      {
        method: "DELETE",
      }
    );

    fetchSalesVouchers();

  };

  const searchVoucher = async (value: string) => {

    setSearch(value);

    if (value === "") {
      fetchSalesVouchers();
      return;
    }

    const response = await fetch(
      `${API_BASE_URL}/api/voucher/search?type=${value}`
    );

    const data = await response.json();

    if (data.success) {

      const sales = data.vouchers.filter(
        (v: any) => v.voucher_type === "Sales"
      );

      setVouchers(sales);

    }

  };

  return (

    <div className="p-8 bg-gray-100 min-h-screen">

      <div className="flex justify-between mb-6">

        <h1 className="text-3xl font-bold">
          Sales Vouchers
        </h1>

        <button
  onClick={() => router.push("/voucher/sales/create")}
  className="bg-blue-600 text-white px-5 py-2 rounded"
>
  + Create Sales Voucher
</button>
      </div>

      <input
        className="border p-3 w-full mb-6 rounded"
        placeholder="Search Sales Voucher"
        value={search}
        onChange={(e) =>
          searchVoucher(e.target.value)
        }
      />

      <div className="overflow-x-auto">

        <table className="w-full bg-white shadow rounded">

          <thead className="bg-gray-200">

            <tr>

              <th className="p-3">Voucher No</th>

              <th className="p-3">Date</th>

              <th className="p-3">Reference</th>

              <th className="p-3">Narration</th>

              <th className="p-3">Total</th>

              <th className="p-3">Actions</th>

            </tr>

          </thead>

          <tbody>

            {vouchers.map((voucher: any) => (

              <tr
                key={voucher.id}
                className="border-b text-center"
              >

                <td className="p-3">
                  {voucher.voucher_no}
                </td>

                <td className="p-3">
                  {voucher.voucher_date?.substring(0,10)}
                </td>

                <td className="p-3">
                  {voucher.reference_no}
                </td>

                <td className="p-3">
                  {voucher.narration}
                </td>

                <td className="p-3">
                  ₹ {voucher.total_amount}
                </td>

                <td className="p-3">

                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                    onClick={() =>
                      router.push(
                        `/vouchers/sales/edit/${voucher.id}`
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() =>
                      deleteVoucher(voucher.id)
                    }
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}