import { Router } from "express";

const router = Router();

// ResponseGame[]
router.get("/", (req, res) => {});

// ResponseGame
router.get("/:id", (req, res) => {});

// ResponseMove[]
router.get("/moves", (req, res) => {});

// ResponseMove
router.get("/moves/:id", (req, res) => {});

// ResponseMove
router.post("/moves", (req, res) => {});
