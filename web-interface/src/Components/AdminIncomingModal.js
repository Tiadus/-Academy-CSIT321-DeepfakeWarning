import Modal from 'react-bootstrap/Modal';

function AdminIncomingModal(props) {
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
                id="microphone-button"
                onClick={() => {
                    props.handleReceiveCall('accept', 'mic');
                }}
            >
                <span>Answer With Microphone</span>
            </button>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center mt-3">
            <button 
                type="button" 
                class="btn btn-success btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="audio-file-button"
                onClick={() => {
                    props.handleReceiveCall('accept', 'file', 'real');
                }}
            >
                <span>Answer With Real Audio File</span>
            </button>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center mt-3">
            <button 
                type="button" 
                class="btn btn-info btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="audio-file-button"
                onClick={() => {
                    props.handleReceiveCall('accept', 'file', 'deepfake');
                }}
            >
                <span>Answer With Deepfake Audio File</span>
            </button>
        </div>
        <div class="col-12 d-flex justify-content-center align-items-center mt-3">
            <button 
                type="button" 
                class="btn btn-danger btn-lg btn-group d-flex justify-content-center align-items-center" 
                style={{width: '85%', textAlign: 'center', clear: 'left'}}
                id="decline-button"
                onClick={() => {
                    props.handleReceiveCall('decline')
                }}
            >
                <span>Decline</span>
            </button>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default AdminIncomingModal;