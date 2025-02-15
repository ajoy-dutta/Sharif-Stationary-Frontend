import { useState } from "react";

const Stock = () => {
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
      stockAmount: "",
      remarks: "Stock thik ase", // Default option
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
  const handleRemarksChange = (index, value) => {
    const values = [...rows];
    values[index].remarks = value;
    setRows(values);
  };

  // Handle custom remarks
  const handleCustomRemarkChange = (index, value) => {
    const values = [...rows];
    values[index].customRemark = value;
    setRows(values);
  };

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
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
          Product Stock
        </h2>

        <table className="min-w-full table-fixed border-collapse">
          <thead className="bg-blue-100">
            <tr>
              <th className="px-4 py-2 text-center border border-gray-300 w-4%]">
                No
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[7%]">
                Item Code
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[25%]">
                Product Description
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Rim
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                Sheet
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[%]">
                Per Rim Purchase Amount
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[8%]">
                Per Sheet Purchase Amount
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[8%]">
                Total Purchase Amount
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[10%]">
                Stock Amount by Today/Last Purchase Rate
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[25%]">
                Remarks
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="text-xs -h-2">
                <td className="px-4 py-0 h-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter No"
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
                    placeholder="Enter Rim"
                    name="rim"
                    value={row.rim}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter Sheet"
                    name="sheet"
                    value={row.sheet}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter Purchase Rate"
                    name="purchaseRate"
                    value={row.purchaseRate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter Sheet Purchase Rate"
                    name="sheetPurchaseRate"
                    value={row.sheetPurchaseRate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter Rim Purchase Rate"
                    name="rimPurchaseRate"
                    value={row.rimPurchaseRate}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                {/* <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter Amount"
                    name="amount"
                    value={row.amount}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td> */}
                <td className="px-4 py-2 text-center border border-gray-300">
                  <input
                    type="number"
                    className="w-full text-center"
                    placeholder="Enter Stock Amount"
                    name="stockAmount"
                    value={row.stockAmount}
                    onChange={(e) => handleInputChange(index, e)}
                  />
                </td>
                <td className="px-4 py-2 text-center border border-gray-300">
                  <select
                    value={row.remarks}
                    onChange={(e) => handleRemarksChange(index, e.target.value)}
                    className="w-full px-4 py-{-2} border border-gray-300 rounded-lg text-xs"
                  >
                    <option value="স্টক ঠিক আছে">স্টক ঠিক আছে</option>
                    <option value="মন্তব্য">মন্তব্য</option>
                  </select>
                  {row.remarks === "মন্তব্য" && (
                    <textarea
                      className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg"
                      placeholder="এখানে আপনার মন্তব্য লিখুন"
                      value={row.customRemark}
                      onChange={(e) =>
                        handleCustomRemarkChange(index, e.target.value)
                      }
                    />
                  )}
                </td>
              </tr>
            ))}

            <tr>
              <th className="px-4 py-2 text-center border border-gray-300 w-4%]">
                Total:
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[7%]">
                N/A
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[25%]">
                N/A
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
                (ক্রয় এবং বিক্রয়ের ব্যালান্স হবে)
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[5%]">
              (ক্রয় এবং বিক্রয়ের ব্যালান্স হবে)

              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[%]">
                N/A
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[8%]">
                N/A
              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[8%]">
              (ক্রয় এবং বিক্রয়ের ব্যালান্স হবে)

              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[10%]">
              (ক্রয় এবং বিক্রয়ের ব্যালান্স হবে)

              </th>
              <th className="px-4 py-2 text-center border border-gray-300 w-[25%]">
                N/A
              </th>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Stock;
