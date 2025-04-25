import { useState, useEffect } from "react";

export function ModalRoot() {
  const [modal, setModal] = useState({});

  /*
   * useEffect will run when the component renders, which might be more times than you think.
   * 2nd arg = If present, effect will only activate if the values in the list change.
   */
  useEffect(() => {
    ModalService.on("open", ({ component, props }) => {
      setModal({
        component,
        props,
        close: () => {
          setModal({});
        },
      });
    });
  }, []);

  const ModalComponent = modal.component ? modal.component : null;

  return (
    <section className={modal.component ? "modalRoot" : ""}>
      {ModalComponent && (
        <ModalComponent
          {...modal.props}
          close={modal.close}
          className={ModalComponent ? "d-block" : ""}
        />
      )}
    </section>
  );
}
export function Modal(props) {
  return (
    <div className="modal d-block">
      <div className="modal-dialog mt-10-percent">
        <div className="modal-content">{props.children}</div>
      </div>
    </div>
  );
}
export function ModalBody(props) {
  return <div className="modal-body">{props.children}</div>;
}
export function ModalHeader(props) {
  return <div className="modal-header">{props.children}</div>;
}
export function ModalFooter(props) {
  return <div className="modal-footer">{props.children}</div>;
}
export const ModalService = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  open(component, props = {}) {
    document.dispatchEvent(
      new CustomEvent("open", { detail: { component, props } })
    );
  },
};
