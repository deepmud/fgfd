//include the module express
const express = require('express');
const fs = require("fs");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const bp = require("body-parser");

const cookieParser = require("cookie-parser");
var mysql = require("mysql2/promise");

var pool = mysql.createPool({
  connectionLimit: 5,
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "citisoft",
});

//express() is a function of Express. It is used to create a new Express application
const app = express();
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

//set the port
const port = 8080;

//This is a built-in middleware function in Express. 
//It serves static files and is based on serve-static.

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static("public"));


var productslists = "";

    let datas = "";
    let sidebar5 = "";
    // let header = "";

   
  const sidebar = ()=>{
    let jj = new Promise((resolve, reject) => {
    fs.readFile("./sidebar.html", "utf8",  (err, sidebar1) => {
      if (err) {
        reject(err);
      } else {
        ;
        resolve(sidebar1)
      }
    });
   
  });
  return jj;
  }


  const header = ()=>{
    let jj = new Promise((resolve, reject) => {
    fs.readFile("./header.html", "utf8",  (err, header1) => {
      if (err) {
        reject(err);
      } else {
        ;
        resolve(header1)
      }
    });
   
  });
  return jj;
  }

  let sidebars = sidebar(); 
let headers = header(); 

  app.get('/sales-vendor.html' || '/', function(request, response, next){
    // __dirname is a Node.js variable that represents the current directory's path. 
    //__dirname + '/printMsgForm.html' is the absolute path to the HTML file.
    //response.sendFile(__dirname + '/printMsgForm.html');\
    fs.readFile('./sales-vendor.html', "utf8", async (err, data) => {
      if (err) {
        response.status(500).json({ error: 'internal server error' })
      } else {
        try {
          const [rows, fields] =
            await pool.execute(`SELECT DISTINCT s.id,p.name,s.product_id,CONCAT(u.firstname," ",u.lastname) as concatenated_names,s.created_at FROM sales as s INNER JOIN product as p ON p.id = s.product_id INNER JOIN users as u ON u.id = s.user_id  GROUP BY
                  p.name,
                  s.created_at,
                  s.id,
                  p.Id;`);
          
          if (rows.length > 0) {
            for (let result of rows) {
              productslists += ` 
              
              <tr>
      <td> ${result.name}</td>
      <td>${result.concatenated_names}</td>
      <td>${result.created_at.toString("dd-MM-yyyy").split("G")[0]}</td>
     
    </tr>`;
            }
          } else {
            productslists = "no sales made yet";
          }

          datas = data
            .replace(/\{\{sidebar\}\}/g,await sidebars)
            .replace(/\{\{header\}\}/g,await headers)
            .replace(/\{\{saleslist\}\}/g, productslists);

            response.format({
              'text/html': function () {
                response.send(datas)
              }})
              productslists='';
            } catch (error) {
              response.status(500).json({ error: 'internal server error in code:' + error})
            }
      }
    });
       
});
// Express route handler that responds to HTTP GET requests to the root URL (/) by sending the contents of the file printMsgForm.html.

app.get('/myprofile-vendor.html', function(request, response, next){
  // __dirname is a Node.js variable that represents the current directory's path. 
  //__dirname + '/printMsgForm.html' is the absolute path to the HTML file.
  //response.sendFile(__dirname + '/printMsgForm.html');\
  fs.readFile('./myprofile-vendor.html', "utf8", async (err, data) => {
    if (err) {
     
      response.status(500).json({ error: 'internal server error' })
    } else {
      try {
       
        const [rows, fields] = await pool.execute(
          `SELECT  * FROM company WHERE id = ?`,
          [request.query.id]
        );
        
        if (rows.length > 0) {
          for (let r of rows) {
            datas = data
            .replace(/\{\{sidebar\}\}/g,await sidebars)
            .replace(/\{\{header\}\}/g,await headers)
              .replace(/\{\{saleslist\}\}/g, productslists)
              .replace(/\{\{companyname\}\}/g, r.name)
              .replace(/\{\{repname\}\}/g, r.representative)
              .replace(/\{\{companyemail\}\}/g, r.email)
              .replace(/\{\{website\}\}/g, r.website)
              .replace(/\{\{established\}\}/g, r.year_established)
              .replace(/\{\{countries\}\}/g, r.location_countries)
              .replace(/\{\{cities\}\}/g, r.location_cities)
              .replace(/\{\{phone\}\}/g, r.Phone_no)
              .replace(/\{\{employees\}\}/g, r.number_of_employees)
              .replace(/\{\{address\}\}/g, r.address)
              .replace(/\{\{description\}\}/g, r.description)
              .replace(/\{\{id\}\}/g, r.id);
          }
        } else {
          productslists = "no sales made yet";
        }
          response.format({
            'text/html': function () {
               response.status(200).send(datas)
            }})
       
          } catch (error) {
            response.status(500).json({ error: 'internal server error in code:' + error})
          }
    }
  });
     
});


