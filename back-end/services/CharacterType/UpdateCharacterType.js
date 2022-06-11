const CharacterType = require("../../models/CharacterType");
const ChangeValueInNestedObject = require("../ChangeValueInNestedObject");

module.exports = async (req, res) => {
	if (!req?.body?.path || req?.body?.path === ["_id"]) return res.status(200).send({ errors: [{ message: "Invalid Path" }] });

	const oldCharacterType = await CharacterType.findById(req.params.id)
		.exec()
		.catch(() => {
			return res.status(200).send({ errors: [{ message: "Character Type Not Found" }] });
		});
	if (!oldCharacterType) return res.status(200).send({ errors: [{ message: "Character Type Not Found" }] });

	const newCharacterType = ChangeValueInNestedObject(JSON.parse(JSON.stringify(oldCharacterType)), req?.body?.path, req?.body?.newValue);

	try {
		await CharacterType.findOneAndReplace({ _id: req.params.id }, newCharacterType, { upsert: true });
	} catch (error) {
		return res.status(200).send({ errors: [{ message: "Character Type Could Not Be Saved" }] });
	}

	return res.status(200).send({ message: "Success", data: { characterType: newCharacterType } });
};
