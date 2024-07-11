import { useRef } from 'react';

const Gate = ({setClientID}) => {
    const clientIDRef = useRef(null);

    const handleLogin = async () => {
        setClientID(clientIDRef.current.value);
    }

    return (
        <div>
            <h1>Login Portal</h1>
            <span>Client ID:</span>
            <input ref={clientIDRef} type="number"/>
            <br/>
            <button onClick={handleLogin}>Login</button>
        </div>
    )
};

export default Gate;