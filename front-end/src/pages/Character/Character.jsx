// Packages

// Components
import { CharacterPrimary } from "./CharacterPrimary/CharacterPrimary";
import { CharacterOverview } from "./CharacterOverview/CharacterOverview";
import { CharacterSectionSwitcher } from "./CharacterSectionSwitcher/CharacterSectionSwitcher";
import { CharacterSubpages } from "./CharacterSubpages/CharacterSubpages";
import { LoadingCircle } from "../../components/LoadingCircle/LoadingCircle";

// Logic
import { CharacterLogic } from "./CharacterLogic";

// Context

// Services

// Styles
import "./Character.css";

// Assets

export const Character = () => {
	const {
		characterStyle,
		characterPrimaryRef,
		isOnOverviewSection,
		characterContainerRef,
		characterOverviewContainerRef,
		characterSubpagesContainerRef,
	} = CharacterLogic();

	return (
		<div
			ref={characterContainerRef}
			className={
				isOnOverviewSection
					? "character-container character-container-is-on-overview"
					: "character-container character-container-is-on-subpages"
			}
			style={characterStyle ? characterStyle : {}}
		>
			<div className={characterStyle ? "character" : "character character-hidden"}>
				<CharacterPrimary characterPrimaryRef={characterPrimaryRef} />
				<div
					className={
						isOnOverviewSection
							? "character-content-container character-content-container-is-on-overview"
							: "character-content-container character-content-container-is-on-subpages"
					}
				>
					<CharacterOverview innerRef={characterOverviewContainerRef} />
					<CharacterSectionSwitcher />
					<CharacterSubpages innerRef={characterSubpagesContainerRef} />
				</div>
			</div>
			<div className='character-loading-container'>
				<LoadingCircle size='l' />
			</div>
		</div>
	);
};
