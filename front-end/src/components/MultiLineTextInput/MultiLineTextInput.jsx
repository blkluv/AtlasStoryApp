// Packages

// Components
import { AITools } from "../AIToolsMenu/AITools";

// Logic
import { MultiLineTextInputLogic } from "./MultiLineTextInputLogic";

// Context

// Services

// Styles
import "./MultiLineTextInput.css";

// Assets

export const MultiLineTextInput = (props) => {
	const {
		inputContainerRef,
		inputRef,
		inputHeightRef,
		inputClassName,
		DynamicIconComponent,
		selectAll,
		onClick,
		onInputContainerFocus,
		onInputContainerBlur,
		onKeyDownTextArea,
		focused,
		inputContainerStyles,
	} = MultiLineTextInputLogic(props);

	return (
		<div ref={inputContainerRef} className={inputClassName} onClick={onClick} style={inputContainerStyles}>
			<div className='multi-line-text-input'>
				<div className='multi-line-text-input-label'>
					{props.icon ? <DynamicIconComponent /> : null}
					<span onClick={selectAll}>{props.label}</span>
				</div>

				<textarea
					ref={inputRef}
					value={props.value === undefined ? [""] : props.value}
					onChange={props.onChange}
					autoComplete={props.autocomplete}
					onFocus={onInputContainerFocus}
					onBlur={onInputContainerBlur}
					onKeyDown={onKeyDownTextArea}
				/>

				<div className='multi-line-text-input-height-element'>
					<div ref={inputHeightRef}>
						{props.value === undefined
							? ""
							: Array.isArray(props.value)
							? props.value.map((paragraph, index) => {
									return <p key={index}>{paragraph}</p>;
							  })
							: props.value.split("\n").map((paragraph, index) => {
									return <p key={index}>{paragraph}</p>;
							  })}
					</div>
				</div>
			</div>

			{!props?.aiTools ? null : (
				<div className='multi-line-text-input-ai-tools-container'>
					<AITools type='text' context={{ text: props.value }} isDisplayingButtons={focused} />
				</div>
			)}
		</div>
	);
};
