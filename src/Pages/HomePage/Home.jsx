import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import img from "../../assets/login.avif";

const Home = () => {
  const navigate = useNavigate();

  const [registers, setRegister] = useState(false);
  const [showName1, setShowName1] = useState({});
  const [Id, setId] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted. Redirecting to dashboard...");
    navigate("/dashboard");
  };

  return (
    <div className="flex justify-center font-bold text-2xl text-green-600">
    

      {/* Form container */}
      <div className="w-80 md:w-96 my-16 lg:w-[800px] mx-auto bg-white flex items-center relative overflow-hidden shadow-xl">
        
        {/* Register Form */}
        <form
          onSubmit={handleSubmit}
          method="post"
          className={`p-8 w-full ${registers ? "lg:translate-x-0" : "lg:-translate-x-full hidden lg:block"} duration-500`}
        >
          <h1 className="backdrop-blur-sm text-2xl lg:text-4xl pb-4">Register</h1>
          <div className="space-y-3">
            <input
              id="name"
              name="name"
              placeholder="John Doe"
              className="p-3 h-9 text-sm block w-full outline-none border rounded-md border-black"
            />
            <input
              id="uemail"
              name="email"
              placeholder="example@example.com"
              className="p-3 h-9 text-sm block w-full outline-none border rounded-md border-black"
            />
            <div>
              <label htmlFor="photo" className="flex w-full max-w-[600px]">
                <p className="w-full truncate rounded-md hover:shadow-[0px_0px_4px_0.5px] border-[1px] border-black px-4 py-2 text-sm text-black shadow-md">
                  {showName1.name ? showName1.name : "CHOOSE FILE"}
                </p>
              </label>
              <input
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setShowName1(e.target.files[0]);
                  }
                }}
                className="hidden"
                type="file"
                name="photo"
                id="photo"
              />
            </div>
            <input
              className="input h-9 text-sm p-3 block w-full outline-none border rounded-md border-black"
              name="registrationType"
              readOnly
            />
            <input
              id="id"
              name="id"
              onChange={(e) => setId(e.target.value)}
              required
              placeholder="Enter Your ID"
              className="p-3 h-9 text-sm block w-full outline-none border rounded-md border-black"
            />
            <input
              id="resNmbr"
              name="resNmbr"
              placeholder="Enter Your Registration Number"
              className="p-3 h-9 text-sm block w-full outline-none border rounded-md required border-black"
            />
            <input
              id="u_password"
              name="password"
              type="password"
              placeholder="Password"
              min={5}
              className="p-3 h-9 text-sm block w-full outline-none border rounded-md invalid:border-red-700 valid:border-black"
            />
          </div>
          <input
            type="submit"
            value="Register"
            className="btn py-2 px-5 mb-4 mx-auto mt-8 shadow-lg border rounded-md border-black block"
          />
          <p className="mb-3 text-center">
            Already have an account?{" "}
            <Link
              onClick={() => {
                setRegister(!registers);
              }}
              className="underline font-semibold"
            >
              Login
            </Link>
          </p>
          <hr />
        </form>

        {/* Image */}
        <div
          className={`hidden lg:block absolute w-1/2 h-full top-0 z-50 duration-500 overflow-hidden bg-black/20 ${registers ? "translate-x-full rounded-bl-full" : "rounded-br-full"}`}
        >
          <img src={img} className="h-full w-full" alt="card navigate ui" />
        </div>

        {/* Login Form */}
        <form
          className={`p-8 w-full mr-0 ml-auto duration-500 ${registers ? "lg:translate-x-full hidden lg:block" : ""}`}
        >
          <h1 className="backdrop-blur-sm text-2xl lg:text-4xl pb-4">Login</h1>
          <div className="space-y-5">
            <label htmlFor="_email" className="block">
              User Name
            </label>
            <input
              id="_code"
              name="code"
              type="text"
              placeholder="example1234"
              className="p-3 block w-full outline-none border rounded-md invalid:border-red-700 valid:border-black"
            />
            <label htmlFor="_password" className="block">
              Password
            </label>
            <input
              id="_password"
              name="password"
              type="password"
              placeholder=".............."
              min={5}
              className="p-3 block w-full outline-none border rounded-md invalid:border-red-700 valid:border-black"
            />
          </div>
          <input
            type="submit"
            value="Submit"
            className="btn py-2 px-5 mb-4 mx-auto mt-8 shadow-lg border rounded-md border-black block"
          />
        </form>
      </div>
    </div>
  );
};

export default Home;
