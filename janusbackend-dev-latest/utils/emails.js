import sgMail from "@sendgrid/mail";
//const Token = require('../api/models/token');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmailToVerifyAccount = async (user, code, res, signin) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user?.email,
      from: {
        email: process.env.SMTP_EMAIL,
        name: "Janus",
      },
      templateId: process.env.VERIFY_ACCOUNT_TEMPLATE,
      dynamic_template_data: {
        code,
      },
    };
    await sgMail.send(msg);
    !signin &&
      res.status(201).json({ message: "User Created Successfully", user });
  } catch (err) {
    console.log(err?.response?.body || err);
    res.status(500).json(err);
  }
};

const sendForgotPasswordMail = async (email, code, res) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: {
        email: process.env.SMTP_EMAIL,
        name: "Janus",
      },
      templateId: process.env.RESET_PASSWORD_TEMPLATE,
      dynamic_template_data: {
        link: `${process.env.FRONT_END_URL}/reset-password/${code}`,
      },
    };
    await sgMail.send(msg);
    res.status(200).json({ message: "Reset Mail sent successfully" });
  } catch (err) {
    console.log(err);
    console.log(err.response.body);
    res.status(500).json(err);
  }
};

// Send User Detail
const sendUserDetail = async (data, res) => {
  const { name, email, phone, message } = data;
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: "info@balancepoint.se",
      from: {
        email: process.env.SMTP_EMAIL,
        name: "Janus",
      },
      templateId: process.env.CONTACT_TEMPLATE,
      dynamic_template_data: {
        name,
        email,
        phone,
        message,
      },
    };
    await sgMail.send(msg);
    res.status(200).json({ message: "Mail sent successfully" });
  } catch (err) {
    console.log(err);
    console.log(err.response.body);
    res.status(500).json(err);
  }
};

const sendLoginAttemptAlert = async (user) => {
  try {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: user?.email,
      from: {
        email: process.env.SMTP_EMAIL,
        name: "Janus",
      },
      templateId: process.env.DUPLICATE_LOGIN_ATTEMPT_TEMPLATE,
      dynamic_template_data: {
        email: user?.email,
        name: user?.name,
      },
    };
    await sgMail.send(msg);
  } catch (err) {
    console.log(err.response?.body || err);
  }
};

export {
  sendEmailToVerifyAccount,
  sendForgotPasswordMail,
  sendUserDetail,
  sendLoginAttemptAlert,
};
