import Modal from "react-modal/lib/components/Modal";

export default function RoomDetail(props) {
    const { onClose, show, room } = props;

    return (
        <Modal
            isOpen={show}
            onRequestClose={onClose}
            contentLabel="My dialog"
            className="mymodal address-modal"
            overlayClassName="myoverlay address-overlay"
            closeTimeoutMS={500}
            ariaHideApp={false}>
            <div className="custome-modal bg-white" id="addSession-modal">
                <div className=" d-flex align-items-center justify-content-between py-2 custom-modal-header mb-4">
                    <div className="text-capitalize m-0 section-title text-secondary">
                        {(room && room._id) && <p> {room.name}</p>}
                    </div>
                    <div
                        className="app-fs-20 app-fw-600 text-right cursor-pointer "
                        onClick={onClose}>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="close-btn"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24">
                            <path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z" />
                        </svg>
                    </div>
                </div>
                <div className=" custom-modal-body">
                    <div className="row">
                        <div className="col-lg-12 col-xl-12 col-sm-12 p-0">
                            {room.image && < div className="d-flex form-group align-items-center">
                                <img src={room.image} height="100" width="100%" />
                            </div>}
                            <div className="d-flex form-group align-items-center">
                                <span className="text-primary">{room.description}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Modal >
    );
}
