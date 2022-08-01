import "./WebMaintenanceForm.css";
import ltLogo from "./img/LaneTerraleverSquaresLogo.png";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Axios from "axios";

var num_selected_files = 0;

function WebMaintenanceForm() {
  const [urgentSelection, set_urgentSelection] = useState("");
  const [emailsJsonValue, set_emailsJsonValue] = useState("");
  const [company, set_company] = useState("");
  const [svg_logo, set_svg_logo] = useState("");
  const [form_uri, set_form_uri] = useState("");
  const [uploaded_files, set_uploaded_files] = useState([]);

  let { clientId } = useParams();
  const ref = useRef();

  function urgentUnselect() {
    const section = document.getElementById("urgent-timeline-section");
    section.style.paddingTop = "0px";
    section.style.paddingLeft = "0px";
    set_urgentSelection(<></>);
  }

  function urgentSelected() {
    const section = document.getElementById("urgent-timeline-section");
    section.style.paddingTop = "25px";
    section.style.paddingLeft = "6px";
    set_urgentSelection(
      <>
        <h1 className="grey-text">
          If Urgent<x-red class="red-text"> *</x-red>
        </h1>
        <label className="vert-radio-pair">
          <input
            type="radio"
            name="urgent-selection"
            value="Straight to Production"
            required
          />
          <span className="grey-text-option">
            Straight to production (Not recommended)
          </span>
        </label>
        <label className="vert-radio-pair">
          <input
            type="radio"
            name="urgent-selection"
            value="Would like LT's opinion on QA"
          />
          <span className="grey-text-option">
            Would like LT's opinion on QA
          </span>
        </label>
        <label className="vert-radio-pair">
          <input
            type="radio"
            name="urgent-selection"
            value="Please test and wait for approval"
          />
          <span className="grey-text-option">
            Please test and wait for approval
          </span>
        </label>
      </>
    );
  }

  let navigate = useNavigate();

  function get_data() {
    Axios.post("http://localhost:3001/maintenance-form/get-info", {
      form_uri: clientId,
    }).then((response) => {
      if (response.data.length === 0) {
        navigate("/page-not-found");
      } else {
        response.data.map((val, key) => {
          set_company(val.company_name);
          set_svg_logo(val.svg_code);
          set_form_uri(val.company_uri);
          return 1;
        });
        Axios.post("http://localhost:3001/email-info/get-info", {
          form_uri: clientId,
        }).then((response) => {
          var arrayToString = JSON.stringify(Object.assign({}, response.data));
          set_emailsJsonValue(arrayToString);
        });
      }
    });
  }

  useEffect(() => {
    //Gets database data on page load
    get_data();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {}, [uploaded_files]);

  async function add_files(files) {
    var num = 0;
    for (const file of files) {
      num++;
      set_uploaded_files((uploaded_files) => [...uploaded_files, file]);
    }
    num_selected_files = num;
  }

  const add_screenshot = (e) => {
    set_uploaded_files([]);
    const input_files = document.getElementById("screenshot-input");
    const selectedFiles = [...input_files.files];
    add_files(selectedFiles);
    const num_files = document.getElementById("numOfFiles");
    if (num_selected_files === 1) {
      num_files.innerHTML = num_selected_files + " File Selected";
    } else {
      num_files.innerHTML = num_selected_files + " Files Selected";
    }
  };

  const remove_files = () => {
    num_selected_files = 0;
    const file_num = document.getElementById("numOfFiles");
    file_num.innerHTML = "0 Files Selected";
    ref.current.value = "";
    set_uploaded_files([]);
  };

  /*SELECT BOX JS*/
  useEffect(() => {
    const selected = document.querySelector(".selected");
    const optionsContainer = document.querySelector(".options-container");
    const optionsList = document.querySelectorAll(".option");
    const selected2 = document.querySelector(".selected2");
    const optionsContainer2 = document.querySelector(".options-container2");
    const optionsList2 = document.querySelectorAll(".option2");

    selected.addEventListener("click", () => {
      optionsContainer.classList.toggle("active");
    });
    selected.addEventListener("blur", () => {
      optionsContainer.classList.remove("active");
    });
    optionsList.forEach((o) => {
      o.addEventListener("click", () => {
        selected.innerHTML = o.querySelector("label").innerHTML;
        optionsContainer.classList.remove("active");
      });
    });
    selected2.addEventListener("click", () => {
      optionsContainer2.classList.toggle("active2");
    });
    selected2.addEventListener("blur", () => {
      optionsContainer2.classList.remove("active2");
    });
    optionsList2.forEach((o) => {
      o.addEventListener("click", () => {
        selected2.innerHTML = o.querySelector("label").innerHTML;
        optionsContainer2.classList.remove("active2");
      });
    });
  }, []);

  // function check_fields_filled() {
  //   //Need to add funcitonality, to have custom behavior for not having fields filled out
  //   return true;
  // }

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
          <h1>WEB MAINTENANCE CONTACT FORM</h1>
          <div className="box-text">
            <h3>
              Please fill out the following form for your DEV request. Our team
              can provide you a timeline within 24-48 hours.{" "}
            </h3>
            <h3>
              <strong>TIMELINES MAY VARY DEPENDING ON COMPLEXITY</strong>
            </h3>
          </div>
        </div>
      </div>
      <div className="main-form">
        <form
          action="./maintenance_submit.php"
          method="POST"
          id="maintenance_form"
          encType="multipart/form-data"
          multipart=""
          onSubmit={() => {
            console.log("stuff");
          }}
        >
          <input type="hidden" name="emailsJson" value={emailsJsonValue} />
          <input type="hidden" name="company" value={company} />
          <input type="hidden" name="form_uri" value={form_uri} />
          <h4 className="warning grey-text-small">
            <span className="red-text">*</span> = REQUIRED
          </h4>
          <input
            type="text"
            name="name"
            className="question"
            id="name"
            required
          />
          <label htmlFor="name">
            <span>
              What's your name?<x-red class="red-text"> *</x-red>
            </span>
          </label>
          <input
            type="text"
            name="email"
            className="question"
            id="email"
            required
          ></input>
          <label htmlFor="email">
            <span>
              What's your email?<x-red class="red-text"> *</x-red>
            </span>
          </label>
          <input
            type="text"
            name="url"
            className="question"
            id="url"
            required
          />
          <label htmlFor="url">
            <span>
              Link where issue occurs?<x-red class="red-text"> *</x-red>
            </span>
          </label>
          <div className="description-section">
            <h1 className="grey-text">
              Description of Issue<x-red class="red-text"> *</x-red>
            </h1>
            <textarea
              type="textarea"
              name="description"
              id="description"
              rows="4"
              required
            />
          </div>
          <div className="browser-type-section">
            <h1 className="grey-text">
              Browser<x-red class="red-text"> *</x-red>
            </h1>
            <div className="select-box">
              <div className="options-container">
                <div className="option">
                  <input
                    type="radio"
                    className="radio"
                    id="firefox"
                    name="type-browser"
                    value="Firefox"
                    required
                  />
                  <label htmlFor="firefox" className="label1">
                    Firefox
                  </label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    className="radio"
                    id="chrome"
                    name="type-browser"
                    value="Chrome"
                  />
                  <label htmlFor="chrome" className="label1">
                    Chrome
                  </label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    className="radio"
                    id="edge"
                    name="type-browser"
                    value="Edge"
                  />
                  <label htmlFor="edge" className="label1">
                    Edge
                  </label>
                </div>
                <div className="option">
                  <input
                    type="radio"
                    className="radio"
                    id="safari"
                    name="type-browser"
                    value="Safari"
                  />
                  <label htmlFor="safari" className="label1">
                    Safari
                  </label>
                </div>
              </div>
              <div className="selected"></div>
            </div>
          </div>
          <div className="timeline-section">
            <h1 className="grey-text">
              Timeline<x-red class="red-text"> *</x-red>
            </h1>
            <label className="vert-radio-pair">
              <input
                type="radio"
                name="timeline"
                value="Urgent"
                onClick={urgentSelected}
                required
              />
              <span className="grey-text-option">Urgent</span>
            </label>
            <label className="vert-radio-pair">
              <input
                type="radio"
                name="timeline"
                value="Within a few days"
                onClick={urgentUnselect}
              />
              <span className="grey-text-option">
                Within a few days (Please provide a timeline below)
              </span>
            </label>
            <label className="vert-radio-pair">
              <input
                type="radio"
                name="timeline"
                value="Within a week"
                onClick={urgentUnselect}
              />
              <span className="grey-text-option">Within a week</span>
            </label>
            <label className="vert-radio-pair">
              <input
                type="radio"
                name="timeline"
                value="We want to schedule"
                onClick={urgentUnselect}
              />
              <span className="grey-text-option">
                We want to schedule (Need 5 business day notice)
              </span>
            </label>
          </div>
          <div className="timeline-section-urgent" id="urgent-timeline-section">
            {urgentSelection}
          </div>
          <div className="device-section">
            <h1 className="grey-text">Device</h1>
            <div className="device-radio-pairs">
              <label className="radio-pair">
                <input type="radio" name="device" value="Desktop" />
                <span className="grey-text-option">Desktop</span>
              </label>
              <label className="radio-pair">
                <input type="radio" name="device" value="Mobile" />
                <span className="grey-text-option">Mobile</span>
              </label>
              <label className="radio-pair">
                <input type="radio" name="device" value="Both" />
                <span className="grey-text-option">Both</span>
              </label>
            </div>
          </div>

          <div className="issue-type-section">
            <h1 className="grey-text">Type of issue</h1>
            <div className="select-box2">
              <div className="options-container2">
                <div className="option2">
                  <input
                    type="radio"
                    className="radio2"
                    id="Blank"
                    name="type-issue"
                    value=""
                  />
                  <label htmlFor="Blank" className="label2">
                    {" "}
                  </label>
                </div>
                <div className="option2">
                  <input
                    type="radio"
                    className="radio2"
                    id="Bug"
                    name="type-issue"
                    value="Bug"
                  />
                  <label htmlFor="Bug" className="label2">
                    Bug
                  </label>
                </div>
                <div className="option2">
                  <input
                    type="radio"
                    className="radio2"
                    id="Content"
                    name="type-issue"
                    value="Content"
                  />
                  <label htmlFor="Content" className="label2">
                    Content
                  </label>
                </div>
                <div className="option2">
                  <input
                    type="radio"
                    className="radio2"
                    id="Update"
                    name="type-issue"
                    value="Update"
                  />
                  <label htmlFor="Update" className="label2">
                    Update
                  </label>
                </div>
                <div className="option2">
                  <input
                    type="radio"
                    className="radio2"
                    id="Layout"
                    name="type-issue"
                    value="Layout"
                  />
                  <label htmlFor="Layout" className="label2">
                    Layout
                  </label>
                </div>
                <div className="option2">
                  <input
                    type="radio"
                    className="radio2"
                    id="Global"
                    name="type-issue"
                    value="Global"
                  />
                  <label htmlFor="Global" className="label2">
                    Global
                  </label>
                </div>
              </div>
              <div className="selected2"></div>
            </div>
          </div>

          <div className="screenshot-section">
            <h1 className="grey-text" id="screenshot-text">
              Screenshots
            </h1>
            <div className="screenshot-right-side">
              <div className="screenshot-holder">
                <input
                  type="file"
                  name="screenshots[]"
                  id="screenshot-input"
                  onChange={(e) => {
                    add_screenshot(e);
                  }}
                  multiple={true}
                  ref={ref}
                />
                <label className="btn-upload" htmlFor="screenshot-input">
                  Choose file
                </label>
              </div>
              <div className="file-control-section">
                <div className="selected-files">
                  <label id="numOfFiles" className="num-files">
                    0 Files Selected
                  </label>
                  <ul className="file-list">
                    {uploaded_files.map((val, key) => {
                      return (
                        <li key={key}>
                          <p className="list-text">{val.name}</p>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <button
                  type="button"
                  className="grey-btn"
                  onClick={remove_files}
                >
                  Remove files
                </button>
              </div>
            </div>
          </div>
          <div className="addtl-description-section">
            <h1 className="grey-text">Additional Notes</h1>
            <textarea
              type="textarea"
              name="addtlNotes"
              id="addtlNotes"
              rows="4"
            />
          </div>

          <div className="btn-container">
            <input type="submit" value="SUBMIT" className="submit-btn" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default WebMaintenanceForm;
