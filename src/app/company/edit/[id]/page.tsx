"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { API_BASE_URL } from "@/app/config/api";
export default function EditCompanyPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [companyName, setCompanyName] = useState("");
  const [address, setAddress] = useState("");
  const [gst, setGst] = useState("");
  const [state, setState] = useState("");
  const [financialYear, setFinancialYear] = useState("");

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/company/${id}`
      );

      const data = await response.json();

      if (data.success) {
        const company = data.company;

        setCompanyName(company.company_name);
        setAddress(company.address);
        setGst(company.gst_number);
        setState(company.state);
        setFinancialYear(company.financial_year);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/company/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            company_name: companyName,
            address,
            gst_number: gst,
            state,
            financial_year: financialYear,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Company Updated Successfully");
        router.push("/company");
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
      alert("Error updating company");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow w-[600px]">

        <h1 className="text-3xl font-bold mb-6">
          Edit Company
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
          className="border p-3 w-full mb-6"
          value={financialYear}
          onChange={(e) => setFinancialYear(e.target.value)}
        />

        <button
          onClick={handleUpdate}
          className="bg-green-600 text-white p-3 w-full rounded-lg"
        >
          Update Company
        </button>

      </div>

    </div>
  );
}