app.get('/myprofile-vendor-edit.html', function(request, response, next){
  // __dirname is a Node.js variable that represents the current directory's path. 
  //__dirname + '/printMsgForm.html' is the absolute path to the HTML file.
  //response.sendFile(__dirname + '/printMsgForm.html');\
  fs.readFile('./myprofile-vendor-edit.html', "utf8", async (err, data) => {
    if (err) {
      
      response.send("Internal Server Error");
    } else {
      try {
        const [rows, fields] = await pool.execute(
          `SELECT  * FROM company WHERE id = ?`,
          [request.query.id]
        );
       
        if (rows.length > 0) {
          for (let r of rows) {
            datas = data
            .replace(/\{\{sidebar\}\}/g,await sidebars)
            .replace(/\{\{header\}\}/g,await headers)
              .replace(/\{\{saleslist\}\}/g, productslists)
              .replace(/\{\{companyname\}\}/g, r.name)
              .replace(/\{\{repname\}\}/g, r.representative)
              .replace(/\{\{companyemail\}\}/g, r.email)
              .replace(/\{\{website\}\}/g, r.website)
              .replace(/\{\{established\}\}/g, r.year_established)
              .replace(/\{\{countries\}\}/g, r.location_countries)
              .replace(/\{\{cities\}\}/g, r.location_cities)
              .replace(/\{\{phone\}\}/g, r.Phone_no)
              .replace(/\{\{employees\}\}/g, r.number_of_employees)
              .replace(/\{\{address\}\}/g, r.address)
              .replace(/\{\{description\}\}/g, r.description)
              .replace(/\{\{id\}\}/g, r.id);
          }
        } else {
          productslists = "no sales made yet";
        }
          response.format({
            'text/html': function () {
               response.status(200).send(datas)
            }})
       
          } catch (error) {
            response.status(500).json({ error: 'internal server error in code:' + error})
          }
    }
  });
     
});



app.get('/myprofile-admin.html', function(request, response, next){
  // __dirname is a Node.js variable that represents the current directory's path. 
  //__dirname + '/printMsgForm.html' is the absolute path to the HTML file.
  //response.sendFile(__dirname + '/printMsgForm.html');\
  fs.readFile('./myprofile-admin.html', "utf8", async (err, data) => {
    if (err) {
      response.status(500).json({ error: 'internal server error' })
    } else {
      
      datas = data
      .replace(/\{\{sidebar\}\}/g,await sidebars)
      .replace(/\{\{header\}\}/g,await headers)
      response.format({
        'text/html': function () {
          response.status(200).send(datas)
        }})
    }
  });
     
});
// defines a route handler in an Express application that is triggered when the server receives an HTTP POST request to the "/submit" endpoint. 
//'/submit' is deffined in the html file (see fetch function)
app.post('/myprofile-vendor-edit.html',async (request, response) => {
  try{
  const formData = request.body; //alternative: const { username } = request.body;

  const email = formData.companyemail;
  const id = parseInt(formData.id);

  const name1 = formData.companyname;
  const website = formData.website;
  const location_countries = formData.countries;
  const address = formData.address;
  const location_cities = formData.cities;
  const year_established = formData.established;
  const number_of_employees = parseInt(formData.employees);
  const Phone_no = formData.phone;
  const description1 = formData.description;
  const representative = formData.repname;
  sql = `UPDATE company SET name = ${mysql.escape(
    name1
  )}, email = ${mysql.escape(email)}, website = ${mysql.escape(
    website
  )}, location_countries = ${mysql.escape(
    location_countries
  )}, address = ${mysql.escape(
    address
  )}, location_cities = ${mysql.escape(
    location_cities
  )}, year_established = ${mysql.escape(
    year_established
  )}, number_of_employees = ${mysql.escape(
    number_of_employees
  )}, Phone_no = ${mysql.escape(
    Phone_no
  )}, representative = ${mysql.escape(
    representative
  )}, description = ${mysql.escape(
    description1
  )} WHERE id = ${mysql.escape(id)}`;
  //  values = [name1, email, website, location_countries, address, location_cities, year_established, number_of_employees, Phone_no, representative, description, id];

 
  const [rows1, fields1] = await pool.query(sql);

  console.log("reg inserted")
  ;  } catch (error) {
    response.status(500).json({ error: 'internal server error in code:' + error})
  }

  // Perform server-side logic (e.g., save to a database)
  // For simplicity, I just send a response echoing the username received
  response.redirect("/myprofile-vendor.html?id=1");
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/sales-vendor.html`);
});


