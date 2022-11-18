const express = require("express");
const router = express.Router();

const Authenticate = require("../services/TokenAuthentication");
const CookieConsentAuthentication = require("../services/CookiesConsent/CookieConsentAuthentication");
const StoryMemberAuthentication = require("../services/StoryMemberAuthentication");
const StoryAuthentication = require("../services/StoryAuthentication");

const GetSubstory = require("../services/Substory/GetSubstory");
const GetSubstoryByID = require("../services/Substory/GetSubstoryByID");
const GetSubstoryValueByID = require("../services/Substory/GetSubstoryValueByID");
const CreateSubstory = require("../services/Substory/CreateSubstory");
const UpdateSubstory = require("../services/Substory/UpdateSubstory");
const DeleteSubstory = require("../services/Substory/DeleteSubstory");

router.get("/", StoryMemberAuthentication, GetSubstory);
router.get("/:id", StoryMemberAuthentication, GetSubstoryByID);
router.post("/get-value/:id", StoryMemberAuthentication, GetSubstoryValueByID);
router.post("/", CookieConsentAuthentication, Authenticate, StoryMemberAuthentication, StoryAuthentication, CreateSubstory);
router.patch("/:id", CookieConsentAuthentication, Authenticate, StoryMemberAuthentication, StoryAuthentication, UpdateSubstory);
router.delete("/:id", CookieConsentAuthentication, Authenticate, StoryMemberAuthentication, StoryAuthentication, DeleteSubstory);

module.exports = router;
