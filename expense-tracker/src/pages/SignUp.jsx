import { useState } from "react";
import { Link } from 'react-router-dom';


export function SignUp ( {handleSignUp} ) {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSignUp = () => {
    handleSignUp(email, password);
    setEmail('');
    setPassword('');
  }

   const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition";

  return (
      <section id="SignUp" className="px-6 bg-slate-50 flex flex-col items-center justify-center pb-24 min-h-screen">
        <h2 className="text-3xl font-semibold text-slate-800 mb-6 border-b-2 border-indigo-500 pb-2">Expense Tracker</h2>
        <div className="flex flex-col gap-4 w-full max-w-sm md:max-w-md bg-white rounded-2xl shadow-md border border-slate-100 p-6">
          <h3 className="text-2xl font-semibold text-slate-800 mb-6">Sign Up</h3>
          <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          
          <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
            />
          
          <button 
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            onClick={onSignUp}>
              Sign up
          </button>
          <p>Already have an account? <Link className="text-indigo-600 hover:text-indigo-700" to="/login">Login</Link></p>
        </div>
      </section>
  );

};

