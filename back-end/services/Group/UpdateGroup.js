const Group = require("../../models/Group");

const ChangeValueInNestedObject = require("../ChangeValueInNestedObject");

module.exports = async (req, res) => {
	if (!req?.body?.path || req?.body?.path === ["_id"]) return res.status(200).send({ errors: [{ message: "Invalid Path" }] });

	const oldGroup = await Group.findById(req.params.id)
		.exec()
		.catch(() => false);
	if (!oldGroup) return res.status(200).send({ errors: [{ message: "Group Not Found" }] });

	// Story Authentication Check
	if (JSON.stringify(oldGroup.story_id) !== JSON.stringify(req.body.story_id))
		return res.status(200).send({ errors: [{ message: "Access Denied" }] });

	const newGroup = ChangeValueInNestedObject(JSON.parse(JSON.stringify(oldGroup)), req?.body?.path, req?.body?.newValue);

	try {
		await Group.findOneAndReplace({ _id: req.params.id }, newGroup, { upsert: true });
	} catch (error) {
		return res.status(200).send({ errors: [{ message: "Group Could Not Be Saved" }] });
	}

	return res.status(200).send({ message: "Success", data: { group: newGroup } });
};
