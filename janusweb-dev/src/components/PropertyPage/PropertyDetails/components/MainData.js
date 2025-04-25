import React, { useEffect, useState } from "react";
import InputBox from "components/common/InputBox";
import { Col, Form, Row, Table } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "api";
import { Link } from "react-router-dom";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";

const MainData = ({
  defaultProps,
  newTask,
  modifyProperty,
  mdCol,
  buildingsData,
  sidePanel,
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const [curUser, setCurUser] = useState(null);
  const { setBuildingChange, setBuildingObj, windowDimension } =
    usePropertyContextCheck();
  const getAllUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let allprofileUser = await api.get(`/users/adminId/${user?._id}`);
      setUsers(allprofileUser?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCurrentUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let res = await api.get(`/users/${user?._id}`);
      setCurUser(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUser();
    getCurrentUser();
  }, []);

  const handleSetBuilding = (building) => {
    setBuildingObj(building);
    setBuildingChange(building.building_code);
    localStorage.setItem("building", building?.building_code);
    localStorage.setItem("buildingObj", JSON.stringify(building));
  };

  return (
    <>
      <Row>
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.property_number")}
          required={true}
          disabled={newTask ? false : true}
          id={"property_code"}
          value={modifyProperty?.property_code}
          className="drawer_property_number"
          type="number"
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.legal_name")}
          id={"legal_name"}
          required={true}
          value={modifyProperty?.legal_name}
          className="drawer_property_number"
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.name")}
          id={"name"}
          required={true}
          value={modifyProperty?.name}
          className="drawer_property_number"
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.address")}
          id={"street_address"}
          value={modifyProperty?.street_address}
          className="drawer_property_number"
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.zip_code")}
          id={"zip_code"}
          value={modifyProperty?.zip_code}
          className="drawer_property_number"
        />
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.city")}
          id={"postal_address"}
          value={modifyProperty?.postal_address}
          className="drawer_property_number"
        />
        {/* <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.longitude")}
          id={"longitude"}
          value={modifyProperty?.longitude}
        /> */}
        {/* <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.latitude")}
          id={"latitude"}
          value={modifyProperty?.latitude}
        /> */}
        {/* <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.responsible_user")}
          id={"responsible_user"}
          value={modifyProperty?.responsible_user}
        /> */}
        {sidePanel ? (
          <Col md={sidePanel ? 12 : mdCol}>
            <Form.Group className={sidePanel ? "responsible" : null}>
              <Form.Label className="maindata_resposible resposible_user">
                {t("property_page.responsible_user")}
              </Form.Label>
              <Form.Select
                value={modifyProperty?.responsible_user || ""}
                id={"responsible_user"}
                // {...defaultProps}
                onChange={(e) => {
                  defaultProps.handleChange({
                    target: { name: "responsible_user", value: e.target.value },
                  });
                }}
                disabled={sidePanel ? false : true}
                className={`main_data_form_select drawer_property_number ${
                  !sidePanel ? "select-no-arrow" : ""
                }`}
              >
                <option value={""} disabled>
                  -
                </option>

                {users?.map((elem) => {
                  return (
                    <option value={elem?.email?.toLowerCase()}>
                      {elem?.email}
                    </option>
                  );
                })}
              </Form.Select>
            </Form.Group>
          </Col>
        ) : (
          <InputBox
            // {...defaultProps}
            mdCol={mdCol}
            text={t("property_page.responsible_user")}
            id={"responsible_user"}
            value={modifyProperty?.responsible_user || ""}
            disabled={true}
            className="drawer_property_number"
          />
        )}
        {/* <Col md={sidePanel ? 12 : 6}>
        <Form.Group className={sidePanel ? "responsible" : null}>
          <Form.Label className="maindata_resposible resposible_user">
            {t("property_page.responsible_user")}
          </Form.Label>
          <Form.Select
            value={modifyBuilding?.responsible_user || ""}
            id={"responsible_user"}
            onChange={(e) => {
              defaultProps.handleChange({
                target: { name: "responsible_user", value: e.target.value },
              });
            }}
            disabled={sidePanel ? false : true}
            className="main_data_form_select"
          >
            <option value={""} disabled>
              -
            </option>

            {users?.map((elem) => {
              return (
                <option value={elem?.email?.toLowerCase()}>
                  {elem?.email}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>
      </Col> */}
        {curUser?.plan === "Enterprise" && (
          <>
            <InputBox
              {...defaultProps}
              mdCol={mdCol}
              text={t("property_page.administrative_area")}
              id={"administrative_area"}
              value={modifyProperty?.administrative_area}
            />
            <InputBox
              {...defaultProps}
              mdCol={mdCol}
              text={t("property_page.operations_area")}
              id={"maintenance_area"}
              value={modifyProperty?.maintenance_area}
            />
            <InputBox
              {...defaultProps}
              mdCol={mdCol}
              text={t("property_page.area")}
              type="number"
              id={"sum_area_heating"}
              value={modifyProperty?.sum_area_heating}
            />
            <InputBox
              {...defaultProps}
              mdCol={mdCol}
              text={t("property_page.owner")}
              id={"owner"}
              type="number"
              value={modifyProperty?.owner}
            />
          </>
        )}
        {/* <div className={`col-md-${mdCol || 4}`}></div> */}
        {/* <div className={`col-md-${mdCol || 4}`}></div> */}
        <InputBox
          {...defaultProps}
          mdCol={mdCol}
          text={t("property_page.geo_fence")}
          id={"geo_fence"}
          value={modifyProperty?.geo_fence}
          className="drawer_property_number"
        />
      </Row>
      {!newTask && (
        <div
          style={{
            maxWidth: "75%",
            minWidth: "300px",
          }}
        >
          <label
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              marginBottom: "1px",
              color: "black",
            }}
          >
            {t("property_page.buildings")}
          </label>
          <div
            className="property-building-box property_buildings_table"
            style={{ marginTop: "0" }}
          >
            <Table bordered hover>
              <thead>
                {buildingsData?.map((item, i) => (
                  <tr>
                    <th>
                      <Link
                        to={"/property"}
                        onClick={() => handleSetBuilding(item)}
                        className="planning_component_code"
                      >
                        {item?.building_code}
                      </Link>
                    </th>
                    <th>
                      <Link
                        to={"/property"}
                        onClick={() => handleSetBuilding(item)}
                        className="planning_component_code"
                      >
                        {item?.name}
                      </Link>
                    </th>
                  </tr>
                ))}
              </thead>
            </Table>
          </div>
        </div>
      )}
    </>
  );
};

export default MainData;
