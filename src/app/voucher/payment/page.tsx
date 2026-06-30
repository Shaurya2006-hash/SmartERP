"use client";

import { useState } from "react";

export default function PaymentVoucher(){

const companyId=localStorage.getItem("companyId");

const[voucherNo,setVoucherNo]=useState("");

const[date,setDate]=useState("");

const[reference,setReference]=useState("");

const[narration,setNarration]=useState("");

const[amount,setAmount]=useState("");

const[fromLedger,setFromLedger]=useState("");

const[toLedger,setToLedger]=useState("");

const saveVoucher=async()=>{

const response=await fetch(
"http://localhost:5000/api/voucher/create",
{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({

company_id:companyId,

voucher_no:voucherNo,

voucher_type:"Payment",

voucher_date:date,

reference_no:reference,

narration,

total_amount:amount,

entries:[

{

ledger_id:fromLedger,

debit:parseFloat(amount),

credit:0,

},

{

ledger_id:toLedger,

debit:0,

credit:parseFloat(amount),

},

],

}),
}
);

const data=await response.json();

if(data.success){

alert("Payment Voucher Saved");

}

};

return(

<div className="p-8">

<h1 className="text-3xl font-bold mb-6">

Payment Voucher

</h1>

<input
placeholder="Voucher No"
className="border p-3 w-full mb-4"
value={voucherNo}
onChange={(e)=>setVoucherNo(e.target.value)}
/>

<input
type="date"
className="border p-3 w-full mb-4"
value={date}
onChange={(e)=>setDate(e.target.value)}
/>

<input
placeholder="Reference"
className="border p-3 w-full mb-4"
value={reference}
onChange={(e)=>setReference(e.target.value)}
/>

<input
placeholder="From Ledger Id"
className="border p-3 w-full mb-4"
value={fromLedger}
onChange={(e)=>setFromLedger(e.target.value)}
/>

<input
placeholder="To Ledger Id"
className="border p-3 w-full mb-4"
value={toLedger}
onChange={(e)=>setToLedger(e.target.value)}
/>

<input
placeholder="Amount"
className="border p-3 w-full mb-4"
value={amount}
onChange={(e)=>setAmount(e.target.value)}
/>

<textarea
placeholder="Narration"
className="border p-3 w-full mb-4"
value={narration}
onChange={(e)=>setNarration(e.target.value)}
/>

<button

onClick={saveVoucher}

className="bg-blue-600 text-white px-6 py-3 rounded"

>

Save Voucher

</button>

</div>

);

}