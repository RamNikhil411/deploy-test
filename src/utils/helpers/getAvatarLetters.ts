export const getAvatarLetters = (full_name?: string) => {
  if (!full_name) return "";

  const words = full_name.trim().split(" ");

  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  } else {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
};
