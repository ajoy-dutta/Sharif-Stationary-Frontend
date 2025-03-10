import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoMdPrint } from "react-icons/io";
import { Link } from "react-router-dom";
import AxiosInstance from "../../components/AxiosInstance";

const PaymentList = () => {
  const [bereft, setBereft] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedName, setSelectedName] = useState("");

  const toggleRow = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };


  useEffect(() => {
    const fetchBereft = async () => {
      try {
        const response = await AxiosInstance.get("mohajons/");
        setBereft(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchBereft();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await AxiosInstance.get("payments/");
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchPayments();
  }, []);

  useEffect(() => {
    let filtered = [...records];

    // Filter by Mohajon Name
    if (selectedName) {
      filtered = filtered.filter((purchase) =>
        bereft.some(
          (buyer) =>
            buyer.id === purchase.details[0]?.mohajon &&
            buyer.id === Number(selectedName)
        )
      );
    }

    // Filter by Date Range
    if (fromDate || toDate) {
      filtered = filtered.filter((purchase) => {
        const purchaseDate = new Date(purchase.date);
        const startDate = fromDate ? new Date(fromDate) : null;
        const endDate = toDate ? new Date(toDate) : null;

        return (
          (!startDate || purchaseDate >= startDate) &&
          (!endDate || purchaseDate <= endDate)
        );
      });
    }

    setFilteredRecords(filtered);
  }, [selectedName, fromDate, toDate, records]);

  return (
    <div>
      <div className="mt-8 mx-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">অর্থাদি প্রদান তালিকা</h2>
          <div className="flex gap-4">
            <Link
              to="/dashboard/addEditPayment"
              className="btn bg-blue-950 text-white"
            >
              Add New
            </Link>
          </div>
        </div>
        <div>
          <div>
            <div className="flex justify-between mb-4">
              <div className="join">
                <div className="btn bg-blue-950 rounded-l-md rounded-r-none text-white">
                  Search Here
                </div>
                <select
                  className="select select-bordered join-item"
                  value={selectedName}
                  onChange={(e) => setSelectedName(e.target.value)}
                >
                  <option value="">মহাজনের নাম</option>
                  {bereft?.map((bx, id) => (
                    <option key={id} value={bx.id}>
                      {bx.name}
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  className="input input-bordered join-item"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  className="input input-bordered join-item"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="overflow-x-auto">
            <table className="table table-xs border-collapse border border-gray-300">
              <thead>
                <tr className="bg-blue-950 text-xs text-white">
                  <th className="border p-2 text-center">SL</th>
                  <th className="border p-2 text-center">তারিখ</th>
                  <th className="border p-2 text-center">রিসিপ্ট নং</th>
                  <th className="border p-2 text-center">ভাউচার নং</th>
                  <th className="border p-2 text-center">লেনদেন বিভাগ</th>
                  <th className="border p-2 text-center">বেপারীর/মহাজনের নাম</th>
                  <th className="border p-2 text-center">লেনদেন তথ্যাদি</th>
                  <th className="border p-2 text-center">Edit</th>
                  <th className="border p-2 text-center">Invoice</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record, index) => (
                  <>
                    <tr key={record.id} className="bg-gray-100 text-sm">
                      <td className="border text-sm p-2 text-center">{index + 1}</td>
                      <td className="border p-2 text-center">{record.date || "N/A"}</td>
                      <td className="border p-2 text-center">{record.code || "N/A"}</td>
                      <td className="border p-2 text-center">{record.voucher || "N/A"}</td>
                      <td className="border p-2 text-center">{record.details[0].transaction_type || "N/A"}</td>
                      <td className="border p-2 text-center">
                      {bereft.find((buyer) => buyer.id === record.details[0].mohajon)
                        ?.name || "N/A"}
                       </td>
                       <td className="border p-2 text-center">
                      {record.details?.length > 0 ? (
                        <button onClick={() => toggleRow(index)} className="text-green-600 text-sm">
                          {expandedRow === index ? <FaMinus /> : <FaPlus />}
                        </button>
                      ) : (
                        "N/A"
                      )}
                    </td>
                      <td className="border p-2 text-center">
                        <Link to="">
                          <button className="">✏</button>
                        </Link>
                      </td>
                      <td className="border p-2 text-base text-center text-red-500">
                        <IoMdPrint />
                      </td>
                    </tr>
                    {expandedRow === index && record.details?.length > 0 &&  (
                      <tr className="bg-gray-200 px-4 text-xs">
                        <td colSpan="9">
                          <table className="table-auto w-full border-collapse border border-gray-300 mt-2">
                            <thead>
                              <tr className="bg-blue-950 text-white">
                                <th className="border p-2">খরচের বিবরণ</th>
                                <th className="border p-2"> লেনদেন বিবরণ</th>
                                <th className="border p-2"> মোট টাকা</th>
                                <th className="border p-2">ব্যাংকের নাম</th>
                                <th className="border p-2"> হিসাব নাম্বার</th>
                                <th className="border p-2">চেক নাম্বার</th>
                                <th className="border p-2">মোবাইল ব্যাংকিং নাম্বার</th>
                              </tr>
                            </thead>
                            <tbody>
                            {record.details.map((detail, dIndex) => (
                                <tr key={dIndex} className="bg-white">
                                  <td className="border p-2 text-center">
                                    {detail.payment_description || "N/A"} {/* If null or undefined, show "N/A" */}
                                  </td>
                                  <td className="border p-2 text-center">{detail.transaction_type || "N/A"}</td>
                                  <td className="border p-2 text-center">{detail.amount || "N/A"}</td>
                                  <td className="border p-2 text-center">{detail.bank_name || "N/A"}</td>
                                  <td className="border p-2 text-center">{detail.account_number || "N/A"}</td>
                                  <td className="border p-2 text-center">{detail.cheque_number || "N/A"}</td>
                                  <td className="border p-2 text-center">{detail.mobile_banking_number || "N/A"}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
