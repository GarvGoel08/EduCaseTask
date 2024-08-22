const mysql = require("mysql2");

const { HOST, USER, PASSWORD, DATABASE, DB_PORT, CERT } = process.env;

const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  port: DB_PORT,
  ssl: {
    rejectUnauthorized: true,
    ca: CERT,
  },
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    return;
  }
  console.log("Connected to MySQL database.");
});

const addSchool = (req, res) => {
    const { name, address, latitude, longitude } = req.body;
  
    if (!name || !address || isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).send("Invalid input data.");
    }
  
    const query = `INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)`;
    const values = [name, address, parseFloat(latitude), parseFloat(longitude)];
  
    db.query(query, values, (err, result) => {
      if (err) {
        console.error("Failed to add school:", err.stack);
        return res.status(500).send("Internal Server Error");
      }
      res.status(201).send("School added successfully.");
    });
  };
  

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (x) => (x * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).send("Please provide valid latitude and longitude.");
  }

  const query = `SELECT * FROM schools`;
  db.query(query, (err, results) => {
    if (err) {
      console.error("Failed to fetch schools:", err.stack);
      return res.status(500).send("Internal Server Error");
    }

    const sortedSchools = results
      .map((school) => ({
        ...school,
        distance: calculateDistance(
          latitude,
          longitude,
          school.latitude,
          school.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance);

    res.status(200).json(sortedSchools);
  });
};


module.exports = { addSchool, listSchools };
