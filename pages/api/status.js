function status(request, response) {
  response.status(200).json({ chave: "Response OK" });
}

export default status;