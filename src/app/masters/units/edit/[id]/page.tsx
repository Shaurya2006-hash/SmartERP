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
export default function EditUnit(){

const router=useRouter();

const params=useParams();

const id=params.id;

const [unitName,setUnitName]=useState("");

const [symbol,setSymbol]=useState("");

useEffect(()=>{

fetchUnit();

},[]);

const fetchUnit=async()=>{

const response=await fetch(

`${API_BASE_URL}/api/unit/${id}`

);

const data=await response.json();

if(data.success){

setUnitName(data.unit.unit_name);

setSymbol(data.unit.symbol);

}

};

const updateUnit=async()=>{

const response=await fetch(

`${API_BASE_URL}/api/unit/update/${id}`,

{

method:"PUT",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

unit_name:unitName,

symbol

})

}

);

const data=await response.json();

if(data.success){

alert("Unit Updated");

router.push("/masters/units");

}else{

alert(data.message);

}

};

return(

<div className="min-h-screen flex justify-center items-center bg-gray-100">

<div className="bg-white w-[600px] p-8 rounded-xl shadow">

<h1 className="text-3xl font-bold mb-6">

Edit Unit

</h1>

<input

className="border p-3 w-full mb-4"

value={unitName}

onChange={(e)=>setUnitName(e.target.value)}

/>

<input

className="border p-3 w-full mb-6"

value={symbol}

onChange={(e)=>setSymbol(e.target.value)}

/>

<button

onClick={updateUnit}

className="bg-green-600 text-white w-full py-3 rounded"

>

Update Unit

</button>

</div>

</div>

);

}