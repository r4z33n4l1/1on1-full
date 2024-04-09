'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/utils/authHelper';
import Image from 'next/image';

export default function Signup() {
    const [userData, setUserData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: '',
        email: '',
    });
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (userData.password !== userData.confirmPassword) {
            setErrors({ confirmPassword: "Passwords do not match." });
            return;
        }

        const { confirmPassword, ...signupData } = userData; // Exclude confirmPassword from data sent to backend
        const result = await signup(signupData);

        if (result.success) {
            router.push('/login');
        } else {
            setErrors(result.errors);
        }
    };

//     return (
//         <div className="flex h-screen bg-gray-100">
//             <div className="w-1/2 flex justify-center items-center bg-white">
//                 <div className="w-full max-w-md p-8">
//                     <h1 className="text-2xl font-bold mb-6">Sign Up</h1>
                    // <form onSubmit={handleSubmit} className="space-y-4">
                    //     <div>
                    //         <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username</label>
                    //         <input id="username" name="username" type="text" placeholder="Username" value={userData.username} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    //         {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                    //     </div>

                    //     <div>
                    //         <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                    //         <input id="password" name="password" type="password" placeholder="Password" value={userData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    //     </div>

                    //     <div>
                    //         <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Retype Password</label>
                    //         <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Retype Password" value={userData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    //         {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                    //     </div>

                    //     <div>
                    //         <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                    //         <input id="firstName" name="firstName" type="text" placeholder="First Name" value={userData.firstName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    //     </div>

                    //     <div>
                    //         <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                    //         <input id="lastName" name="lastName" type="text" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    //     </div>

                    //     <div>
                    //         <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                    //         <input id="email" name="email" type="email" placeholder="Email" value={userData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                    //         {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                    //     </div>

                    //     <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-70">Sign Up</button>
                    // </form>
//                     <p className="mt-4 text-sm text-center">
//                         Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
//                     </p>
//                 </div>
//             </div>
//             <div className="w-1/2 flex items-center justify-center bg-white-100">
//                 {/* Image container */}
//                 <div className="max-w-lg mx-auto">
//                     <Image
//                         src="/assets/phone.gif" // Adjust the path to your image
//                         unoptimized={true}
//                         width={0}
//                         height={0}
//                         sizes="100vh"
//                         style={{ width: 'auto', height: '100vh' }} // optional
//                     />
//                 </div>
//             </div>
//         </div>
//     );



