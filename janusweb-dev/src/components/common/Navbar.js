import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Nav,
  Form,
  Navbar,
  Dropdown,
  Container,
  ListGroup,
  InputGroup,
} from "@themesberg/react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, Link } from "react-router-dom";
import userImg from "../../assets/img/user.png";
import api from "api";
import { usePropertyContextCheck } from "context/SidebarContext/PropertyContextCheck";
import { usePlanningContextCheck } from "context/SidebarContext/PlanningContextCheck";

const NOTIFICATIONS_DATA = [
  {
    id: 1,
    read: false,
    sender: "Jose Leos",
    time: "a few moments ago",
    link: "#",
    message: `Added you to an event "Project stand-up" tomorrow at 12:30 AM.`,
  },
  {
    id: 2,
    read: false,
    sender: "Neil Sims",
    time: "2 hrs ago",
    link: "#",
    message: `You've been assigned a task for "Awesome new project".`,
  },
];

export default function NavBarComponent(props) {
  const location = useLocation();
  const { pathname } = location;
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState(NOTIFICATIONS_DATA);
  const { t, i18n } = useTranslation();
  const { resetPropertyContext } = usePropertyContextCheck();
  const { resetPlanningContext } = usePlanningContextCheck();

  const history = useHistory();
  const areNotificationsRead = notifications.reduce(
    (acc, notif) => acc && notif.read,
    true
  );

  useEffect(() => {
    let currentUser = JSON.parse(localStorage.getItem("user"));
    setUser(currentUser);
  }, []);

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications?.map((n) => ({ ...n, read: true })));
    }, 300);
  };

  const lngs = [
    { nativeName: "English", key: "en" },
    { nativeName: "Swedish", key: "sv" },
  ];

  const infos =
    user?.plan === "Under Notice"
      ? [{ name: t("common.pages.help_resources"), to: "/help-resources" }]
      : [
          { name: t("common.pages.open_onboarding"), to: "/onBoarding" },
          { name: t("common.pages.help_resources"), to: "/help-resources" },
        ];

  const Notification = (props) => {
    const { link, sender, time, message, read = false } = props;
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light">
        <Row className="align-items-center">
          <Col className="ps-0 ms--2">
            <div>
              <h4 className="h6 mb-0 text-small">{sender}</h4>
            </div>
            <div className="text-end">
              <small className={readClassName}>{time}</small>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  const logout = async () => {
    try {
      let user = JSON.parse(localStorage.getItem("user"));
      let res = await api.post("/auth/logout", {
        id: user._id,
      });
      localStorage.clear();
      resetPropertyContext();
      resetPlanningContext();
      history.push("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Navbar variant="dark" expanded className="ps-0 pe-2 pb-0">
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex">
            {
              // pathname == "/datasetting" ? null : null;
              // <Form className="navbar-search">
              //   <Form.Group id="topbarSearch">
              //     <InputGroup className="input-group-merge search-bar">
              //       <InputGroup.Text>
              //         <span class="material-symbols-outlined">search</span>
              //       </InputGroup.Text>
              //       <Form.Control
              //         type="text"
              //         placeholder={t("common.navbar.search_text")}
              //       />
              //     </InputGroup>
              //   </Form.Group>
              // </Form>
            }
          </div>
          <Nav className="align-items-center" style={{ gap: "25px" }}>
            {/* <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead}>
              <Dropdown.Toggle
                as={Nav.Link}
                className="pt-1 px-0 text-dark icon-notifications"
              >
                <div className="media d-flex align-items-center">
                  <span
                    class="material-symbols-outlined bell-shake"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  >
                    notifications
                  </span>
                  {areNotificationsRead ? null : (
                    <span className="icon-badge rounded-circle unread-notifications" />
                  )}
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-md dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                  <Nav.Link
                    href="#"
                    className="text-center text-primary fw-bold border-bottom border-light py-3"
                  >
                    {t("common.navbar.notifications")}
                  </Nav.Link>

                  {notifications?.map((n) => (
                    <Notification key={`notification-${n.id}`} {...n} />
                  ))}

                  <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    View all
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown> */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <span
                    class="material-symbols-outlined text-black"
                    style={{ fontSize: "1.5rem" }}
                  >
                    info
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right flex-column">
                {infos?.map((info) => (
                  <Dropdown.Item
                    className="media d-flex align-items-center mb-0 fw-bold"
                    onClick={() => {
                      if (
                        info.name == "Open onboarding" ||
                        info.name == "Öppna guide"
                      ) {
                        let userData = {
                          ...user,
                          isFirstLogin: false,
                          login: true,
                        };
                        localStorage.setItem("user", JSON.stringify(userData));
                        if (
                          user?.plan === "Standard Plus" ||
                          user?.canceledPlan === "Standard Plus"
                        ) {
                          history.push("/user-onboarding");
                        } else {
                          history.push("/onboarding");
                        }
                      } else {
                        window.open("/help-resources", "_blank");
                      }
                    }}
                  >
                    {info?.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <span
                    class="material-symbols-outlined text-black"
                    style={{ fontSize: "1.5rem" }}
                  >
                    language
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                {lngs?.map((lng) => (
                  <Dropdown.Item
                    className="fw-bold"
                    key={lng}
                    onClick={() => i18n.changeLanguage(lng.key)}
                    style={{
                      fontWeight:
                        i18n.resolvedLanguage === lng ? "bold" : "normal",
                    }}
                  >
                    {lng.nativeName} {lng.key}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
            <Nav.Link className="pt-1 px-0">
              <div className="media d-flex align-items-center">
                <span
                  class="material-symbols-outlined text-dark"
                  style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  onClick={logout}
                >
                  logout
                </span>
              </div>
            </Nav.Link>
            {/* {user?.role !== "user" && ( */}
            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <span
                    className="material-symbols-outlined text-dark"
                    style={{ fontSize: "1.5rem", cursor: "pointer" }}
                  >
                    account_circle
                  </span>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item
                  className="fw-bold"
                  onClick={() => history.push("/useraccounts")}
                >
                  {t("common.navbar.my_profile")}
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            {/* // )} */}
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}
const temp = (u_system, startYear) => {
  localStorage.setItem("activeTabIdPlanningMaintainance", "overview");
  window.open(
    `http://localhost:3000/maintainence?startYear=${startYear}&u_system=${u_system}`
  );
};
