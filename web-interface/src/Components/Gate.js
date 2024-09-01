import { useState } from 'react';
import AdminInstructionModal from './AdminInstructionModal';
import axios from 'axios';

const Gate = ({setUser}) => {
    const [userEmail, onChangeUserEmail] = useState('');
    const [userPassword, onChangeUserPassword] = useState('');
    const [modalShow, setModalShow] = useState(false);

    const handleLogin = async () => {
        if (userEmail === '' || userPassword === '') {
            alert('Please Input All Credential');
        }
    
        const encodedAuthentication = btoa(userEmail + ':' + userPassword);
        const auth = `Basic ${encodedAuthentication}`
    
        try{
          const loginResult = await axios.post('http://localhost:4000/api/login', {}, {
            headers: {
              'Authorization': auth,
              'Content-Type': 'application/json'
            }
          });
    
          const user = loginResult.data;
          user.user_id = loginResult.data.user_id.toString();
          user.auth = auth;
          
          setUser(user);
        } catch(error) {
          if (error.response && error.response.status) {
            let errorMessage = error.response.data.error;
            alert(errorMessage);
            return;
          } else {
            console.log(error);
          }
        }
      }

    return (
        <>
            <AdminInstructionModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
            <div class="w-1/2">
                <div class="flex items-center justify-center w-full mb-3">
                    <img class="w-[200px] h-[200px]" src='LOGO.png' alt='LOGO'/>
                </div>
                <input 
                    value={userEmail}
                    onChange={(e) => {onChangeUserEmail(e.target.value)}}
                    type="text" 
                    class="form-control mb-3" 
                    style={{textAlign: 'center', borderColor: 'black', borderWidth: '3px', borderStyle: 'solid', borderRadius: '30px'}} 
                    placeholder="Enter Email"
                />
                <input 
                    value={userPassword}
                    onChange={(e) => {onChangeUserPassword(e.target.value)}}
                    type="password" 
                    class="form-control mb-3" 
                    style={{textAlign: 'center', borderColor: 'black', borderWidth: '3px', borderStyle: 'solid', borderRadius: '30px'}} 
                    placeholder="Enter Password"
                />
                <div class="d-flex justify-content-center align-items-center mb-3">
                    <button 
                        class="btn btn-success btn-lg btn-group d-flex justify-content-center align-items-center" 
                        onClick={handleLogin}
                    >
                        CONNECT AS USER
                    </button>
                </div>
                <div class="d-flex justify-content-center align-items-center">
                    <button 
                        class="btn btn-info btn-lg btn-group d-flex justify-content-center align-items-center" 
                        onClick={() => {
                            setModalShow(true);
                        }}
                    >
                        Instruction
                    </button>
                </div>
            </div>
        </>
    )
};

export default Gate;