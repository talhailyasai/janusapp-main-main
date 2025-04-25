import { Modal } from "@themesberg/react-bootstrap";
import React from "react";

const VedioModal = ({ show, onClose, onShow, source }) => {
  return (
    <Modal show={show} onHide={onShow} centered className="video_modal_main">
      <Modal.Body>
        <div className="video_inner">
          <video width="600" height="400" controls autoPlay>
            <source src={source} type="video/mp4" />
          </video>

          <div className="close_btn_main">
            <span class="material-symbols-outlined" onClick={onClose}>
              close
            </span>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default VedioModal;
