import ReactDOM from "react-dom";
import useAsync from "./useAsync.js";
import SignOutModal from "components/common/Modals/SignOutModal.js";
import api from "api/index.js";

function getToken() {
  if (localStorage.getItem("token")) {
    const token = JSON.parse(localStorage.getItem("token") || "");
    return token;
  }
  return "";
}

// const DEFAULT_OPTIONS = {
//   headers: {
//     "Content-Type": "application/json111",
//     Authorization: `Bearer ${getToken()}`,
//   },
// };

const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
};

export default function useFetch(url, options = {}, dependencies = []) {
  return useAsync(async () => {
    const headers = {
      ...DEFAULT_HEADERS,
      ...options.headers,
      Authorization: `Bearer ${getToken()}`,
    };
    let modalRendered = false;
    // const res = await fetch(url, { ...DEFAULT_OPTIONS, ...options });
    const res = await fetch(url, { ...options, headers });

    if (res?.status === 401) {
      const currentPath = window.location.pathname;
      let token = localStorage.getItem("token");

      if (
        token &&
        !currentPath.includes("sign-in") &&
        !currentPath.includes("sign-up") &&
        !currentPath.includes("reset-password") &&
        (!token ? currentPath !== "/" : true)
      ) {
        if (token === "undefined") {
          localStorage.clear();
          window.location = "/sign-in";
          return;
        }
        modalRendered = true;

        const handleSignOut = async () => {
          try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (user?.email) {
              // Call logout API
              await api.post("/auth/logout", {
                id: user._id,
              });
            }
            // localStorage.removeItem("user");
            // localStorage.removeItem("token");
            localStorage.clear();
            modalRendered = false;
            window.location = "/sign-in";
          } catch (error) {
            console.error(error);
          }
        };

        const closeModal = () => {
          modalRendered = false;
        };

        const modalRoot = document.getElementById("modal-root");
        if (!modalRoot) {
          const div = document.createElement("div");
          div.id = "modal-root";
          document.body.appendChild(div);
        }
        localStorage.removeItem("token");
        ReactDOM.render(
          <SignOutModal
            show={true}
            onHide={closeModal}
            onSignOut={handleSignOut}
          />,
          document.getElementById("modal-root")
        );
      }
      return null;
    } else {
      if (res.ok) return res.json();
      const json = await res.json();
      return await Promise.reject(json);
    }
  }, dependencies);
}
