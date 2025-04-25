import { Form } from "@themesberg/react-bootstrap";
import React, { useState } from "react";
import {
  SidePanel,
  SidePanelBody,
  SidePanelFooter,
  SidePanelHeader,
} from "components/common/SidePanel";
import Button from "components/common/Button";
import { useTranslation } from "react-i18next";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

const MyProfileSidePanel = ({
  handleSubmit,
  close,
  initalVal,
  newTask,
  handleClose,
  disabledBtn,
}) => {
  const [modifyUser, setModifyUser] = useState(initalVal);
  const [passwordType, setPasswordType] = useState("password");

  const { t } = useTranslation();

  const handleChange = (e) => {
    setModifyUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e, modifyUser);
        handleClose && handleClose();
        close && close();
      }}
    >
      <SidePanel>
        <SidePanelHeader>
          {initalVal ? t("common.pages.modify") : t("common.pages.new")}
          {t("common.pages.user")}
        </SidePanelHeader>
        <SidePanelBody>
          <div className="activity-input-container">
            <Form.Group>
              <Form.Label>{t("common.pages.Email")}</Form.Label>
              <Form.Control
                name="email"
                type="email"
                required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyUser?.email}
                autoComplete="off"
              />
            </Form.Group>
            {/* {!initalVal && ( */}
            <Form.Group>
              <Form.Label>{t("common.pages.Password")}</Form.Label>
              <div style={{ position: "relative", display: "flex" }}>
                <Form.Control
                  name="password"
                  type={passwordType}
                  required={!initalVal ? true : false}
                  placeholder={"-"}
                  onChange={handleChange}
                  value={modifyUser?.password}
                  autoComplete="off"
                />
                {passwordType == "text" ? (
                  <AiFillEyeInvisible
                    className="passwordEye"
                    onClick={() => setPasswordType("password")}
                  />
                ) : (
                  <AiFillEye
                    onClick={() => setPasswordType("text")}
                    className="passwordEye"
                  />
                )}
              </div>
            </Form.Group>
            {/* )} */}

            <Form.Group>
              <Form.Label>{t("property_page.name")}</Form.Label>
              <Form.Control
                name="name"
                type="text"
                // required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyUser?.name}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>{t("data_settings.phone")}</Form.Label>
              <Form.Control
                name="mobile_phone"
                type="number"
                // required={true}
                placeholder={"-"}
                onChange={handleChange}
                value={modifyUser?.mobile_phone}
                autoComplete="off"
              />
            </Form.Group>
          </div>
        </SidePanelBody>
        <SidePanelFooter>
          <Button main type="submit">
            {t("planning_page.submit")}
          </Button>
          <Button
            secondary
            type="button"
            onClick={() => {
              handleClose();
            }}
          >
            {t("planning_page.cancel")}
          </Button>
        </SidePanelFooter>
      </SidePanel>
    </Form>
  );
};

export default MyProfileSidePanel;
