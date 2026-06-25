"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function CompanyPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<any[]>([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/company/all"
      );

      const data = await response.json();

      if (data.success) {
        setCompanies(data.companies);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const selectCompany = (company: any) => {
    localStorage.setItem(
      "companyId",
      company.id.toString()
    );

    localStorage.setItem(
      "companyName",
      company.company_name
    );

    router.push("/dashboard");
  };

  const deleteCompany = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this company?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/company/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (data.success) {
        alert("Company Deleted Successfully");
        fetchCompanies();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Select Company
        </h1>

        <button
          onClick={() => router.push("/company/create")}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg"
        >
          + Create Company
        </button>
      </div>

      {/* Companies */}
      <div className="grid md:grid-cols-3 gap-6">
        {companies.map((company: any) => (
          <div
            key={company.id}
            className="bg-white p-6 rounded-xl shadow"
          >
            <h2 className="text-xl font-semibold mb-2">
              {company.company_name}
            </h2>

            <p className="text-gray-600 mb-2">
              State: {company.state}
            </p>

            <p className="text-gray-600 mb-4">
              GST: {company.gst_number}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => selectCompany(company)}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Select
              </button>

              <button
                onClick={() =>
                  router.push(
                    `/company/edit/${company.id}`
                  )
                }
                className="bg-yellow-500 text-white px-4 py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={() =>
                  deleteCompany(company.id)
                }
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