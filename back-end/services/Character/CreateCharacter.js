const mongoose = require("mongoose");
const Joi = require("joi");

const Character = require("../../models/Character");
const Group = require("../../models/Group");
const Story = require("../../models/Story");

module.exports = async (req, res) => {
	req.body.uid = req.body.uid.split(" ").join("-");

	let validateCharacterResult = await validateCharacter(req.body);
	if (validateCharacterResult?.errors?.length > 0) return res.status(200).send({ errors: validateCharacterResult.errors });

	// New Character
	const character = new Character({
		_id: new mongoose.Types.ObjectId(),
		story_id: req.body.story_id,
		group_id: req.body.group_id,
		uid: req.body.uid,
		isPrimaryCharacter: req.body.isPrimaryCharacter,
		data: { name: req.body.name },
	});

	const group = await Group.findById(req.body.group_id)
		.exec()
		.catch(() => {
			return res.status(200).send({ errors: [{ message: "Group Not Found" }] });
		});
	if (!group) return res.status(200).send({ errors: [{ message: "Group Not Found" }] });

	if (!group.data.characters.includes(character._id)) group.data.characters.push({ character_id: character._id });

	try {
		await character.save();
	} catch (error) {
		return res.status(200).send({ errors: [{ message: "Character Could Not Be Created" }] });
	}

	try {
		await group.save();
	} catch (error) {
		return res.status(200).send({ errors: [{ message: "Character Could Not Be Added to Group" }] });
	}

	if (req?.body?.isPrimaryCharacter === true) {
		const story = await Story.findById(req.params.id)
			.exec()
			.catch(() => {});
		if (story) {
			story.data.primaryCharacters.push(character._id);
			try {
				await story.save();
			} catch (error) {}
		}
	}

	return res.status(200).send({ message: "Success", data: { character_uid: character.uid } });
};

async function validateCharacter(character) {
	let errors = [];

	const characterSchema = Joi.object({
		story_id: Joi.string().required(),
		group_id: Joi.string().required(),
		uid: Joi.string().min(1).max(64).required(),
		name: Joi.string().min(1).max(64).required(),
		isPrimaryCharacter: Joi.boolean().required(),
	});

	const characterValidationError = characterSchema.validate(character, { abortEarly: false })?.error?.details;

	if (characterValidationError) {
		let characterKeysData = [
			{ key: "story_id", name: "Story ID", indefiniteArticle: "a" },
			{ key: "group_id", name: "Group ID", indefiniteArticle: "a" },
			{ key: "uid", name: "UID", indefiniteArticle: "a" },
			{ key: "name", name: "Name", indefiniteArticle: "a" },
			{ key: "isPrimaryCharacter", name: "Primary Character", indefiniteArticle: "a" },
		];

		errors = errors.concat(
			characterValidationError.map((error) => {
				let keyData = characterKeysData.find((e) => e.key === error.path[0]);
				let message = "";

				switch (error.type) {
					case "string.empty":
						message = "Please Enter " + keyData.indefiniteArticle + " " + keyData.name;
						break;
					case "string.min":
						message =
							"Please Enter " +
							keyData.indefiniteArticle +
							" " +
							keyData.name +
							" That Is Above " +
							error.context.limit +
							" Characters";
						break;
					case "string.max":
						message =
							"Please Enter " +
							keyData.indefiniteArticle +
							" " +
							keyData.name +
							" That Is Below " +
							error.context.limit +
							" Characters";
						break;
					default:
						message = "An Unknown Error Has Occured. Please Try Again";
						break;
				}

				return { attribute: error.path[0], message };
			})
		);
	}

	const uidUsed = await Character.findOne({ uid: character.uid, story_id: character.story_id }).exec();
	if (uidUsed) errors.push({ attribute: "uid", message: "This UID is being used by another character. Please enter a different UID" });

	return { errors };
}
