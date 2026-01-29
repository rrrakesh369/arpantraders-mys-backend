const { pool } = require("../config/database");

const createDashboardQuery = async (title) => {
  const [result] = await pool.query(
    "INSERT INTO dashboards (title) VALUES (?)",
    [title]
  );
  return result.insertId;
};

const addDashboardImage = async (dashboardId, image) => {
  const { imageUrl, imageName, imageTitle, imageDescription } = image;

  await pool.query(
    `INSERT INTO dashboard_images 
     (dashboardId, imageUrl, imageName, imageTitle, imageDescription)
     VALUES (?, ?, ?, ?, ?)`,
    [dashboardId, imageUrl, imageName, imageTitle, imageDescription]
  );
};


const getDashboardQuery = async () => {
  const [rows] = await pool.query(`
    SELECT 
      d.title,
      di.imageUrl,
      di.imageName,
      di.imageTitle,
      di.imageDescription
    FROM dashboards d
    LEFT JOIN dashboard_images di
      ON d.id = di.dashboardId
  `);

  return rows;
};


module.exports = {
  createDashboardQuery,
  addDashboardImage,
  getDashboardQuery
};


