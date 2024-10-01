const generateVerificationToken = async () => {
  const { nanoid } = await import('nanoid');
  const tokenLength = 10;
  const verificationToken = nanoid(tokenLength);
  return verificationToken;
};

module.exports = { generateVerificationToken };
