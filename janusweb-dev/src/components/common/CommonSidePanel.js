import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "./SidePanel";

const CommonSidePanel = ({
  close,
  title,
  handleClose,
  body,
}) => {
  return (
      <SidePanel>
        <SidePanelHeader>{title}</SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">{body} </div>
        </SidePanelBody>
        <SidePanelFooter>
          <button className="activity-save-btn" type="submit">
            Submit
          </button>
          <button
            className="activity-cancel-btn"
            type="button"
            onClick={() => {
              close();
              handleClose();
            }}
          >
            Cancel
          </button>
        </SidePanelFooter>
      </SidePanel>
  );
};

export default CommonSidePanel;
