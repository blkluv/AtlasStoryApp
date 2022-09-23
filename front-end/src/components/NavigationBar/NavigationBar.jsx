// Packages
import { FaUser, FaSearch, FaBookOpen, FaGlobeEurope, FaBook } from "react-icons/fa";

// Components

// Logic
import { NavigationBarLogic } from "./NavigationBarLogic";

// Context

// Styles
import "./NavigationBar.css";

// Assets

export const NavigationBar = () => {
	const {
		isOnStory,
		storyIcon,
		userProfilePicture,
		navigateToProfile,
		navigateToSearch,
		navigateToStory,
		navigateToCharacters,
		navigateToSubstories,
		navigateToWorld,
	} = NavigationBarLogic();

	return (
		<div className='navigation-bar'>
			<div className='navigation-bar-primary-button-container'>
				<button
					className={userProfilePicture ? "navigation-bar-btn navigation-bar-btn-with-image" : "navigation-bar-btn"}
					onClick={navigateToProfile}
					onAuxClick={navigateToProfile}
				>
					{!userProfilePicture ? (
						<div className='navigation-bar-btn-user-placeholder' />
					) : (
						<img src={userProfilePicture} alt='' draggable={false} />
					)}
				</button>
				<button className='navigation-bar-btn navigation-bar-btn-search' onClick={navigateToSearch} onAuxClick={navigateToSearch}>
					<FaSearch />
				</button>
			</div>
			{!isOnStory ? (
				<div className='navigation-bar-placeholder-section' />
			) : (
				<>
					<div className='navigation-bar-story-button-container'>
						<button
							className={storyIcon ? "navigation-bar-btn navigation-bar-btn-with-image" : "navigation-bar-btn"}
							onClick={navigateToStory}
							onAuxClick={navigateToStory}
						>
							{!storyIcon ? <FaBook /> : <img src={storyIcon} alt='' draggable={false} />}
						</button>
						<button className='navigation-bar-btn' onClick={navigateToCharacters} onAuxClick={navigateToCharacters}>
							<FaUser />
						</button>
						<button className='navigation-bar-btn' onClick={navigateToSubstories} onAuxClick={navigateToSubstories}>
							<FaBookOpen />
						</button>
						<button className='navigation-bar-btn' onClick={navigateToWorld} onAuxClick={navigateToWorld}>
							<FaGlobeEurope />
						</button>
					</div>
					<div className='navigation-bar-placeholder-section navigation-bar-placeholder-section-story-open' />
				</>
			)}
		</div>
	);
};
