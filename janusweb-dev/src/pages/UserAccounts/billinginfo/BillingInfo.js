import { Button, Table } from "@themesberg/react-bootstrap";
import api from "api";
import Loader from "components/common/Loader";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaDownload } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { plans } from "utils/pricing";

const BillingInfo = () => {
  const [invoices, setInvoices] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const history = useHistory();
  const { t } = useTranslation();

  const getInvoices = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    let res = await api.get(`/stripe/getCustomerInvoices/${user?._id}`);
    setInvoices(res?.data?.data);
    setLoading(false);
  };

  const getCustomerPortal = async () => {
    setLoading(true);
    if (
      (user?.plan === "Standard Plus" ||
        user?.plan === "Standard" ||
        user?.cancelSubscriptionDate) &&
      !user?.trialEnd
    ) {
      let res = await api.get(`/stripe/getCustomerPortal/${user?._id}`);
      setLoading(false);
      window.location = res?.data;
    } else {
      setLoading(false);
      history.push("/pricing-plan");
    }
  };

  const getUser = async () => {
    let userId = JSON.parse(localStorage.getItem("user"))?._id;
    try {
      let res = await api.get(`/users/${userId}`);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  useEffect(() => {
    getInvoices();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <div>
      <div className="currPlan">
        <div style={{ fontSize: "1.3rem" }}>
          {t(`common.pages.Current Plan`)} :{" "}
          <span className="plan">
            {user?.trialEnd
              ? t("common.pages.Trial Period")
              : t(`common.pages.${user?.plan}`)}
          </span>
        </div>
        {!user?.plan || user?.plan === "Under Notice" ? (
          <Button
            // style={{ color: "black", backgroundColor: "#f0f0f0" }}
            className="mt-2 billingBtn"
            // onClick={() => history.push("/pricing-plan")}
            onClick={getCustomerPortal}
            type="primary"
          >
            {t(`common.pages.Change`)}
            <span class="material-symbols-outlined">open_in_new</span>
          </Button>
        ) : (
          <Button
            // style={{ color: "black", backgroundColor: "#f0f0f0" }}
            className="mt-2 billingBtn"
            onClick={getCustomerPortal}
            type="primary"
          >
            {t("common.pages.Manage_Billing")}
            <span class="material-symbols-outlined">open_in_new</span>
          </Button>
        )}
      </div>

      {/* Invoices  */}
      <div className="billing_table">
        <Table>
          <thead>
            <tr>
              <th> {t("common.pages.#Invoice")} </th>
              <th>{t("common.pages.DATE")}</th>
              <th> {t("common.pages.STATUS")} </th>
              <th>{t("common.pages.PLAN_DETAILS")} </th>
              <th> {t("common.pages.DOWNLOAD")} </th>
            </tr>
          </thead>
          <tbody>
            {invoices?.map((item, index) => {
              let data = item?.lines?.data;
              return (
                <tr>
                  <td>{item?.id}</td>
                  <td style={{ fontSize: "14px", fontWeight: "500" }}>
                    <div>
                      {new Date(item?.created * 1000)
                        ?.toISOString()
                        .slice(0, 10)}
                    </div>
                    {/* <div style={{ color: "#84818A", fontWeight: "400" }}>
                    {new Date(item?.created).toLocaleTimeString()}
                  </div> */}
                  </td>
                  <td>{item?.paid ? t("common.pages.Paid") : "Failed"}</td>
                  <td style={{ fontWeight: "600" }}>
                    {`
                    ${
                      plans[data[data?.length - 1]?.plan?.product]
                    } ${item?.currency.toUpperCase()} ${item?.amount_paid / 100}
                  `}
                  </td>
                  <td>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        columnGap: "12px",
                        height: "100%",
                        fontSize: "22px",
                      }}
                    >
                      {/* <AiOutlineEye style={{ marginTop: "9px" }} /> */}
                      <a href={item?.invoice_pdf} style={{ color: "black" }}>
                        <FaDownload />
                      </a>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
};

export default BillingInfo;
