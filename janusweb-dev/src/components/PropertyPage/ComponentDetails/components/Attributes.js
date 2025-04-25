import React from "react";
import InputBox from "components/common/InputBox";
import { Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";

const Attributes = ({ defaultProps, mdCol, modifyComponent }) => {
  const { t } = useTranslation();
  return (
    <div className="d-flex flex-wrap flex-xl-nowrap">
      <Row>
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={`${t("common.pages.attributes")} 1`}
          id={"attribute_1"}
          value={modifyComponent?.attribute_1}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={`${t("common.pages.attributes")} 2`}
          id={"attribute_2"}
          value={modifyComponent?.attribute_2}
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={`${t("common.pages.attributes")} 3`}
          id={"attribute_3"}
          value={modifyComponent?.attribute_3}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={`${t("common.pages.attributes")} 4`}
          id={"attribute_4"}
          value={modifyComponent?.attribute_4}
        />

        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={`${t("common.pages.attributes")} 5`}
          id={"attribute_5"}
          value={modifyComponent?.attribute_5}
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={`${t("common.pages.attributes")} 6`}
          id={"attribute_6"}
          value={modifyComponent?.attribute_6}
        />
      </Row>
    </div>
  );
};
export default Attributes;
