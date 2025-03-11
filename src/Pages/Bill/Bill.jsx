import { useState } from "react";


const Bill = () => {
  // State to manage rows
  const [rows, setRows] = useState([
    {
      no: "",
      itemCode: "",
      description: "",
      sheet: "",
      rim: "",
      purchaseRate: "",
      sheetPurchaseRate: "",
      amount: "",
      rimSaleRate: "",
      sheetSaleRate: "",
      BillAmount: "",
      remarks: "Bill thik ase", // Default option
      customRemark: "", // For custom remarks
    },
  ]);

  // Handle input changes
  const handleInputChange = (index, event) => {
    const values = [...rows];
    values[index][event.target.name] = event.target.value;
    setRows(values);
  };

  // Handle remarks change (dropdown)
  //   const handleRemarksChange = (index, value) => {
  //     const values = [...rows];
  //     values[index].remarks = value;
  //     setRows(values);
  //   };

  // Handle custom remarks
  //   const handleCustomRemarkChange = (index, value) => {
  //     const values = [...rows];
  //     values[index].customRemark = value;
  //     setRows(values);
  //   };
  const handleDiscountChange = (e) => {
    const value = e.target.value;
    // Handle the discount value here (you can store it in the state if necessary)
    console.log("Discount:", value);
  };

  const handleAdjustmentChange = (e) => {
    const value = e.target.value;
    // Handle the adjustment value here
    console.log("Adjustment:", value);
  };

  const handleVATChange = (e) => {
    const value = e.target.value;
    // Handle the VAT value here
    console.log("VAT:", value);
  };

  const handleNetAmountChange = (e) => {
    const value = e.target.value;
    // Handle the net amount value here
    console.log("Net Amount:", value);
  };

  const handlePaidAmountChange = (e) => {
    const value = e.target.value;
    // Handle the paid amount value here
    console.log("Paid Amount:", value);
  };

  const handleCurrentDueChange = (e) => {
    const value = e.target.value;
    // Handle the current due amount value here
    console.log("Current Due:", value);
  };

  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const [vat, setVat] = useState(0);
  const [netAmount, setNetAmount] = useState(0);
  const [paidAmount, setPaidAmount] = useState(0);
  const [currentDue, setCurrentDue] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center space-y-1 bg-blue-50">
      <header className="text-center text-red-800 space-y-0.5">
        <h1 className="text-4xl font-bold text-red-600 leading-tight">
          Sharif Stationary
        </h1>
        <p className="text-md text-blue-700 leading-tight">
          36, Gohata Road, Lohapotty, Jashore
        </p>
        <p className="text-md text-red-600 leading-tight">
          Cell: 01854-341463, 01707-341463, 01711-334408
        </p>
        <p className="text-md text-gray-800 leading-tight">
          Nagad & Bkash: 01707-341463 (Personal)
        </p>
      </header>

      <div className="container mx-auto my-8 p-4 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-2">
          Product Bill
        </h2>

<table className="min-w-full table-fixed mb-8 border-1 border-2 blue-400 rounded-sm">
          <thead className="bg-blue-100 border-2 border-blue-300">
            <tr className=" border-2 border-blue-300">
              <th className=" text-center border-2 border-gray-300 w-[1%]">No</th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[7%]">
                Item Code
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[15%]">
                Product Description
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Dozon Quantity
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Dozon Rate
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Piece Quantity
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Piece Rate
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Rim Quantity
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Rim Rate
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Sheet Quantity
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Sheet Rate
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[6%]">
                Amount
              </th>
            </tr>
          </thead>
          <tbody >
            {rows.map((row, index) => (
              <tr key={index} className="text-xs -h-2  border-2 border-blue-300">
                <td className="px-4 py-0 h-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder=" "
                    name="no"
                    value={row.no}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="text"
                    className="w-full text-center"
                    name="itemCode"
                    value={row.itemCode}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="text"
                    className="w-full text-center"
                    name="description"
                    value={row.description}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Dozon"
                    name="rim"
                    value={row.rim}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Rate"
                    name="sheet"
                    value={row.sheet}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Piece"
                    name="purchaseRate"
                    value={row.purchaseRate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Rate"
                    name="sheetPurchaseRate"
                    value={row.sheetPurchaseRate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Rim"
                    name="rimPurchaseRate"
                    value={row.rimPurchaseRate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Rate"
                    name="BillAmount"
                    value={row.BillAmount}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Rate"
                    name="BillAmount"
                    value={row.BillAmount}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Sheet"
                    name="BillAmount"
                    value={row.BillAmount}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Amount"
                    name="BillAmount"
                    value={row.BillAmount}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
              </tr>
            ))}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>

              <td
                colSpan="2"
                className="px-4 py-2 text-right border-2 border-blue-300"
              >
                Total
              </td>
              <td className="px-4 py-2 text-center border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="Total"
                  name="total"
                  onChange={handleDiscountChange}
                />
              </td>
            </tr>
            <tr className=" ">
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                colSpan="2"
                className="px-4 py-2 text-right border-2 border-blue-300"
              >
                Discount
              </td>
              <td className="px-4 py-2 text-center border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="Discount"
                  name="discount"
                  onChange={handleDiscountChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                colSpan="2"
                className="px-4 py-2 text-right border-2 border-blue-300"
              >
                Previous Due Amount
              </td>
              <td className="px-4 py-2 text-center border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="Adjustment"
                  name="adjustment"
                  onChange={handleAdjustmentChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                colSpan="2"
                className="px-4 py-2 text-right border-2 border-blue-300"
              >
                VAT
              </td>
              <td className="px-4 py-2 text-center border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="VAT"
                  name="vat"
                  onChange={handleVATChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                colSpan="2"
                className="px-4 py-2 text-right border-2 border-blue-300"
              >
                Net Amount
              </td>
              <td className="px-4 py-2 text-center  border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="Net Amount"
                  name="netAmount"
                  onChange={handleNetAmountChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                colSpan="2"
                className="px-4 py-2 text-right border-2 border-blue-300"
              >
                Paid Amount
              </td>
              <td className="px-4 py-2 text-center border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="Paid Amount"
                  name="paidAmount"
                  onChange={handlePaidAmountChange}
                />
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td
                colSpan="2"
                className="px-4 py-2 text-right  border-2 border-blue-300"
              >
                Current Due Amount
              </td>
              <td className="px-4 py-2 text-center border-2 border-blue-300">
                <input
                  type="number"
                  className="w-full text-center"
                  placeholder="Current Due"
                  name="currentDue"
                  onChange={handleCurrentDueChange}
                />
              </td>
            </tr>
            
          </tbody>
        </table>
        <div>
    <h2 className="font-bold">Paid Amount in word :</h2>
</div>

      </div>
    </div>
  );
};

export default Bill;
