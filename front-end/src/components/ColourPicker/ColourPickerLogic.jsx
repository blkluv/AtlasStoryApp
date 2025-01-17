// Packages
import { useState, useEffect } from "react";

// Components

// Logic

// Context

// Services
import isValidHexColour from "../../services/IsValidHexColour";

// Styles

// Assets

export const ColourPickerLogic = ({ value, onChange, size, enableEdit, pickerVerticalPlacement, horizontalAlignment, circular, presetColours }) => {
	const [colourPickerClassName, setColourPickerClassName] = useState(
		pickerVerticalPlacement === "bottom" ? "colour-picker colour-picker-placement-bottom" : "colour-picker"
	);
	const [isShowingPicker, setIsShowingPicker] = useState(false);

	const [colourBlockStyle, setColourBlockStyle] = useState({});

	useEffect(() => {
		function getColourPickerClassName() {
			let className = "colour-picker";
			if (size) className += " colour-picker-size-" + size;
			if (enableEdit) className += " colour-picker-is-editing";
			if (pickerVerticalPlacement === "bottom") className += " colour-picker-placement-bottom";
			if (horizontalAlignment === "right") className += " colour-picker-alignment-right";
			if (circular) className += " colour-picker-circular";
			if (isShowingPicker) className += " colour-picker-is-showing-picker";
			return className;
		}
		setColourPickerClassName(getColourPickerClassName());
	}, [setColourPickerClassName, size, enableEdit, pickerVerticalPlacement, horizontalAlignment, circular, isShowingPicker]);

	useEffect(() => {
		setColourBlockStyle(isValidHexColour(value) ? { background: value } : {});
	}, [value]);

	async function onSketchPickerChange(colour) {
		await onChange(colour.hex);
	}

	const [currentPresetColours, setCurrentPresetColours] = useState([]);

	useEffect(() => {
		const defaultPresetColours = [
			{ color: "#0044ff", title: "Blue" },
			{ color: "#ff0000", title: "Red" },
			{ color: "#ff0055", title: "Pink" },
			{ color: "#aa00ff", title: "Purple" },
			{ color: "#d4af37", title: "Gold" },
			{ color: "#bbbbbb", title: "Silver" },
			{ color: "#ffdd00", title: "Yellow" },
			{ color: "#ff7700", title: "Orange" },
		];

		function getCurrentPresetColours() {
			let newCurrentPresetColours = [];
			if (presetColours) newCurrentPresetColours = newCurrentPresetColours.concat(presetColours);
			newCurrentPresetColours = newCurrentPresetColours.concat(defaultPresetColours);
			setCurrentPresetColours(newCurrentPresetColours);
		}
		getCurrentPresetColours();
	}, [setCurrentPresetColours, presetColours]);

	return { colourPickerClassName, isShowingPicker, setIsShowingPicker, colourBlockStyle, currentPresetColours, onSketchPickerChange };
};
