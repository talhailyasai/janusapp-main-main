export const generateUniqueCode = () => {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let alphabets = "";

  for (let i = 0; i < 3; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    alphabets += alphabet.charAt(randomIndex);
  }

  const numbers = (Math.random() * 1000).toFixed(0).padStart(3, "0");

  return alphabets + numbers;
};
