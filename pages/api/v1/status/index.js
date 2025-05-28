const status = (request, response) => {
  response.status(200).json({ chave: "primeiro dado fornecido via api" });
};

export default status;
