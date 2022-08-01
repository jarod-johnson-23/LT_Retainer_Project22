import { useState, useEffect } from "react";
import infoLogo from "./img/info.svg";
import Axios from "axios";
import "./AdminPage.css";
import FormCard from "./FormCard";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

var num_email_fields = 1; //Keeps track of number of text-boxes open for email values

function AdminPage() {
  const [new_username, set_new_username] = useState("");
  const [new_password, set_new_password] = useState("");
  const [login_info_warning, set_login_info_warning] = useState("");
  const [empty_field_warning, set_empty_field_warning] = useState("");
  const [email_fields, set_email_fields] = useState([1]);
  const [svg_logo, set_svg_logo] = useState("");
  const [company_name, set_company_name] = useState("");
  const [form_uri, set_form_uri] = useState("");
  const [form_data, set_form_data] = useState([]);
  const [cookies] = useCookies(["user"]);

  let navigate = useNavigate();

  const create_new_account = () => {
    //Create new login credentials through the admin page
    if (new_username.length > 4 && new_password.length > 4) {
      //New username and password must be greater than 4 characters
      Axios.post("http://localhost:3001/login-info/new-account", {
        new_username: new_username,
        new_password: new_password,
      }).then((response) => {
        set_new_username("");
        set_new_password("");
        set_login_info_warning(<></>); //Remove red warning if there was one
      });
    } else {
      set_login_info_warning(
        <h5 className="warning-text">
          Username and/or Password must be greater than 4 characters
        </h5>
      );
    }
  };

  async function upload_form(svg_logo, company_name, form_uri, email_arr) {
    //Asynchronous function to add new form data to the database and also the associated emails to the email database
    Axios.post("http://localhost:3001/maintenance-form/add-new", {
      svg_logo: svg_logo,
      company_name: company_name,
      form_uri: form_uri,
    }).then((response) => {});

    for (var j = 0; j < email_arr.length; j++) {
      //Loop through all emails in the array
      await Axios.post("http://localhost:3001/email-info/add-new", {
        form_uri: form_uri,
        team_email: email_arr[j].value,
      }).then((response) => {});
    }
  }

  const create_new_form = () => {
    //Main function to add form to the database, is mainly used to make sure data is submitted to the database before being erased
    var email_arr = document.getElementsByName("emails[]");
    var emails_filled = true;

    for (var i = 0; i < email_arr.length; i++) {
      if (email_arr[i].value.length === 0) {
        //Sets the boolean to make sure all email fields are filled
        emails_filled = false;
      }
    }
    if (
      //Checks if all fields are filled
      svg_logo.length > 0 &&
      company_name.length > 0 &&
      form_uri.length > 0 &&
      emails_filled === true
    ) {
      set_empty_field_warning("");
      upload_form(svg_logo, company_name, form_uri, email_arr).then(() => {
        // '.then()' makes sure that the form is uploaded before erasing the data from the page
        set_svg_logo("");
        set_company_name("");
        set_form_uri("");
        clear_email_fields();
        window.location.reload(false); //Has to reload page to refresh the array of each companys form data to make sure company IDs line up in the map function for the 'delete form' funcitonality
      });
    } else {
      set_empty_field_warning(
        <h4 className="warning-text">Please fill out all fields</h4>
      );
    }
  };

  function clear_email_fields() {
    //Function will clear all email fields and leave one empty one left
    for (var i = num_email_fields; i > 0; i--) {
      set_email_fields([]);
    }
    num_email_fields = 1;
    set_email_fields([1]);
    document.getElementById("1").value = "";
  }

  const delete_form = (id, company_uri) => {
    //Function will delete a form and its team email list from the database. Requires the ID of the form (integer) and the company URI for the email list
    Axios.delete(
      `http://localhost:3001/maintenance-form/delete-form/${id}/${company_uri}`
    ).then((response) => {
      set_form_data((form_data) =>
        form_data.filter((val) => {
          return val.id !== id;
        })
      );
      get_forms();
    });
  };

  var form_results;
  async function get_forms() {
    //Function is only used to load form objects on page load
    const response = Axios.get(
      "http://localhost:3001/maintenance-form/get-all"
    ).then((response) => {
      form_results = response.data;
      set_form_data(form_results);
    });
    await Promise.all([response]);
  }

  useEffect(() => {
    //Gets database data on page load
    get_forms();
    if (cookies.user == null) {
      //If the login cookie is not present, return to the login page
      navigate("/");
    }
    // eslint-disable-next-line
  }, []);

  async function add_email_field() {
    //Adds one more email field at the bottom
    num_email_fields++;
    set_email_fields((email_fields) => [...email_fields, num_email_fields]);
  }

  return (
    <>
      <div className="admin-forms">
        <div className="left-side">
          <h3 className="section-text">Create new login credentials</h3>
          {login_info_warning}
          <input
            type="text"
            placeholder="Username"
            value={new_username}
            className="input-box"
            onChange={(e) => {
              set_new_username(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            className="input-box"
            value={new_password}
            onChange={(e) => {
              set_new_password(e.target.value);
            }}
          />
          <button className="submit-btn" onClick={create_new_account}>
            Submit
          </button>
        </div>
        <div className="center-line" />
        <div className="center-side">
          <h3 className="section-text">Create new maintenance form</h3>
          {empty_field_warning}
          <label className="input-field">
            <span className="input-text">SVG code for logo</span>
            <input
              type="text"
              value={svg_logo}
              className="input-box"
              onChange={(e) => {
                set_svg_logo(e.target.value);
              }}
              required
            />
          </label>
          <label className="input-field">
            <span className="input-text">Company name</span>
            <input
              type="text"
              value={company_name}
              className="input-box"
              onChange={(e) => {
                set_company_name(e.target.value);
              }}
              required
            />
          </label>
          <label className="input-field">
            <span className="input-text">Form URI</span>
            <input
              type="text"
              value={form_uri}
              className="input-box"
              onChange={(e) => {
                set_form_uri(e.target.value);
              }}
              required
            />
            <img
              src={infoLogo}
              alt="more information button"
              className="info-btn"
              onClick={() => {
                alert(
                  'Do not include spaces, only use letters and/or numbers.\nFor example, if the base URI is "Yaamava", the URL for that form will be https://<BASE URL>/Yaamava'
                );
              }}
            />
          </label>
          <label className="input-field" id="email">
            <span className="email-text">Team Emails</span>
            <div className="email-fields">
              {email_fields.map((val, key) => {
                return (
                  <input
                    type="text"
                    name="emails[]"
                    id={val}
                    key={key}
                    className="input-box"
                    required
                    onKeyUp={(e) => {
                      if (e.key === "Enter") {
                        //Functionality to where pressing enter on a field will add a new one at the bottom
                        add_email_field().then(() => {
                          document.getElementById(val + 1).focus();
                        });
                      }
                    }}
                  />
                );
              })}
              <div className="input-buttons">
                <button
                  className="field-number-btn"
                  onClick={() => {
                    if (num_email_fields <= 1) {
                      //Dont remove field, needs to be at least 1
                    } else {
                      num_email_fields--;
                      set_email_fields((email_fields) => {
                        //Remove the last email field from the array
                        return email_fields.slice(0, email_fields.length - 1);
                      });
                    }
                  }}
                >
                  -
                </button>
                <button
                  className="field-number-btn"
                  onClick={() => {
                    num_email_fields++;
                    set_email_fields((email_fields) => [
                      //Add email field to the bottom of the list
                      ...email_fields,
                      num_email_fields,
                    ]);
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </label>
          <div className="form-submit-div">
            <button className="form-submit-btn" onClick={create_new_form}>
              Create Form
            </button>
          </div>
        </div>
        <div className="center-line" />
        <div className="right-side">
          <h3 className="section-text">Current live maintenance forms</h3>
          <div className="form-card-list">
            {form_data.map((val, key) => {
              return (
                <FormCard
                  key={key}
                  company_uri={val.company_uri}
                  svg_code={val.svg_code}
                  company_name={val.company_name}
                  temp_emails={val.temp_emails}
                  handleNavClick={() => {
                    //Functionality to navigate straight to the form that the client will see
                    navigate("/web-maintenance-form/" + val.company_uri);
                  }}
                  deleteForm={() => {
                    delete_form(val.id, val.company_uri);
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminPage;