return (
  <>
  <>
  <meta charSet="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Signup Page</title>
  <link rel="stylesheet" href="/assets/signup.css" />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Open+Sans%3A700"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto%3A400%2C500%2C700"
  />
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A400%2C500%2C700"
  />
  <link
    rel="stylesheet"
    href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css"
    integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
    crossOrigin="anonymous"
  />
  <div className="container-fluid">
    <div className="row" style={{ paddingTop: "1rem" }}>
      <div className="col-md-6 center-block text-center">
        <a className="navbar-brand" href="#" id="logo">
          <img src="assets/logo.png" width={280} height={70} alt="" />
        </a>
        <div
          className="container"
          style={{ paddingLeft: "5rem", textAlign: "left" }}
        >
           <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username</label>
                            <input id="username" name="username" type="text" placeholder="Username" value={userData.username} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                        </div>

                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                            <input id="password" name="password" type="password" placeholder="Password" value={userData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Retype Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Retype Password" value={userData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                        </div>

                        <div>
                            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                            <input id="firstName" name="firstName" type="text" placeholder="First Name" value={userData.firstName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                        </div>

                        <div>
                            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                            <input id="lastName" name="lastName" type="text" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                        </div>

                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                            <input id="email" name="email" type="email" placeholder="Email" value={userData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                        </div>

                        <button style={{backgroundColor: '#ba0a51bb'}} type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-70">Sign Up</button>
                    </form>
        </div>
      </div>
      <div className="col-md-6" id="col-2">
        <header>
          <nav
            className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
            style={{
              backgroundColor: "#77aeaa !important",
              fontWeight: "bold"
            }}
          >
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarText"
              aria-controls="navbarText"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon" />
            </button>
              <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                  <a className="nav-link" href="onboarding.html">
                    Home <span className="sr-only">(current)</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="onboarding.html">
                    Features
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="onboarding.html">
                    Contact Us
                  </a>
                </li>
              </ul>
              <ul className="navbar-nav">
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Already have an account?{" "}
                    <span style={{ fontWeight: "bold" }}>Login</span>
                  </a>
                </li>
              </ul>
          </nav>
        </header>
        <div className="center-image" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img src="assets/phone.gif" className="img-fluid" alt="Clipart" />
        </div>

      </div>
    </div>
  </div>
</>

      {/* <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Signup Page</title>
      <link rel="stylesheet" href="assets/signup.css" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Open+Sans%3A700" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto%3A400%2C500%2C700" />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Sans+Pro%3A400%2C500%2C700" />
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" />
      <div className="container-fluid" >
          <div className="row" >
              <div className="col-md-6 center-block text-center" style={{marginTop: '5vh'}}>
                  <a className="navbar-brand" href="#">
                      <img src="assets/logo.png" width={280} height={70} alt="" />
                  </a>
                  <div className="container">
                      <div className="slogan">
                          <p>
                              Effortless Scheduling,
                              <br />
                              Elevated Experiences
                          </p>
                      </div>
                      <p className="welcome-text">
                          Welcome to Appointify! Please create a new account.
                      </p>
                  </div>
                  <div className="container" style={{ maxWidth: 400, textAlign: "left"}}>
                      <form onSubmit={handleSubmit}>
                          <div>
                              <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700">Username</label>
                              <input id="username" name="username" type="text" placeholder="Username" value={userData.username} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                              {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username}</p>}
                          </div>
                          <div>
                              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
                              <input id="password" name="password" type="password" placeholder="Password" value={userData.password} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                          </div>
                          <div>
                              <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Retype Password</label>
                              <input id="confirmPassword" name="confirmPassword" type="password" placeholder="Retype Password" value={userData.confirmPassword} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                              {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>}
                          </div>
                          <div>
                              <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">First Name</label>
                              <input id="firstName" name="firstName" type="text" placeholder="First Name" value={userData.firstName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                          </div>
                          <div>
                              <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">Last Name</label>
                              <input id="lastName" name="lastName" type="text" placeholder="Last Name" value={userData.lastName} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                          </div>
                          <div>
                              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
                              <input id="email" name="email" type="email" placeholder="Email" value={userData.email} onChange={handleChange} required className="w-full px-4 py-2 border rounded-md" />
                              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                          </div>
                          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700" style={{backgroundColor: '#398d86'}}>Sign Up</button>
                      </form>
                  </div>
              </div>
              <div className="col-md-6" id="col-2">
                  <header>
                      <nav className="navbar navbar-expand-lg">
                              <ul className="navbar-nav mr-auto">
                                  <li className="nav-item active">
                                      <a className="nav-link" href="#">
                                          Home <span className="sr-only">(current)</span>
                                      </a>
                                  </li>
                                  <li className="nav-item">
                                      <a className="nav-link" href="#">
                                          Features
                                      </a>
                                  </li>
                                  <li className="nav-item">
                                      <a className="nav-link" href="#">
                                          Pricing
                                      </a>
                                  </li>
                                  <li className="nav-item">
                                      <a className="nav-link" href="#">
                                          Contact Us
                                      </a>
                                  </li>
                              </ul>
                              <ul className="navbar-nav">
                                  <li className="nav-item">
                                      <a className="nav-link" href="/login">
                                          Already have an account? <span style={{ fontWeight: "bold" }}>Login</span>
                                      </a>
                                  </li>
                              </ul>
                          
                      </nav>
                  </header>
                  <div className="center-image">
                      <img src="assets/phone.gif" className="img-fluid" alt="Clipart" />
                  </div>
              </div>
          </div>
      </div> */}
  </>
);



  }
