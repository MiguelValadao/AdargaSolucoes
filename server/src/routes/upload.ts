import { Router } from "express";
import multer from "multer";
import path from "path";
import { requireAuth } from "../middleware/auth";

const storage = multer.diskStorage({
  destination: path.resolve(__dirname, "../../uploads"),
  filename(_req, file, cb) {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(_req, file, cb) {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    cb(null, ext && mime);
  },
});

const router = Router();

router.post("/", requireAuth, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Envie um arquivo de imagem (jpg, png ou webp, até 5MB)." });
  }
  const url = `/uploads/${req.file.filename}`;
  return res.status(201).json({ url });
});

export default router;
