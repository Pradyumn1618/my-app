import React, { useState, useEffect } from 'react';
import { collection, getDocs,query,onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { firestore, auth } from './firebase';
import Button from './components/button';
import './App.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const usersRef = collection(firestore, 'Users'); // Reference to Users collection
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc,index) => ({
        ...doc.data(),
        id: doc.id,
        serial: index+1
      }));
      setUsers(fetchedUsers);
    });
  
    // Cleanup function to unsubscribe on component unmount
    return () => unsubscribe();
  }, []);
  return (
    <div className="min-h-screen flex flex-col bg-black text-white w-full px-4 py-8">
      <header className="flex flex-row justify-between items-center">
        <div className="w-1/5 bg-black text-white p-6">
          <Button onClick={() => window.history.back()}>Back</Button>
        </div>
        <div className="w-full flex flex-col justify-center items-center">
          <h1 className="text-4xl text-center font-bold mb-4 font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
            Your Users
          </h1>
        </div>
      </header>

      {users.length > 0 ? (
        <div className="w-full flex flex-col h-screen">
          <table className="table-auto w-full sm:w-4/5 md:w-4/5 lg:w-4/5 mx-auto shadow-md rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-100 w-full bg-black font-medium flex flex-row justify-between items-center">
              <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  Serial
                </th>
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  Name
                </th>
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  Email
                </th>
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  isAdmin
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="w-full flex flex-row justify-between items-center" style={{ boxShadow: '4px 4px 0px rgba(255, 255,255,0.3)', hover: { boxShadow: '0 8px 10px rgba(255, 255,255,1)' } }}>
                <td className="py-4 w-1/3 sm:text-base md:text-base text-xs">
                    {user.serial}
                  </td>
                  <td className="py-4 w-1/3 sm:text-base md:text-base text-xs">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 w-1/3 sm:text-base md:text-base text-xs">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 w-1/3 sm:text-base md:text-base text-xs">
                    {user.isAdmin ? 'Yes' : 'No'}
                  </td>
                </tr>
              
              ))}
              </tbody>
          </table>
          </div>
      ) : (
        <div className="w-full flex flex-col h-screen"></div>)}
        </div>
      );
    };
    
    export default AllUsers;
