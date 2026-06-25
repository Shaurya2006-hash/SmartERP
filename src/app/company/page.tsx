"use client";

import { useRouter } from "next/navigation";

export default function CompanyPage() {
  const router = useRouter();

  const companies = [
    {
      id: 1,
      company_name: "ABC Traders",
      state: "Maharashtra",
    },
    {
      id: 2,
      company_name: "XYZ Pvt Ltd",
      state: "Delhi",
    },
    {
      id: 3,
      company_name: "Demo Company",
      state: "Gujarat",
    },
  ];

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

      {/* Companies Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white p-6 rounded-xl shadow hover:shadow-lg cursor-pointer"
            onClick={() => selectCompany(company)}
          >
            <h2 className="text-xl font-semibold mb-2">
              {company.company_name}
            </h2>

            <p className="text-gray-600">
              State: {company.state}
            </p>

            <button className="mt-4 bg-green-600 text-white px-4 py-2 rounded">
              Select Company
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}