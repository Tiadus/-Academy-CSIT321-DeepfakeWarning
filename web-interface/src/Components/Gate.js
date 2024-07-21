import { useRef, useState } from 'react';
import AdminInstructionModal from './AdminInstructionModal';

const Gate = ({setClientID}) => {
    const clientIDRef = useRef(null);
    const [modalShow, setModalShow] = useState(false);

    const handleLogin = async () => {
        const clientID = clientIDRef.current.value;
        if (isNaN(clientID) === false) {
            if (parseInt(clientID) >= 0) {
                setClientID(clientID);
            } else {
                alert('Invalid Value - Must Be Bigger Or Equal To 0')
            }
        } else if (isNaN(clientID) === true) {
            alert('Invalid Input - Must Be A Number');
        }
    }

    return (
        <>
            <AdminInstructionModal
                show={modalShow}
                onHide={() => setModalShow(false)}
            />
            <div class="d-flex justify-content-center align-items-center" style={{width: '50%', height: '50%'}}>
                <div style={{width: '100%'}}>
                    <div class="mb-3" style={{textAlign: "center"}}>
                        <img style={{width: '40%', height: "40%"}} src='LOGO.png' alt='LOGO'/>
                    </div>
                    <input 
                        ref={clientIDRef}
                        type="text" 
                        id="inputField" 
                        class="form-control mb-3" 
                        style={{textAlign: 'center', borderColor: 'black', borderWidth: '3px', borderStyle: 'solid', borderRadius: '30px'}} 
                        placeholder="Enter An Identifier"
                    />
                    <div class="d-flex justify-content-center align-items-center mb-3">
                        <button 
                            class="btn btn-success btn-lg btn-group d-flex justify-content-center align-items-center" 
                            onClick={handleLogin}
                        >
                            CONNECT AS ADMIN
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
            </div>
        </>
    )
};

export default Gate;