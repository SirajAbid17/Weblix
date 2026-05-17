const jsonExtract = (textdata) => {
  if (!textdata) return "";


  let cleaned = textdata
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/`/g, "")
    .trim();


  const startBracket = cleaned.indexOf("{");
  const closeBracket = cleaned.lastIndexOf("}");

  if (startBracket === -1 || closeBracket === -1) {
    return null;
  }


  const jsonString = cleaned.slice(startBracket, closeBracket + 1);


  try {
    return JSON.parse(jsonString);
  } catch (err) {
    return null;
  }
};

export default jsonExtract;