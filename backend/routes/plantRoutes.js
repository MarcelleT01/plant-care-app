import express from "express";
import multer from "multer";
import Plant from "../models/Plant.js";

const router = express.Router();

// Config multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Route POST
router.post("/plants", upload.single("image"), async (req, res) => {
  try {
    const newPlant = new Plant({
      name: req.body.name,
      species: req.body.species,
      purchaseDate: req.body.purchaseDate,
      wateringNeeds: {
        quantity: req.body.waterQuantity,
        frequency: req.body.waterFrequency,
      },
      image: req.file ? req.file.path : null,
    });

    await newPlant.save();
    res.status(201).json(newPlant);
  } catch (error) {
    console.error("Erreur backend:", error);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

export default router;
