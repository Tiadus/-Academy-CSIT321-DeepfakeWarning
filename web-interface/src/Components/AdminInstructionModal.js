import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AdminInstructionModal(props) {
  return (
    <Modal
        show={props.show}
        onHide={props.onHide}
        backdrop="static"
        keyboard={false}
        centered
    >
    <Modal.Header closeButton>
        <Modal.Title>Admin Interface Instruction</Modal.Title>
    </Modal.Header>
    <Modal.Body>
        This interface is used to test the core feature of the application which is real time calling deepfake analysis.
        To start, choose an identifer and connect as an admin. We recommend to choose the identifier '0' to not be duplicated 
        with existing client if any.
    </Modal.Body>
    <Modal.Footer>
        <Button variant="primary" onClick={() => {props.onHide()}}>Understood</Button>
    </Modal.Footer>
    </Modal>
  );
}

export default AdminInstructionModal;