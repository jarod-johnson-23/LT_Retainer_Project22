const express = require("express");
const app = express();
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const login_db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "19496De6s!",
  databse: "LT_Web_Maintenance22",
});

app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3001, () => {
  console.log("database running on port 3001");
});

app.post("/login-info/get", (req, res) => {
  //Returns a username and password if there is a match in the database
  const username_input = req.body.username_input;
  const password_input = req.body.password_input;

  const sqlSelect =
    "SELECT * FROM LT_Web_Maintenance22.Login_Info WHERE Username = ? && User_Pass = ?";
  login_db.query(sqlSelect, [username_input, password_input], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/login-info/new-account", (req, res) => {
  //creates new login credentials in the database
  const new_username = req.body.new_username;
  const new_password = req.body.new_password;

  const sqlInsert =
    "INSERT INTO LT_Web_Maintenance22.Login_Info (Username, User_Pass) VALUES (?,?)";
  login_db.query(sqlInsert, [new_username, new_password], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/email-info/add-new", (req, res) => {
  //Adds a new email and company form uri to database, emails are grouped based on their company form uri
  const form_uri = req.body.form_uri;
  const team_email = req.body.team_email;

  const sqlInsert =
    "INSERT INTO LT_Web_Maintenance22.Email_db (company_id, email) VALUES (?,?)";
  login_db.query(sqlInsert, [form_uri, team_email], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/email-info/get-info", (req, res) => {
  //Returns all team member emails from a specific company ID
  const form_uri = req.body.form_uri;

  const sqlSelect =
    "SELECT * FROM LT_Web_Maintenance22.Email_db WHERE company_id = ? ORDER by email";
  login_db.query(sqlSelect, [form_uri], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post("/maintenance-form/add-new", (req, res) => {
  //Adds new form data to the database

  const svg_logo = req.body.svg_logo;
  const company_name = req.body.company_name;
  const form_uri = req.body.form_uri;

  const sqlInsert =
    "INSERT INTO LT_Web_Maintenance22.Maintenance_Form_Data (svg_code, company_name, company_uri) VALUES (?,?,?)";
  login_db.query(
    sqlInsert,
    [svg_logo, company_name, form_uri],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    }
  );
});

app.post("/maintenance-form/get-info", (req, res) => {
  //Returns 1 company and its info to populate the specific form
  const form_uri = req.body.form_uri;

  const sqlSelect =
    "SELECT * FROM LT_Web_Maintenance22.Maintenance_Form_Data WHERE company_uri = ? LIMIT 1";
  login_db.query(sqlSelect, [form_uri], (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.get("/maintenance-form/get-all", (req, res) => {
  //Returns all data for all companies in the database to populate the admin page
  const sqlSelect =
    "SELECT * FROM LT_Web_Maintenance22.Maintenance_Form_Data ORDER by company_name";
  login_db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.delete("/maintenance-form/delete-form/:id/:company_uri", (req, res) => {
  //Delete a company and all its data from the company database and email database. Requires two parameters
  const id = req.params.id;
  const company_uri = req.params.company_uri;
  const sqlDelete =
    "DELETE FROM LT_Web_Maintenance22.Maintenance_Form_Data WHERE id = ?";
  const sqlDeleteEmails =
    "DELETE FROM LT_Web_Maintenance22.Email_db WHERE company_id = ?";
  login_db.query(sqlDelete, id, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      login_db.query(sqlDeleteEmails, company_uri, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          res.send(result);
        }
      });
    }
  });
});
