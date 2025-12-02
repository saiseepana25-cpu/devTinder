const validateEditProfileData = (req) => {
  const allowed_fields = [
    "firstName",
    "lastName",
    "about",
    "skills",
    "photoUrl",
    "gender",
    "age",
  ];
  const data = req.body;
  const result = Object.keys(data).every((val) => allowed_fields.includes(val));
  return result;
};
module.exports = validateEditProfileData;
