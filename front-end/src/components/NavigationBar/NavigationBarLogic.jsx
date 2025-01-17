// Packages
import { useEffect, useState, useContext } from "react";

// Components

// Logic

// Context
import { APIContext } from "../../context/APIContext";
import { RoutesContext } from "../../context/RoutesContext";
import { StoryContext } from "../../context/StoryContext";

// Styles

// Assets

export const NavigationBarLogic = () => {
	const [isOnStory, setIsOnStory] = useState(false);
	const { username, userProfilePicture } = useContext(APIContext);
	const { location, changeLocation } = useContext(RoutesContext);
	const { isActuallyAuthorizedToEdit, isAuthorizedToEdit, setIsAuthorizedToEdit, isInEditorMode, storyIcon } = useContext(StoryContext);

	useEffect(() => {
		setIsOnStory(location.split("/")[1] === "s");
	}, [location]);

	function getBtnClassName(btnName, isWithImage) {
		let newBtnClassName = "navigation-bar-btn";
		if (isWithImage) newBtnClassName += " navigation-bar-btn-with-image";
		if (btnName) {
			newBtnClassName += " navigation-bar-btn-" + btnName;
			const locationSplit = location.split("/").filter((e) => e !== "");
			switch (btnName) {
				case "user":
					if (
						(locationSplit.length === 2 && locationSplit[0] === "u" && locationSplit[1] === username) ||
						(locationSplit.length === 1 && locationSplit[0] === "settings")
					) {
						newBtnClassName += " navigation-bar-btn-active";
					}
					break;
				case "home":
					if (locationSplit.length === 1 && locationSplit[0] === "home") {
						newBtnClassName += " navigation-bar-btn-active";
					}
					break;
				case "story":
					if (
						(locationSplit.length === 2 && locationSplit[0] === "s") ||
						(locationSplit.length === 3 && locationSplit[0] === "s" && locationSplit[2] === "notes")
					) {
						newBtnClassName += " navigation-bar-btn-active";
					}
					break;
				case "characters":
					if (
						(locationSplit.length === 3 && locationSplit[2] === "characters") ||
						(locationSplit.length === 4 && locationSplit[2] === "c") ||
						(locationSplit.length === 4 && locationSplit[2] === "g") ||
						(locationSplit.length === 4 && locationSplit[2] === "characters" && locationSplit[3] === "notes")
					) {
						newBtnClassName += " navigation-bar-btn-active";
					}
					break;
				case "plots":
					if (
						(locationSplit.length === 3 && locationSplit[2] === "plots") ||
						(locationSplit.length === 4 && locationSplit[2] === "p") ||
						(locationSplit.length === 4 && locationSplit[2] === "plots" && locationSplit[3] === "notes")
					) {
						newBtnClassName += " navigation-bar-btn-active";
					}
					break;
				case "world":
					if (
						(locationSplit.length === 3 && locationSplit[2] === "world") ||
						(locationSplit.length === 4 && locationSplit[2] === "world" && locationSplit[3] === "notes") ||
						(locationSplit.length === 3 && locationSplit[2] === "locations") ||
						(locationSplit.length === 4 && locationSplit[2] === "locations") ||
						(locationSplit.length === 3 && locationSplit[2] === "events") ||
						(locationSplit.length === 4 && locationSplit[2] === "events") ||
						(locationSplit.length === 3 && locationSplit[2] === "objects") ||
						(locationSplit.length === 4 && locationSplit[2] === "objects") ||
						(locationSplit.length === 3 && locationSplit[2] === "world-building") ||
						(locationSplit.length === 4 && locationSplit[2] === "world-building") ||
						(locationSplit.length === 4 && locationSplit[2] === "l") ||
						(locationSplit.length === 4 && locationSplit[2] === "e") ||
						(locationSplit.length === 4 && locationSplit[2] === "o") ||
						(locationSplit.length === 4 && locationSplit[2] === "w")
					) {
						newBtnClassName += " navigation-bar-btn-active";
					}
					break;
				default:
					break;
			}
		}
		return newBtnClassName;
	}

	function navigateToProfile(e) {
		if (username) {
			changeLocation("/u/" + username, e.button === 1);
		} else {
			changeLocation("/login", e.button === 1);
		}
	}

	function navigateToHome(e) {
		if (username) {
			changeLocation("/home", e.button === 1);
		} else {
			changeLocation("/login", e.button === 1);
		}
	}

	function navigateToStory(e) {
		if (location.split("/")[1] === "s" && location.split("/").length < 3) return;
		changeLocation("/s/" + location.split("/")[2], e.button === 1);
	}

	function navigateToCharacters(e) {
		if (location.split("/")[1] === "s" && location.split("/").length < 3) return;
		changeLocation("/s/" + location.split("/")[2] + "/characters", e.button === 1);
	}

	function navigateToSubstories(e) {
		if (location.split("/")[1] === "s" && location.split("/").length < 3) return;
		changeLocation("/s/" + location.split("/")[2] + "/plots", e.button === 1);
	}

	function navigateToWorld(e) {
		if (location.split("/")[1] === "s" && location.split("/").length < 3) return;
		changeLocation("/s/" + location.split("/")[2] + "/world", e.button === 1);
	}

	function toggleIsAuthorizedToEdit() {
		setIsAuthorizedToEdit((e) => {
			isInEditorMode.current = !e;
			return !e;
		});
	}

	return {
		isActuallyAuthorizedToEdit,
		isAuthorizedToEdit,
		isOnStory,
		userProfilePicture,
		storyIcon,
		getBtnClassName,
		navigateToProfile,
		navigateToHome,
		navigateToStory,
		navigateToCharacters,
		navigateToSubstories,
		navigateToWorld,
		toggleIsAuthorizedToEdit,
	};
};
