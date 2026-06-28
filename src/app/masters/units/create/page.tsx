"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUnit() {

  const router = useRouter();

  const [unitName,setUnitName]=useState("");
  const [symbol,setSymbol]=useState("");

  const createUnit = async()=>{

    const companyId =
      localStorage.getItem("companyId");

    const response = await fetch(
      "http://localhost:5000/api/unit/create",
      {
        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          company_id:companyId,

          unit_name:unitName,

          symbol

        })

      }
    );

    const data = await response.json();

    if(data.success){

      alert("Unit Created");

      router.push("/masters/units");

    }else{

      alert(data.message);

    }

  };

  return(

<div className="min-h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white w-[600px] p-8 rounded-xl shadow">

<h1 className="text-3xl font-bold mb-6">

Create Unit

</h1>

<input

className="border p-3 w-full mb-4"

placeholder="Unit Name"

value={unitName}

onChange={(e)=>setUnitName(e.target.value)}

/>

<input

className="border p-3 w-full mb-6"

placeholder="Symbol (PCS,KG,LTR)"

value={symbol}

onChange={(e)=>setSymbol(e.target.value)}

/>

<button

onClick={createUnit}

className="bg-blue-600 text-white w-full py-3 rounded"

>

Create Unit

</button>

</div>

</div>

  );

}