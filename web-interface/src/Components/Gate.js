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
            <div class="w-1/2">
                <div class="flex items-center justify-center w-full mb-3">
                    <img class="w-[200px] h-[200px]" src='LOGO.png' alt='LOGO'/>
                </div>
                <input 
                    ref={clientIDRef}
                    type="number" 
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
        </>
    )
};

export default Gate;