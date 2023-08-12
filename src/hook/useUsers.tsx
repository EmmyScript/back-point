import { useEffect, useState } from "react";
import userServices, { User } from "../services/user-services";
import { CanceledError } from "../services/api-client";

const useUsers =() => {

const [users, setUsers] =useState <User []> ([]);
const [error, SetError] = useState('');
const[isLoading, setLoading ] = useState(false);

useEffect(() => {
 
  setLoading(true);
  userServices
  const {request, cancel} = userServices.getAllUsers();
request.then((res) => {
   setUsers(res.data);
   setLoading(false);
  })
  

.catch((err) =>{ 
  if (err instanceof CanceledError) return;
SetError(err.message)
setLoading(false)
});

return () => cancel();
}, []);
return{users, error, isLoading, setUsers, SetError};

}

export default useUsers;