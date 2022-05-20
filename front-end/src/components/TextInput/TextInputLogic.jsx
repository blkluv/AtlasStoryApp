// Packages
import { useRef, useState } from "react";

// Components

// Logic

// Context

// Services

// Styles

// Assets

export const TextInputLogic = (props) => {
	const inputContainerRef = useRef();
	const inputRef = useRef();
	const [focused, setFocused] = useState(false);
	const DynamicIconComponent = props.icon;

	function inputClassName(props, focused) {
		let className = "text-input-container";
		if (props.className) className += " " + props.className;
		if (focused) className += " text-input-container-focused";
		if (props.value === undefined || props.value === "") className += " text-input-container-empty";
		if (props.isSaved === false && !focused) className += " text-input-container-unsaved";
		if (props.isDark) className += " text-input-container-dark";
		if (props.hideValue) className += " text-input-container-hide-value";
		return className;
	}

	function selectAll() {
		if (inputRef && inputRef.current) inputRef.current.select();
	}

	function focusOnInput() {
		if (inputRef && inputRef.current) inputRef.current.focus();
	}

	function onInputContainerFocus() {
		setFocused(true);
	}

	function onInputContainerBlur() {
		setFocused(false);
	}

	// Hide Value
	const [isHidden, setIsHidden] = useState(true);

	function toggleIsHidden(e) {
		e.stopPropagation();
		setIsHidden((oldIsHidden) => !oldIsHidden);
	}

	return {
		inputContainerRef,
		inputRef,
		focused,
		inputClassName,
		DynamicIconComponent,
		selectAll,
		focusOnInput,
		onInputContainerFocus,
		onInputContainerBlur,
		isHidden,
		toggleIsHidden,
	};
};
