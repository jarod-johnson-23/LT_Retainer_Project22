import "./FormCard.css";
import { useState, useEffect } from "react";
import Axios from "axios";

function FormCard(props) {
  const [email_list, set_email_list] = useState([]);

  const base_form_url = "http://localhost:3000/web-maintenance-form/";

  useEffect(() => {
    async function get_emails() {
      await Axios.post("http://localhost:3001/email-info/get-info", {
        form_uri: props.company_uri,
      }).then((response) => {
        if (response.data.length === 0) {
        } else {
          set_email_list(response.data);
        }
      });
    }
    get_emails();
    // eslint-disable-next-line
  }, [props.company_uri]);

  return (
    <div className="form-card">
      <div className="card-left-side">
        <img
          src={`data:image/svg+xml;utf8,${encodeURIComponent(props.svg_code)}`}
          alt="Logo of company who uses this form"
        />
        <h5>Company Name:</h5>
        <p>{props.company_name}</p>
        <h5>Form URL:</h5>
        <p>
          {" "}
          {base_form_url}
          {props.company_uri}
        </p>
        <h5>Team Members:</h5>
        {email_list.map((val, key) => {
          return <p key={key}>{val.email}</p>;
        })}
      </div>
      <div className="line-divide" />
      <div className="card-right-side">
        <button className="right-buttons" onClick={props.handleNavClick}>
          View Form
        </button>
        <button className="right-buttons" onClick={props.deleteForm}>
          Delete Form
        </button>
      </div>
    </div>
  );
}

export default FormCard;
