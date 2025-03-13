import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import AxiosInstance from "../../components/AxiosInstance";
import { Link } from "react-router-dom";

const AddEditPayment = () => {
  let [person, setPerson] = useState([]);
  const [cost, setCost] = useState([]);
  const [employee, setEmployee] = useState([]);
  const [bank, setBank] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState([]);

  const [selected, setSelected] = useState("");
  const [selectedPerson, setSelectedPerson] = useState("");
  const [selectPaymentMethod, setSelectPaymentMethod] = useState("");
  const [selectedPersonId, setSelectedPersonId] = useState("");
  const [previousDue, setPreviousDue] = useState("");
  const [transactionType, setTransactionType] = useState("");
 
  
  const fetchData = async (endpoint, setter) => {
    try {
      const response = await AxiosInstance.get(endpoint);
      setter(response.data);
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
    }
  };


  useEffect(() => {
    fetchData("mohajons/", setPerson);
    fetchData("cost_method/", setCost);
    fetchData("employees/", setEmployee);
    fetchData("bank_info/", setBank);
    fetchData("payment_method/", setPaymentMethod);
  }, []);

  const [formData, setFormData] = useState({
    date: new Date(),
    code: "",
    voucher: "",
    details: [],
  });

  person = person.filter((item) => item.business_type === selected);

 
  const [payment, setPayment] = useState({
    transaction_type: "",
    payment_method: "",
    mohajon: "",
    bank_name: "",
    employee: "",
    account_number: "",
    cheque_number: "",
    mobile_banking_number: "",
    payment_description: "",
    amount: "",
  });

useEffect(() => {
    const totalAmount = formData.details.reduce((sum, item) => {
      return sum + (parseFloat(item.amount) || 0);
    }, 0);

    setFormData((prev) => ({ ...prev, remaining_amount: totalAmount }));
  }, [formData.details]);



  const HandlePaymentInfo = (event) => {
    event.preventDefault();

    setFormData((prev) => {
      const updatedPaymentInfo = [...(prev.details || []), { ...payment }];

      return {
        ...prev,
        details: updatedPaymentInfo,
        voucher: prev.voucher,
      };
    });

    setPayment({
      transaction_type: "",
      payment_method: "",
      mohajon: "",
      bank_name: "",
      employee: "",
      account_number: "",
      cheque_number: "",
      mobile_banking_number: "",
      payment_description: "",
      amount: "",
    });
  };

  const handlePaymentChange = (event) => {
    const { id, value } = event.target;
  
    if (id === "transaction_type") {
      setSelected(value); // Set selected transaction type
      setSelectedPerson(""); // Reset person selection
      setSelectedPersonId(""); // Reset selected person ID
      setPreviousDue("0.00"); // Reset previous due
    } 
    else if (id === "payment_method") {
      setSelectPaymentMethod(value);
    } 
    else if (id === "mohajon") {
      setSelectedPersonId(value);
  
      // Find the selected mohajon and set previous due
      const selectedMohajon = person.find((p) => String(p.id) === String(value));
      setPreviousDue(selectedMohajon?.due_amount || "0.00");
  
    }
  
    setPayment((prev) => ({ ...prev, [id]: value }));
  };
  
  



  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "business_type") {
      setSelected(value);
    }
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleDeleteSell = (index) => {
    setFormData((prevState) => {
      const updatedSell = prevState.details.filter((_, i) => i !== index);

      return {
        ...prevState,
        details: updatedSell, //
      };
    });
  };

  const handleDateChange = (date) => {
    setFormData((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const data = JSON.stringify(formData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "formData.json";
    link.click();
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

  
    // Convert formData to JSON-friendly object
    const payload = {
      date: formData.date.toISOString().split("T")[0], // Convert date to "YYYY-MM-DD"
      code: formData.code,
      voucher: formData.voucher, // Ensure voucher is present
      details: formData.details.map((payment) => ({
        ...payment,
        
    })),
    };

    console.log("📦 Final Payload:", JSON.stringify(payload, null, 2));

    try {
      const response = await AxiosInstance.post("/payments/", payload);

      alert("✅ Expense Created Successfully!");

      // Reset form
      setFormData({
        date: new Date(),
        code: "",
        voucher: "",
        details: [],
        remaining_amount: "",
      });

      console.log("✅ Response:", response.data);
    } catch (error) {
      if (error.response) {
        console.error("🚨 Server Response Error:", error.response.data);
        alert(`🚨 Error: ${JSON.stringify(error.response.data)}`);
      } else {
        console.error("🚨 Error submitting form:", error);
      }
    }
  };

  return (
    <div className="mt-8 mx-8">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">অর্থাদি প্রদান</h2>
        <Link to="/dashboard/paymentList" className="btn bg-blue-950 text-white">View List</Link>
      </div>

      <div className="bg-white shadow-md p-4 ">
        <form onSubmit={handleSubmit}>
          <h2 className="font-semibold text-base my-3 mb-2 ">তথ্য:</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[
              { id: "date", label: "তারিখ :*", type: "datePicker" },
              {
                id: "code",
                label: "রিসিপ্ট নং :*",
                type: "text",
                placeholder: "AUTO GENARATE",
                disabled: true,
              },
              {
                id: "voucher",
                label: "ভাউচার নং",
                type: "text",
                placeholder: "Enter ভাউচার নং",
              },
            ].map((field) => (
              <div key={field.id}>
                <label className="block mb-1 text-sm text-center font-medium text-gray-700">
                  {field.label}
                </label>
                {field.type === "datePicker" ? (
                  <DatePicker
                    selected={formData.date}
                    onChange={handleDateChange}
                    dateFormat="dd/MM/yyyy"
                    className="input h-7 input-bordered w-full input-md"
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    placeholder={field.placeholder || ""}
                    value={formData[field.name]}
                    onChange={handleChange}
                    disabled={field.disabled}
                    required={field.required}
                    className="input h-7 input-bordered w-full input-md"
                  />
                )}
              </div>
            ))}
          </div>

          <h2 className="font-semibold text-base my-3 mb-1">লেনদেন তথ্যাদি</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
            {[
    
              {
                id: "transaction_type",
                label: "লেনদেন বিভাগ :*",
                type: "select",
                options: cost.map((item) => ({
                  value: item.name === "বেপারীর টাকা" ? "বেপারী/চাষী" : item.name === "মহাজনের টাকা" ? "মহাজন" : item.name,
                  label: item.name
                })),
                readOnly: true,
                onChange: (e) => {
                  setTransactionType(e.target.value); 
                  handlePaymentChange(e); 
                },
              },
              
              {
                id: "mohajon",
                label: "বেপারীর/ মহাজনের নাম :*",
                type: "select",
                options: person.map((item) => ({
                  value: item.id.toString(),
                  label: item.name,
                })),
                readOnly: true,
                disabled: !(transactionType === "বেপারী/চাষী" || transactionType === "মহাজন"),
              },           
              {
                id: "payment_method",
                label: "পেমেন্টের ধরণ: *",
                type: "select",
                options: [
                  ...paymentMethod.map((item) => ({
                    value: item.payment_method,
                    label: item.payment_method,
                  })),
                ],
                readOnly: true,
              },
        
              {
                id: "previous_due",
                label: "আগের বাকি টাকা :*",
                type: "text",
                value: previousDue,
                readOnly: true,
                placeholder: "Enter আগের বাকি টাকা",
              },

              {
                id: "bank_name",
                label: "ব্যাংকের নাম",
                type: "select",
                options: [
                  ...bank.map((bn) => ({
                    value: bn.bank_name,
                    label: bn.bank_name,
                  })),
                ],
                disabled: selectPaymentMethod !== "ব্যাংক",
                placeholder: "Enter ব্যাংকের নাম",
              },

              {
                id: "employee",
                label: "ব্যক্তির নাম",
                type: "select",
                disabled: selectedPerson !== "কর্মচারীর বেতন",
                options: [
                  ...employee.map((item) => ({
                    value: item.id.toString(),
                    label: item.full_name,
                  })),
                ],
              },

              {
                id: "account_number",
                label: "হিসাব নং",
                type: "text",
                value: "N/A",
                disabled:
                  selectPaymentMethod !== "ব্যাংক" &&
                  selectPaymentMethod !== "ডাচবাংলা এজেন্ট",
                  placeholder: "Enter হিসাব নং" ,
              },
              {
                id: "cheque_number",
                label: "চেক নং",
                type: "text",
                value: "N/A",
                disabled: selectPaymentMethod !== "চেক",
                placeholder: "Enter চেক নং" ,
              },
              {
                id: "mobile_banking_number",
                label: "ব্যাংকিং মোবাইল নং",
                type: "text",
                placeholder: "Enter ব্যাংকিং মোবাইল নং",
                disabled:
                  selectPaymentMethod !== "বিকাশ" &&
                  selectPaymentMethod !== "নগদ" &&
                  selectPaymentMethod !== "রকেট",
              },

              {
                id: "payment_description",
                label: "খরচের বিবরণ ",
                type: "textarea",
                placeholder: "Enter খরচের বিবরণ",
              },

              {
                id: "amount",
                label: "টাকার পরিমাণ :*",
                type: "text",
                placeholder: "Enter টাকার পরিমাণ",
              },
            ].map((field) => (
              <div key={field.id}>
                <label className="block mb-1 text-sm text-center font-medium text-gray-700">
                  {field.label}
                </label>
                {field.type === "select" ? (
                  <select
                    id={field.id}
                    value={formData[field.id]}
                    onChange={(e) => {
                      handlePaymentChange(e);  
                      if (field.id === "transaction_type") {
                        setTransactionType(e.target.value);  
                      }
                    }}
                    disabled={field.disabled}
                    readOnly={field.readOnly}
                    className="input h-7 input-bordered w-full input-md"
                  >
                    <option value="">Select</option>
                    {field.options.map((option, index) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (  // Condition for the textarea field
                  <textarea
                    id={field.id}
                    placeholder={field.placeholder || ""}
                    value={formData[field.id]}  // Handle value for textarea
                    onChange={handlePaymentChange}
                    disabled={field.disabled}
                    readOnly={field.readOnly}
                    className="input h-16 input-bordered w-full input-md"  // Apply a larger height for textarea
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    placeholder={field.placeholder || ""}
                    value={field.id === "previous_due"
                      ? previousDue
                      : formData[field.id]
                    }  // ✅ Use `previousDue`
                    onChange={handlePaymentChange}
                    disabled={field.disabled}
                    readOnly={field.readOnly}
                    className="input h-7 input-bordered w-full input-md"
                  />
                )}
              </div>
            ))}
            <div className="flex items-center justify-start my-5">
              <button
                onClick={HandlePaymentInfo}
                className="bg-blue-950 btn-sm text-white btn w-20"
              >
                Add
              </button>
            </div>
          </div>
          {/* Display added records */}
          <div className="my-2">
            {formData.details.length === 0 ? (
              <p className="text-md font-medium text-gray-600">
                No Purchase Information Data is present.
              </p>
            ) : (
              <div className="overflow-x-auto mt-2">
                <table className="table-auto w-full mt-3 border-collapse">
                  <thead className="bg-base-200 font-medium text-xs">
                    <tr>
                      <th className="border px-4  py-1 text-xs">
                        লেনদেন বিভাগ
                      </th>
                      <th className="border px-4  py-1 text-xs">ধরণ </th>
                      <th className="border px-4  py-1 text-xs">
                        পেমেন্টের ধরণ
                      </th>

                      <th className="border px-4  py-1 text-xs">
                        {" "}
                        বেপারীর/মহাজনের নাম
                      </th>
                      
                      <th className="border px-4  py-1 text-xs">
                        ব্যাংকের নাম
                      </th>
                      <th className="border px-4  py-1 text-xs">
                        ব্যক্তির নাম
                      </th>
                      <th className="border px-4  py-1 text-xs">হিসাব নং</th>

                      <th className="border px-4  py-1 text-xs">চেক নং</th>

                      <th className="border px-4  py-1 text-xs">
                        ব্যাংকিং মোবাইল নং
                      </th>
                      <th className="border px-4  py-1 text-xs">খরচের বিবরণ</th>

                      <th className="border px-4  py-1 text-xs">
                        টাকার পরিমাণ
                      </th>
                      <th className="border px-4  py-1 text-xs">Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.details.map((item, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-1 text-sm">
                          {item.transaction_type || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.business_type || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.payment_method || "N/A"}
                        </td>

                        <td className="border px-4 py-1 text-sm">
                          {person.find(
                            (buyer) => String(buyer.id) === String(item.mohajon)
                          )?.name || "Unknown Buyer"}
                        </td>
                       
                        <td className="border px-4 py-1 text-sm">
                          {item.bank_name || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {employee.find(
                            (buyer) =>
                              String(buyer.id) === String(item.employee)
                          )?.full_name || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.account_number || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.cheque_number || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.mobile_banking_number || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.payment_description || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          {item.amount || "N/A"}
                        </td>
                        <td className="border px-4 py-1 text-sm">
                          <button
                            onClick={() => handleDeleteSell(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="flex justify-between my-5">
            <div className="">
              <label
                htmlFor="remainingAmount"
                className="block mb-1 text-sm font-medium text-gray-700"
              >
                লেনদেন টাকার পরিমাণ:*
              </label>
              <input
                id="remaining_amount"
                type="number"
                placeholder="লেনদেন টাকার পরিমাণ :*"
                value={formData.remaining_amount || 0} // Default to 0 if empty
                className="input h-7 input-bordered w-full input-md"
                readOnly // Prevent manual edits
              />
            </div>

            {/* Adjust button section to use 2 columns */}
            <div className="flex  gap-4 mt-4">
              <button
                type="submit"
                className="btn bg-blue-950 text-white col-span-2"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handlePrint}
                className="btn bg-blue-950 text-white"
              >
                Print
              </button>
              <button
                type="button"
                onClick={handleDownload}
                className="btn bg-blue-950 text-white"
              >
                Download
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEditPayment;
