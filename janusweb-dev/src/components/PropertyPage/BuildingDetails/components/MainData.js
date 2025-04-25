import React, { useEffect, useState } from "react";
import InputBox from "components/common/InputBox";
import { Col, Form, Row } from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import api from "api";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import Geosuggest from "react-geosuggest";

const MainData = ({
  defaultProps,
  newTask,
  modifyBuilding,
  mdCol,
  sidePanel,
  setModifyBuilding,
  onboarding,
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState([]);
  const { propertyChange } = usePropertyContextCheck();
  const [isAddressNotFound, setIsAddressNotFound] = useState(false);

  const getAllUser = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let allprofileUser = await api.get(`/users/adminId/${user?._id}`);
      setUsers(allprofileUser?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSuggestSelect = (suggest) => {
    if (!suggest || !suggest?.placeId) {
      return;
    }
    isAddressNotFound && setIsAddressNotFound(false);

    const geocoder = new window.google.maps.Geocoder();
    // Use Geocoder to get detailed information using placeId
    geocoder.geocode({ placeId: suggest.placeId }, (results, status) => {
      if (status === "OK" && results[0]) {
        // console.log(results[0]);
        const place = results[0];
        const addressComponents = place.address_components;
        const location = place.geometry.location;
        let city = "";
        let zipCode = "";
        let city_added = false;
        //debugger;
        // Loop through address components to find city and postal code

        addressComponents.forEach((component) => {
          if (
            (component.types.includes("locality") ||
              component.types.includes("postal_town")) &&
            !city_added
          ) {
            city = component.long_name;
            city_added = true;
          }

          if (component.types.includes("postal_code")) {
            zipCode = component.long_name;
          }
        });
        // remove city and country from street address
        const formattedAddress = place.formatted_address;
        const addressParts = formattedAddress.split(", ");

        let street_address = addressParts
          .slice(0, addressParts.length - 2)
          .join(", ");
        const prefix = suggest.description.split(",")[0].trim();

        if (!street_address.includes(prefix)) {
          street_address = `${prefix}, ${street_address}`.trim();
        }

        // console.log(
        //   "place in address in building panel",
        //   place,
        //   "prefix",
        //   prefix,
        //   "addressParts",
        //   addressParts,
        //   "street_address",
        //   street_address,
        //   "suggest",
        //   suggest
        //   // "prefixToCheck",
        //   // prefixToCheck
        // );

        defaultProps.handleChange({
          target: { name: "street_address", value: street_address },
        });
        defaultProps.handleChange({
          target: { name: "zip_code", value: `${zipCode}` },
        });
        defaultProps.handleChange({
          target: { name: "city", value: city },
        });
        defaultProps.handleChange({
          target: { name: "longitude", value: `${location.lng()}` },
        });
        defaultProps.handleChange({
          target: { name: "latitude", value: `${location.lat()}` },
        });
        // console.log({
        //   city,
        //   zipCode,
        //   latitude: location.lat(),
        //   longitude: location.lng(),
        // });
      }
    });
  };

  useEffect(() => {
    getAllUser();
  }, []);
  // console.log(
  //   "modifyBuilding?.responsible_user",
  //   modifyBuilding?.responsible_user
  // );
  // Add handler for when no results are found
  const onSuggestNoResults = () => {
    console.log("suggests in noresult");

    !isAddressNotFound && setIsAddressNotFound(true);
  };
  // const onUpdateSuggests = () => {
  //   console.log("suggests in onUpdateSuggests");

  //   !isAddressNotFound && setIsAddressNotFound(true);
  // };

  useEffect(() => {
    if (isAddressNotFound) {
      defaultProps.handleChange({
        target: { name: "zip_code", value: "" },
      });
      defaultProps.handleChange({
        target: { name: "city", value: "" },
      });
      defaultProps.handleChange({
        target: { name: "longitude", value: "" },
      });
      defaultProps.handleChange({
        target: { name: "latitude", value: "" },
      });
    }
  }, [isAddressNotFound]);
  // console.log(
  //   "suggest modifyBuilding?.street_address",
  //   modifyBuilding?.street_address
  // );
  return (
    <Row>
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.property_number")}
        disabled={true}
        id={"property_code"}
        value={onboarding ? modifyBuilding?.property_code : propertyChange}
        // className="drawer_property_number"
        type="number"
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        disabled={newTask ? false : true}
        required={true}
        text={t("property_page.building_code")}
        id={"building_code"}
        value={modifyBuilding?.building_code}
        type="number"
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.building_name")}
        id={"name"}
        required={true}
        value={modifyBuilding?.name}
      />
      <Col md={mdCol || 4}>
        <Form.Group
          controlId="street_address"
          className={sidePanel ? "responsible" : null}
        >
          <Form.Label
            style={{
              fontWeight: "bold",
              fontSize: "15px",
              marginBottom: "1px",
              color: "black",
            }}
          >
            {t("property_page.address")}
          </Form.Label>
          <Geosuggest
            placeholder="-"
            onSuggestSelect={onSuggestSelect}
            onSuggestNoResults={onSuggestNoResults}
            // onUpdateSuggests={onUpdateSuggests}
            className="geosuggest"
            inputClassName="geosuggest-input" // Custom input class
            suggestItemClassName="geosuggest-suggestion" // Custom suggestion class
            suggestItemActiveClassName="active" // Class for active suggestion
            disabled={!sidePanel} // Disable based on sidePanel prop
            initialValue={modifyBuilding?.street_address || ""} // Set the initial value
            value={modifyBuilding?.street_address || ""}
            key={modifyBuilding?.street_address}
            suggestsHiddenClassName="hide"
            highlightMatch={true}
            country="se" // restrict to Sweden only
            renderSuggestItem={(suggest) => {
              // remove country name
              const labelWithoutCountry = suggest.description.endsWith(
                ", Sweden"
              )
                ? suggest.description.slice(0, -8) // Remove the last ", Sweden"
                : suggest.description; // Keep the original if not ending with ", Sweden"
              return <span>{labelWithoutCountry}</span>;
            }}
            fixtures={
              isAddressNotFound
                ? [
                    {
                      label: "Address not found",
                      isCustomNotFound: true,
                      location: null,
                      placeId: null,
                      description: "Address not found",
                      className: "non-clickable-suggestion", // Add custom class
                    },
                  ]
                : []
            }
          />
        </Form.Group>
      </Col>
      {/* <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.address")}
        id={"street_address"}
        value={modifyBuilding?.street_address}
      /> */}
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.zip_code")}
        id={"zip_code"}
        value={modifyBuilding?.zip_code}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.city")}
        id={"city"}
        value={modifyBuilding?.city}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.longitude")}
        id={"longitude"}
        value={modifyBuilding?.longitude}
      />
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.latitude")}
        id={"latitude"}
        value={modifyBuilding?.latitude}
      />
      {/* <InputBox
      {...defaultProps}
      mdCol={mdCol}
      text={t("property_page.geo_fence")}
      id={"geo_fence"}
      value={modifyBuilding?.geo_fence}
    /> */}
      {/* <InputBox
      {...defaultProps}
      mdCol={mdCol}
      text={t("property_page.responsible_user")}
      id={"responsible_user"}
      value={modifyBuilding?.responsible_user}
    /> */}
      <Col md={sidePanel ? 12 : mdCol ? mdCol : null}>
        <Form.Group className={sidePanel ? "responsible" : null}>
          <Form.Label className="maindata_resposible resposible_user">
            {t("property_page.responsible_user")}
          </Form.Label>
          {sidePanel ? (
            // Show dropdown only when sidePanel is true
            <Form.Select
              value={modifyBuilding?.responsible_user?.toLowerCase() || ""}
              id={"responsible_user"}
              onChange={(e) => {
                defaultProps.handleChange({
                  target: { name: "responsible_user", value: e.target.value },
                });
              }}
              className="main_data_form_select"
            >
              <option value={""} disabled>
                -
              </option>
              {users?.map((elem, index) => (
                <option
                  value={elem?.email?.toLowerCase()}
                  key={elem?.email?.toLowerCase() || index}
                >
                  {elem?.email?.toLowerCase()}
                </option>
              ))}
            </Form.Select>
          ) : (
            // Show just the value when sidePanel is false
            <Form.Control
              type="text"
              value={modifyBuilding?.responsible_user?.toLowerCase() || "-"}
              disabled
              className="main_data_form_select"
            />
          )}
        </Form.Group>
      </Col>
      <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.construction_year")}
        id={"construction_year"}
        value={modifyBuilding?.construction_year}
      />
      {/* <InputBox
        {...defaultProps}
        mdCol={mdCol}
        text={t("property_page.start_year")}
        id={"start_year"}
        value={modifyBuilding?.start_year}
        required
      /> */}
    </Row>
  );
};

export default MainData;
