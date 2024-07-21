import Modal from 'react-bootstrap/Modal';

function AdminIncallModal(props) {
  return (
    <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        keyboard={false}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
    >
      <Modal.Body>
        <div class="col-12 d-flex justify-content-center align-items-center mb-3" style={{fontSize: '24px', fontWeight: 'bold'}}>
            {props.status}
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center">
            <button 
                type="button" 
                class="btn btn-primary btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="hangup-button"
                onClick={() => {
                    props.switchToMic()
                }}
                disabled={props.status === 'Ringing' || props.audioInputType === 'mic'}
            >
                <span>Switch To Microphone</span>
            </button>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center mt-3">
            <button 
                type="button" 
                class="btn btn-info btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="hangup-button"
                onClick={() => {
                    props.switchToFile()
                }}
                disabled={props.status === 'Ringing' || props.audioInputType === 'file'}
            >
                <span>Switch To Audio File</span>
            </button>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center mt-3">
            <button 
                type="button" 
                class="btn btn-danger btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="hangup-button"
                onClick={() => {
                    props.endCall()
                }}
            >
                <span>Hangup</span>
            </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AdminIncallModal;