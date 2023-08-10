import { useEffect, useState } from 'react';

import apiClient, {CanceledError} from "./services/api-client";

import ProductList from './components/ProductList';

interface User {
  id: number,
  name: string,
}

const App = () => {
const [category, setCategory] = useState('')


// feacting data
const [users, setUsers] =useState <User []> ([]);
const [error, SetError] = useState('');
const[isLoading, setLoading ] = useState(false);

useEffect(() => {
  const controller = new AbortController();
  setLoading(true);
  
apiClient
.get<User[]> ('/users')

.then((res) => {
   setUsers(res.data);
   setLoading(false);
  })
  

.catch((err) =>{ 
  if (err instanceof CanceledError) return;
SetError(err.message)
setLoading(false)
});

return () => controller.abort();
}, [])


const deleteUser =(user: User) => {
const orginalUser =[...users];

   setUsers(users.filter(u => u.id !== user.id));
   apiClient
   .delete('/users/' + user.id)
   .catch(err => {
    SetError(err.message);
    setUsers(orginalUser);
   })
}
//adduser to  giving users
const addUser =() => {
  const originalUsers = [... users];
  const newUser = {id: 0, name:'Emma'}
  setUsers([ newUser, ...users, ]);
  
  apiClient
  .post('/users', newUser)
.then(({data: savedUser}) => setUsers([savedUser, ...users]))
.catch(err => {
  SetError(err.message);
  setUsers(originalUsers)
})
} 

// update user it update this(!!!)
const updateUser =(user: User) => {
  const updatedUser = {...user, name:user.name + '!'};
  setUsers(users.map(u => u.id ? updatedUser : u));

  apiClient
  .patch('/users/' + user.id, updateUser);
   
}

  return (
    <>
   { error && <p className='text-danger'>{error}</p>}
   { isLoading && <div className="spinner-border"></div>}

      <button className="btn btn-primary mb-3" onClick={addUser}>Add</button>
    <ul className='list-group'>
      {users.map((user) =>( 
        
         <li key={user.id} className='list-group-item d-flex justify-content-between'>
        {user.name}
        <div>
        <button className="btn btn-outline-secondary mx-2"onClick={() => updateUser(user )}>Update</button>
       <button className="btn btn-outline-danger" onClick={() => deleteUser(user)}>Delete</button>
      </div>
       </li>
       ))}   
    </ul>
    <div>
      <select  className="form-select" onChange={(e) => setCategory(e.target.value)}>

    <option value=""></option>
    <option value="Clothing">Clothing</option>
    <option value="Household">Household</option>
      </select>
      <ProductList  category={category}/>
    </div>
    </>
  )
}

export default App;

