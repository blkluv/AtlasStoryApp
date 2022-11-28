const CharacterRelationship = require("../../models/CharacterRelationship");
const Story = require("../../models/Story");

module.exports = async (req, res) => {
	let story_id = false;
	if (req?.query?.story_id) {
		story_id = req.query.story_id;
	} else if (req?.query?.story_uid) {
		const story = await Story.findOne({ uid: req.query.story_uid })
			.exec()
			.catch(() => false);
		if (story?._id) story_id = story._id;
	}
	if (!story_id) return res.status(200).send({ errors: [{ message: "Story Not Found" }] });

	const characterRelationships = await CharacterRelationship.find({ story_id })
		.exec()
		.catch(() => []);
	if (!characterRelationships) return res.status(200).send({ errors: [{ message: "Character Relationships Not Found" }] });

	return res.status(200).send({ message: "Success", data: { characterRelationships } });
};
