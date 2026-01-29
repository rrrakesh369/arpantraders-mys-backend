const {
  createDashboardQuery,
  addDashboardImage,getDashboardQuery
} = require("../models/queriesDashboard");

const {
  createSalutionQuery,
  addSolutionImage
,getSolutionsByProdTypeQuery, getAllSolutionsQuery} = require("../models/queriesSolutions");


//Post DashBoard
exports.createDashboard = async (req, res) => {
  try {
    const { title, imageName, imageTitle, imageDescription } = req.body;
    const files = req.files;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    const dashboardId = await createDashboardQuery(title);

    if (files?.length) {
      for (let i = 0; i < files.length; i++) {
        await addDashboardImage(dashboardId, {
          imageUrl: `/images/upload/${files[i].filename}`,
          imageName: imageName?.[i] || null,
          imageTitle: imageTitle?.[i] || null,
          imageDescription: imageDescription?.[i] || null
        });
      }
    }

    res.status(201).json({
      message: "Dashboard created successfully",
      dashboardId
    });

  } catch (err) {
    console.error("CREATE DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



//getDashbord
exports.getAllDashboard = async (req, res) => {
  try {
    const rows = await getDashboardQuery();

    if (!rows.length) {
      return res.status(404).json({ message: "No dashboard found" });
    }

    const dashboard = {
      title: rows[0].title,
      images: []
    };

    rows.forEach(row => {
      if (row.imageUrl) {
        dashboard.images.push({
          imageUrl: row.imageUrl,
          imageName: row.imageName,
          imageTitle: row.imageTitle,
          imageDescription: row.imageDescription
        });
      }
    });

    res.json(dashboard);

  } catch (err) {
    console.error("GET DASHBOARD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};




//Post Solutions
exports.createSolution = async (req, res) => {
  try {
    const {
      prodType,
      name,
      description,
      title,
      imageName // 👈 custom names array
    } = req.body;

    const files = req.files;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
    }

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "Images required" });
    }

    // ✅ Normalize imageName (multer sends string if one value)
    const safeImageNames = Array.isArray(imageName)
      ? imageName
      : imageName
      ? [imageName]
      : [];

    // ✅ Create solution FIRST
    const solutionId = await createSalutionQuery(
      prodType,
      name,
      description,
      title
    );

    // ✅ Save images in DB
    for (let i = 0; i < files.length; i++) {
      await addSolutionImage(solutionId, {
        imageUrl: `/images/upload/${files[i].filename}`,
        imageName: safeImageNames[i] || null
      });
    }

    res.status(201).json({
      message: "Solution created successfully",
      solutionId
    });

  } catch (err) {
    console.error("CREATE SOLUTION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};





exports.getAllSolutions = async (req, res) => {
  try {
    const rows = await getAllSolutionsQuery();

    const solutionsMap = {};

    rows.forEach(row => {
      if (!solutionsMap[row.id]) {
        solutionsMap[row.id] = {
          id: row.id,
          prodType: row.prodType,
          name: row.name,
          description: row.description,
          title: row.title,
          created_at: row.created_at,
          images: []
        };
      }

      if (row.imageId) {
        solutionsMap[row.id].images.push({
          id: row.imageId,
          imageUrl: row.imageUrl,
          imageName: row.imageName
        });
      }
    });

    res.status(200).json(Object.values(solutionsMap));

  } catch (err) {
    console.error("GET ALL SOLUTIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getSolutionsByProdType = async (req, res) => {
  try {
    const { prodType } = req.params;

    const rows = await getSolutionsByProdTypeQuery(prodType);

    if (!rows.length) {
      return res
        .status(404)
        .json({ message: "No matching product type found" });
    }

    // 🔁 Group images per solution
    const solutionsMap = {};

    rows.forEach(row => {
      if (!solutionsMap[row.id]) {
        solutionsMap[row.id] = {
          id: row.id,
          prodType: row.prodType,
          name: row.name,
          title: row.title,
          description: row.description,
          createdAt: row.created_at,
          updatedAt: row.updated_at,
          images: []
        };
      }

      if (row.imageUrl) {
        solutionsMap[row.id].images.push({
          imageUrl: row.imageUrl,
          imageName: row.imageName
        });
      }
    });

    res.json(Object.values(solutionsMap));

  } catch (err) {
    console.error("Error filtering by product type:", err);
    res.status(500).json({ message: "Server error" });
  }
};


