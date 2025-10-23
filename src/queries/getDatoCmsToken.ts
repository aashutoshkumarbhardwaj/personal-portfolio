export const getDatoCmsToken = (): string => {
  const token = process.env.REACT_APP_DATOCMS_ROR_TOKEN;

  if (!token) {
    throw new Error(
      "No DatoCMS token found. Please set REACT_APP_DATOCMS_ROR_TOKEN in your environment variables."
    );
  }

  return token;
};
