import { db } from "../db.js";

exports.getRoot = (req, res) => {
    res.json({ message: 'Backend Rodando!' });
};
