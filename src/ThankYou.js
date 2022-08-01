import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "./ThankYou.css";
import ltLogo from "./img/LaneTerraleverSquaresLogo.png";
import Axios from "axios";
import { useNavigate } from "react-router-dom";

function ThankYou() {
  const [svg_logo, set_svg_logo] = useState("");

  let { form_uri } = useParams();
  let navigate = useNavigate();

  function get_data() {
    Axios.post("http://localhost:3001/maintenance-form/get-info", {
      form_uri: form_uri,
    }).then((response) => {
      if (response.data.length === 0) {
      } else {
        response.data.map((val, key) => {
          set_svg_logo(val.svg_code);
          return "";
        });
      }
    });
  }

  const return_to_form = () => {
    navigate("/web-maintenance-form/" + form_uri);
  };

  useEffect(() => {
    //Gets database data on page load
    get_data();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="App">
      <div className="logo-header">
        <div className="left-logo">
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(svg_logo)}`}
            alt="Logo of company who uses this form"
          />
        </div>
        <div className="vertical-line" />
        <div className="right-logo">
          <img src={ltLogo} alt="LT Logo" />
        </div>
      </div>
      <div className="title-info">
        <div className="box-info">
          <h1 className="thanks-text">Thank You!</h1>
          <div className="box-text-thanks">
            <h3>
              Thank you for submitting your web maintenance request. Our team
              will get back to you as soon as possible with a response.
            </h3>
            <button
              className="return-btn"
              onClick={() => {
                return_to_form();
              }}
            >
              Return to form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ThankYou;
