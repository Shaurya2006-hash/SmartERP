"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";

export default function CreateCompanyPage() {
  const router = useRouter();

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [state, setState] = useState("");
  const [financialYear, setFinancialYear] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await fetch(
  `${API_BASE_URL}/api/company/create`,
  {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: companyName,
            address,
            gst_number: gst,
            financial_year: financialYear,
            state,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Company Created Successfully");
        router.push("/company");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error creating company");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[600px]">
        <h1 className="text-3xl font-bold mb-6">
          Create Company
        </h1>

        <input
          type="text"
          placeholder="Company Name"
          className="border p-3 w-full mb-4"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="border p-3 w-full mb-4"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <input
          type="text"
          placeholder="GST Number"
          className="border p-3 w-full mb-4"
          value={gst}
          onChange={(e) => setGst(e.target.value)}
        />

        <input
          type="text"
          placeholder="State"
          className="border p-3 w-full mb-4"
          value={state}
          onChange={(e) => setState(e.target.value)}
        />

        <input
          type="text"
          placeholder="Financial Year"
          className="border p-3 w-full mb-4"
          value={financialYear}
          onChange={(e) =>
            setFinancialYear(e.target.value)
          }
        />

        <button
          onClick={handleSubmit}
          className="bg-blue-600 text-white p-3 w-full rounded-lg"
        >
          Create Company
        </button>
      </div>
    </div>
  );
}