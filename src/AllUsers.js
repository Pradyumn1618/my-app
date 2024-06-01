import React, { useState, useEffect } from 'react';
import { collection, onSnapshot,doc, updateDoc } from 'firebase/firestore';
import { firestore } from './firebase';
import './App.css';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const curuser = JSON.parse(localStorage.getItem('user'));
  const [filteredUsers,setFilteredUsers] = useState(users);
  const [searchQuery,setSearchQuery]=useState('');
  const [IsSuperAdmin,setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const userRef = doc(firestore, 'Users', curuser.uid);
    const unsubscribe = onSnapshot(userRef, (snapshot) => {
      const user = snapshot.data();
      if (user?.IsSuperAdmin) {
        setIsSuperAdmin(true);
      }
      else {
        setIsSuperAdmin(false);
      }
    });
    return () => unsubscribe();
  }, [curuser.uid]);
  


  useEffect(() => {
    const usersRef = collection(firestore, 'Users');
    const unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const fetchedUsers = snapshot.docs.map((doc, index) => ({
        ...doc.data(),
        id: doc.id,
        serial: index + 1
      }));
      setUsers(fetchedUsers);
      setFilteredUsers(fetchedUsers);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filterUsers = () => {
      if (!searchQuery) {
        setFilteredUsers(users);
      } else {
        const filtered = users.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())||
          user.email.toLowerCase().includes(searchQuery.toLowerCase())||
          user.serial.toString().toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredUsers(filtered);
      }
    };

    filterUsers();
  }, [users, searchQuery]);

  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    };

  return (
    <div className="min-h-screen flex flex-col bg-black text-white w-full px-4 py-8">
      <header className="flex flex-row justify-center items-center">
        <div className="w-2/3 flex flex-row justify-end items-center">
          <h1 className="text-4xl text-center font-bold mb-4 font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
            Your Users
          </h1>
        </div>
        <div className='w-1/2 absolute-right'>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder=" Search users..."
              className={`px-4 py-2 rounded text-black w-1/3`}
            />

          </div>
      </header>

      {users.length > 0 ? (
        <div className="w-full flex flex-col h-auto">
          <table className="table-auto w-full shadow-md rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gray-100 w-full bg-black font-medium flex flex-row justify-between items-center">
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  Serial
                </th>
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/3">
                  Name
                </th>
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/3">
                  Email
                </th>
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  isAdmin
                </th>
                {IsSuperAdmin &&
                <th className="px-4 py-2 sm:text-2xl md:text-2xl lg:text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent w-1/4">
                  Action
                </th>
                }
              </tr>
            </thead>
            <tbody>
              {filteredUsers.filter(user => user.id !== curuser.uid).map((user) => (
                
                <tr key={user.id} className="w-full flex flex-row justify-center items-center" style={{ boxShadow: '4px 4px 0px rgba(255, 255,255,0.3)', hover: { boxShadow: '0 8px 10px rgba(255, 255,255,1)' } }}>
                  <td className="py-4 w-1/4 text-center text-xs">
                    {user.serial}
                  </td>
                  <td className="py-4 w-1/3 sm:text-base md:text-base text-xs">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 w-1/3 sm:text-base md:text-base text-xs">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 w-1/4 sm:text-base md:text-base text-xs">
                    {user.isAdmin ? 'Yes' : 'No'}
                  </td>{IsSuperAdmin &&
                  <td className="px-4 py-4 w-1/4 sm:text-base md:text-base text-xs">
                    
                    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => {
                      const userRef = doc(firestore, 'Users', user.id);
                      updateDoc(userRef, { isAdmin: !user.isAdmin });
                    }}>
                     {user.isAdmin ? 'Remove Admin' : 'Make Admin'}
                     
                    </button>
                    
                  </td>}
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
