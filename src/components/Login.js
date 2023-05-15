import { useRef , useState , useEffect,useContext} from 'react'
import axios from 'axios';

import AuthContext from '../context/AuthProvider';
import {Link, useLocation, useNavigate} from 'react-router-dom'
import useAuth from '../hooks/useAuth';
import { faLocationPinLock } from '@fortawesome/free-solid-svg-icons';

const Login=()=>{
   const {setAuth} =useAuth();
    
    const navigate=useNavigate();
    const location = useLocation();
    const from=location.state?.from?.pathname || '/';
  
    const userRef=useRef();

    const errRef=useRef();
    const [username ,setUsername] =useState('');
    const [password ,setPassword] =useState('');
    const [errMsg,setErrMsg]=useState();
    
    //to set the focus on first input when the compoent loads
    useEffect(()=>{userRef.current.focus();
        
    },[])
    
     //to  empty out any error message , if user changes username or password
     useEffect(()=>{
        setErrMsg('');

     },[username,password])

     const submitHandler = async (e)=>{
            e.preventDefault();

            console.log(username+''+password);

            try{
            const response = 
            await  axios.post('/login',{username,password});
            console.log(response.data);

            const token  = response?.data.token;
            const roles=response?.data.roles;
            //const roles can also be taken from response.data if you have
            //and add it io Auth object
            setAuth({username,password,roles,token});
            localStorage.setItem('userDetails',JSON.stringify(response.data));
            
            //console.log(`auth object after logging in ${auth.roles} ${auth.username} ${auth.token}`)
            setUsername('')
            setPassword('')
            
           navigate(from, {replace:true});
         // navigate('/');
            }
            catch(err){console.log(err);
            
                 if (!err?.response){
                    console.log('error there but no server response')
                 }
                 else if(!err?.response.status===400){

                    setErrMsg('Missing username or password')
                 }
                 else if(err?.response.status===401){
                    setErrMsg('unauthorized')

                }
                else
                setErrMsg('Login failed')

            errRef.current.focus();

            }
     }

     return (
     
        <section>
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"}
             aria-live="assertive">{errMsg}</p>
             <h1>Sign In</h1>
             <form onSubmit={submitHandler}>

            <label htmlFor='username'>Username</label>
            <input type='text' 
            id='username'
            ref={userRef}
            autoComplete="off"
            onChange={(e)=>setUsername(e.target.value)}
            value={username}
            required
    />
       <label htmlFor='password'>password</label>
            <input
             type='password' 
            id='password'
            autoComplete="off"
            onChange={(e)=>setPassword(e.target.value)}
            value={password}
            required
    />

   <button>Sign In </button>
             </form>
             <p> Need an account<br/>
             <span className='line'>
              
                <Link to="/register">Sign Up</Link>
                </span></p>
        </section>
     )

}


export default Login ;