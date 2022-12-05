const CharacterRelationship = require("../../models/CharacterRelationship");

const ChangeValueInNestedObject = require("../ChangeValueInNestedObject");

module.exports = async (req, res) => {
	const oldCharacterRelationship = await CharacterRelationship.findById(req.params.id)
		.exec()
		.catch(() => false);
	if (!oldCharacterRelationship) return res.status(200).send({ errors: [{ message: "Character Relationship Not Found" }] });

	let newCharacterRelationship = JSON.parse(JSON.stringify(oldCharacterRelationship));
	if (req?.body?.path) {
		if (req?.body?.path === ["_id"] || req?.body?.path === ["story_id"]) return res.status(200).send({ errors: [{ message: "Invalid Path" }] });

		newCharacterRelationship = ChangeValueInNestedObject(
			JSON.parse(JSON.stringify(oldCharacterRelationship)),
			req?.body?.path,
			req?.body?.newValue
		);
	} else {
		newCharacterRelationship.relationship_type = req?.body?.newValue?.relationship_type;
		newCharacterRelationship.character_ids = req?.body?.newValue?.character_ids;
	}

	try {
		await CharacterRelationship.findOneAndReplace({ _id: req.params.id }, newCharacterRelationship, { upsert: true });
	} catch (error) {
		return res.status(200).send({ errors: [{ message: "Character Relationship Could Not Be Saved" }] });
	}

	return res.status(200).send({ message: "Success", data: { characterRelationship: newCharacterRelationship } });
};
