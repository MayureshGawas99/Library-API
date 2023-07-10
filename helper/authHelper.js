import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  } catch (error) {
    console.log(error);
  }
};

export const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

export const showError = (
  res,
  error,
  message = "Something went Wrong",
  status = 500
) => {
  console.log(error);
  return res.status(status).send({
    success: false,
    error,
    message,
  });
};

export const getCurrentdate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = d.getMonth();
  const date = d.getDate();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;
};
