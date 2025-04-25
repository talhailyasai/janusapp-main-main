import { useState, useEffect } from "react";

export function SidePanelRoot(props) {
  const [SidePanel, setSidePanel] = useState({});

  /*
   * useEffect will run when the component renders, which might be more times than you think.
   * 2nd arg = If present, effect will only activate if the values in the list change.
   */
  useEffect(() => {
    SidePanelService.on("open", ({ component, props }) => {
      setSidePanel({
        component,
        props,
        close: () => {
          setSidePanel({});
        },
      });
    });
  }, []);

  const SidePanelComponent = SidePanel.component ? SidePanel.component : null;

  return (
    <section
      className={SidePanel.component ? "sidepanel-root" : ""}
      style={{ ...props.style }}
    >
      {SidePanelComponent && (
        <SidePanelComponent
          {...SidePanel.props}
          close={SidePanel.close}
          className={SidePanelComponent ? "d-block" : ""}
        />
      )}
      {SidePanel.component && <div className="sidepanel-overlay" />}
    </section>
  );
}
export function SidePanel(props) {
  return (
    <div className="sidepanel d-block">
      <div className="sidepanel-dialog mt-10-percent">
        <div className="sidepanel-content">{props.children}</div>
      </div>
    </div>
  );
}
export function SidePanelBody(props) {
  return <div className="sidepanel-body">{props.children}</div>;
}
export function SidePanelHeader(props) {
  return <div className="sidepanel-header">{props.children}</div>;
}
export function SidePanelFooter(props) {
  return <div className="sidepanel-footer">{props.children}</div>;
}
export const SidePanelService = {
  on(event, callback) {
    document.addEventListener(event, (e) => callback(e.detail));
  },
  open(component, props = {}) {
    document.dispatchEvent(
      new CustomEvent("open", { detail: { component, props } })
    );
  },
};
