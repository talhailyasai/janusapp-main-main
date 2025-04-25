import React, { useRef } from "react";
import GoogleMapReact from "google-map-react";
import { useState } from "react";
import { useEffect } from "react";
import api from "api";
import { Form, Table, Modal, Button } from "@themesberg/react-bootstrap";
import Popup from "reactjs-popup";
import { Link, useHistory } from "react-router-dom";
import buildingImg from "../../../assets/img/pages/building.png";
import { t } from "i18next";
import Filter from "../Planning/PlanningFilter";
import Loader from "components/common/Loader";

let apiKey = process.env.REACT_APP_GOOGLE_MAP_API_KEY;
const FollowUp = () => {
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [allBuildings, setAllBuildings] = useState([]);
  const [dupBuildings, setDupBuildings] = useState([]);
  const [toggle, setToggle] = useState("week");
  const [checkedPins, setCheckedPins] = useState(["red", "yellow", "black"]);
  const [loading, setLoading] = useState(false);

  const [filterValues, setFilterValues] = useState({});
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();
  const isFirstRender = useRef(true);

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
  };

  const customStyles = [
    {
      elementType: "labels",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      featureType: "administrative.neighborhood",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
  ];

  const handlePinChange = (e, pinColor) => {
    let cPins;
    let value = e.target.checked;
    if (value) {
      cPins = [...checkedPins, pinColor];
      setCheckedPins(cPins);
    } else {
      cPins = checkedPins?.filter((el) => el !== pinColor);
      setCheckedPins(cPins);
    }
    setAllBuildings(
      dupBuildings?.filter((el) => cPins.includes(el?.buildingStatus))
    );
  };

  const handleShowProperty = async (value, comp) => {
    try {
      localStorage.setItem("property", value?.property_code?.property_code);
      localStorage.setItem("building", value?.building_code);
      localStorage.setItem("component", comp?.component_code);
    } catch (error) {
      console.log(error);
    }
  };

  const hasValidCoordinates = (buildings) => {
    if (!buildings || buildings.length === 0) return false;

    // Loop through all buildings
    return buildings.some((building) => {
      // Get latitude and longitude
      const lat = parseFloat(building?.latitude);
      const lng = parseFloat(building?.longitude);

      // Check if coordinates exist and are valid numbers
      if (isNaN(lat) || isNaN(lng)) return false;

      // Check if coordinates are within valid Earth ranges
      // Latitude: -90 to 90
      // Longitude: -180 to 180
      if (lat < -90 || lat > 90) return false;
      if (lng < -180 || lng > 180) return false;

      // Check if coordinates are not 0,0 (null island)
      if (lat === 0 && lng === 0) return false;

      return true;
    });
  };

  const getBuildings = async (isLoading, filter) => {
    try {
      isLoading && setLoading(isLoading);
      let buildings = await api.get(
        `/buildings/withComps/followup?toggle=${toggle}`
      );
      let filteredBuildings = buildings?.data;

      if (filterValues && Object.keys(filterValues).length > 0) {
        filteredBuildings = filterBuildingsData(buildings?.data, filterValues);
      }

      // Check if any building has valid coordinates
      const hasValidLocations = hasValidCoordinates(filteredBuildings);

      if (!hasValidLocations && isFirstRender.current) {
        setShowModal(true);
        isFirstRender.current = false;
      }

      setAllBuildings(filteredBuildings);
      setDupBuildings(filteredBuildings);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleToogle = () => {
    toggle === "week" ? setToggle("month") : setToggle("week");
  };

  useEffect(() => {
    getBuildings(true);
  }, [toggle]);

  // 2. Add a function to filter buildings based on filterValues
  const filterBuildingsData = (buildings, filters) => {
    if (!filters || Object.keys(filters).length === 0) {
      return buildings;
    }

    const { property_code, responsible_user } = filters;

    return (
      buildings
        .filter((building) => {
          if (property_code?.length) {
            return property_code.includes(
              building.property_code?.property_code
            );
          }
          return building;
        })
        .map((building) => {
          if (responsible_user?.length) {
            // Create a new building object with filtered components
            return {
              ...building,
              components: building.components?.filter((comp) =>
                responsible_user.includes(comp.responsible_user?.toLowerCase())
              ),
            };
          }
          return building;
        })
        // Remove buildings that have no components after filtering
        .filter((building) => building.components?.length > 0)
    );
  };
  // Filter Code
  const handleFindClick = async () => {
    try {
      // setLoading(true);

      // Get fresh data from API
      const freshBuildings = await getBuildings(true, true);

      // Apply filters if they exis
    } catch (error) {
      console.log("Error in handleFindClick:", error);
    }
  };

  // Instead, call handleFindClick when toggle changes
  // useEffect(() => {
  //   handleFindClick();
  // }, [toggle]);
  // const handleLatAndLng = (type) => {
  //   if (type === "lat") {
  //     return allBuildings?.length > 0
  //       ? Number(allBuildings[0]?.latitude)
  //       : 67.8601759249178;
  //   } else {
  //     return allBuildings?.length > 0
  //       ? Number(allBuildings[0]?.longitude)
  //       : 20.226174445382792;
  //   }
  // };
  const handleLatAndLng = (type) => {
    if (allBuildings?.length > 0) {
      const coordinate =
        type === "lat" ? allBuildings[0]?.latitude : allBuildings[0]?.longitude;
      return parseFloat(coordinate) || 67.8601759249178; // Default latitude
    }
    return type === "lat" ? 67.8601759249178 : 20.226174445382792; // Default center
  };
  // ... existing state variables ...
  const [userLocation, setUserLocation] = useState({
    lat: 59.3293, // Default coordinates (Stockholm)
    lng: 18.0686,
  });
  const [hasUserLocation, setHasUserLocation] = useState(false);

  // Add this useEffect to get user's location
  useEffect(() => {
    if (!dupBuildings?.length) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            setHasUserLocation(true);
          },
          (error) => {
            console.log("Error getting location:", error);
          }
        );
      }
    }
  }, [dupBuildings]);

  const handleUpdateBuildings = () => {
    history.push("/property");
    setShowModal(false);
  };

  if (loading) return <Loader />;

  return (
    <>
      <Filter
        handleFindClick={handleFindClick}
        filterValues={filterValues}
        setFilterValues={setFilterValues}
      />
      <div className="mapMain">
        {allBuildings?.length > 0 ? (
          <div className="mapLeft">
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              // defaultCenter={{ lat: 67.8601759249178, lng: 20.226174445382792 }}
              defaultCenter={{
                lat: handleLatAndLng("lat"),
                lng: handleLatAndLng("lng"),
              }}
              defaultZoom={13}
              options={{ styles: customStyles }}
            >
              {allBuildings
                ?.filter(
                  (building) =>
                    !isNaN(parseFloat(building.latitude)) &&
                    !isNaN(parseFloat(building.longitude))
                )
                .map((building, index) => (
                  <Popup
                    className="superVisionPopup"
                    key={index}
                    lat={building.latitude}
                    lng={building.longitude}
                    trigger={
                      <div
                        className={`pin c_${building?.buildingStatus}`}
                        onClick={() => handleMarkerClick(building)}
                        // number={index + 1}
                      >
                        <span>{building?.components?.length}</span>
                      </div>
                    }
                    position="right top"
                    on="click"
                    closeOnDocumentClick
                    mouseLeaveDelay={300}
                    mouseEnterDelay={0}
                    contentStyle={{ padding: "0px", border: "none" }}
                    arrow={true}
                  >
                    <div className="superVisionPopup">
                      <div className="popup_header">
                        <div
                          className="buildingImg"
                          style={{ width: "8rem", height: "5rem" }}
                        >
                          {building?.image?.link ? (
                            <img
                              src={building?.image?.link}
                              alt="building Img"
                              style={{ height: "100%" }}
                            />
                          ) : (
                            <span class="material-symbols-outlined supervision_home_icon">
                              home
                            </span>
                          )}
                        </div>
                        <div className="buildingDetails">
                          <h6 className="popup-buildCode">
                            {building?.building_code}
                          </h6>
                          <h6 className="popup-buildName">{building?.name}</h6>
                        </div>
                      </div>

                      <hr style={{ marginTop: "0px", marginBottom: "0px" }} />
                      <Table borderless>
                        <tbody>
                          {building?.components?.map((comp) => {
                            return (
                              <tr>
                                <td>
                                  <Link
                                    to={"/property"}
                                    onClick={() =>
                                      handleShowProperty(building, comp)
                                    }
                                    className="planning_component_code"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    {comp?.component_code}
                                  </Link>
                                </td>
                                <td className="popup_table_data">
                                  {comp?.name}
                                </td>
                                <td className="popup_table_data">
                                  {comp?.u_system}
                                </td>
                                <td>
                                  <div
                                    className={`compStatus c_${comp?.deviationStatus}`}
                                  ></div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                    </div>
                  </Popup>
                ))}
            </GoogleMapReact>
          </div>
        ) : (
          <div className="mapLeft">
            <GoogleMapReact
              bootstrapURLKeys={{ key: apiKey }}
              defaultCenter={{
                lat: 59.3293,
                lng: 18.0686,
              }}
              defaultZoom={13}
              options={{ styles: customStyles }}
              onGoogleApiLoaded={({ map, maps }) => {
                if ("geolocation" in navigator) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const userLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      };
                      map.setCenter(userLocation);

                      const geocoder = new maps.Geocoder();

                      geocoder.geocode(
                        { location: userLocation },
                        (results, status) => {
                          if (status === "OK" && results[0]) {
                            // Create smaller, styled info window
                            const infoWindow = new maps.InfoWindow({
                              content: `
                        <div style="
                          padding: 5px 10px;
                          max-width: 200px;
                          font-size: 12px;
                          font-family: Arial, sans-serif;
                        ">
                          <div style="
                            font-weight: bold;
                            margin-bottom: 3px;
                            color: #333;
                          ">Your Location</div>
                          <div style="color: #666;">
                            ${results[0].formatted_address}
                          </div>
                        </div>
                      `,
                              pixelOffset: new maps.Size(0, -5),
                              disableAutoPan: true,
                            });

                            const marker = new maps.Marker({
                              position: userLocation,
                              map,
                              icon: {
                                path: maps.SymbolPath.CIRCLE,
                                scale: 7,
                                fillColor: "#4285F4",
                                fillOpacity: 1,
                                strokeColor: "white",
                                strokeWeight: 2,
                              },
                              title: "Your Location",
                            });

                            // Add hover listeners
                            marker.addListener("mouseover", () => {
                              infoWindow.open(map, marker);
                            });

                            marker.addListener("mouseout", () => {
                              infoWindow.close();
                            });
                          }
                        }
                      );
                    },
                    (error) => {
                      console.log("Error getting location:", error);
                    }
                  );
                }
              }}
            />
          </div>
        )}
        <div className="mapRight">
          <div className="mt-2 follow_up_map_pin">
            <div className="pinCheck">
              <input
                className="form-check-input pinCheckMap"
                type="checkbox"
                onChange={(e) => handlePinChange(e, "black")}
                checked={checkedPins.includes("black")}
              />
              <div className="pin c_black">
                <span>
                  {
                    dupBuildings?.filter((el) => el?.buildingStatus === "black")
                      ?.length
                  }
                </span>
              </div>
            </div>
            <div className="pinCheck">
              <input
                className="form-check-input pinCheckMap"
                type="checkbox"
                onChange={(e) => handlePinChange(e, "yellow")}
                checked={checkedPins.includes("yellow")}
              />
              <div className="pin c_yellow">
                <span>
                  {
                    dupBuildings?.filter(
                      (el) => el?.buildingStatus === "yellow"
                    )?.length
                  }
                </span>
              </div>
            </div>
            <div className="pinCheck">
              <input
                className="form-check-input pinCheckMap"
                type="checkbox"
                onChange={(e) => handlePinChange(e, "red")}
                checked={checkedPins.includes("red")}
              />
              <div className="pin c_red">
                <span>
                  {" "}
                  {
                    dupBuildings?.filter((el) => el?.buildingStatus === "red")
                      ?.length
                  }
                </span>
              </div>
            </div>
          </div>
          <div className="mt-2 d-flex">
            <span
              style={{ marginRight: "0.5rem" }}
              className="planning_filter_select"
            >
              {t("property_page.Week")}
            </span>
            <Form.Check
              type="switch"
              id="custom-switch"
              onChange={(e) => handleToogle()}
              className="follow_month_check"
              checked={toggle === "month"}
            />
            <span className="planning_month_head">
              {t("property_page.Month")}
            </span>
          </div>
        </div>
        {/* <div id="map" style={{ height: "70vh", width: "70%" }}></div> */}
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        className="coordinate-modal"
      >
        <Modal.Body className="text-center p-4">
          <div className="d-flex justify-content-end">
            <span
              className="material-symbols-outlined cursor-pointer"
              onClick={() => setShowModal(false)}
            >
              close
            </span>
          </div>
          <p className="mb-4">{t("common.pages.missing_coordinates")}</p>
          <Button variant="primary" onClick={handleUpdateBuildings}>
            {t("common.pages.update_buildings")}
          </Button>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default FollowUp;
