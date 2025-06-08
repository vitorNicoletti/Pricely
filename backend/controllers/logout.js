function logout(req, res) {
  return res.status(200).json({ message: "Logout bem-sucedido" });
}

module.exports = {logout};
