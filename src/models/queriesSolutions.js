const { pool } = require("../config/database");



// create solution
const createSalutionQuery = async (prodType, name, description, title) => {
  const [result] = await pool.query(
    `INSERT INTO solutions (prodType, name, description, title)
     VALUES (?, ?, ?, ?)`,
    [prodType, name, description, title]
  );
  return result.insertId;
};

// insert images
const addSolutionImage = async (solutionId, image) => {
  const { imageUrl, imageName } = image;
  await pool.query(
    `INSERT INTO solution_images (solutionId, imageUrl, imageName)
     VALUES (?, ?, ?)`,
    [solutionId, imageUrl, imageName]
  );
};


const getAllSolutionsQuery = async () => {
  const [rows] = await pool.query(`
    SELECT
      s.id,
      s.prodType,
      s.name,
      s.description,
      s.title,
      s.created_at,
      si.id AS imageId,
      si.imageUrl,
      si.imageName
    FROM solutions s
    LEFT JOIN solution_images si
      ON s.id = si.solutionId
    ORDER BY s.id DESC
  `);

  return rows;
};

module.exports = {
  getAllSolutionsQuery
};


const getSolutionsByProdTypeQuery = async (prodType) => {
  const [rows] = await pool.query(
    `SELECT 
        s.id,
        s.prodType,
        s.name,
        s.title,
        s.description,
        s.created_at,
        s.updated_at,
        si.imageUrl,
        si.imageName
     FROM solutions s
     LEFT JOIN solution_images si
       ON s.id = si.solutionId
     WHERE s.prodType = ?`,
    [prodType]
  );

  return rows;
};

module.exports = {
  createSalutionQuery,
  addSolutionImage, getAllSolutionsQuery, getSolutionsByProdTypeQuery
};


