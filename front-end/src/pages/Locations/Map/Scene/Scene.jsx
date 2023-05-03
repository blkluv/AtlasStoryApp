// Packages
import { useContext, useEffect, useState, useRef } from "react";

// Components
import { StarCluster } from "./StarCluster/StarCluster";
import { StarSystem } from "./StarSystem/StarSystem";

// Logic

// Context
import { LocationsContext } from "../../LocationsContext";

// Services
import { HierarchyFunctions } from "../../HierarchyFunctions";

// Styles

// Assets

export const Scene = ({ setCursorPointer }) => {
	const { story, locations, currentMapLocationId } = useContext(LocationsContext);
	const { getItemFromIdInHierarchy } = HierarchyFunctions();
	const [scene, setScene] = useState(null);
	const [hasInitializedScenes, setHasInitializedScenes] = useState(false);

	const scenes = useRef([
		{ type: "starCluster", scene: StarCluster },
		{ type: "starSystem", scene: StarSystem },
	]);

	useEffect(() => {
		async function initializeScenes() {
			const placeholderLocationsHierarchy = [
				{
					_id: "reality",
					children: [
						{
							_id: "starCluster",
							children: [
								{
									_id: "starSystem",
									children: [
										{ _id: "star", children: [] },
										{ _id: "planet", children: [{ _id: "moon", children: [] }] },
									],
								},
							],
						},
					],
				},
			];

			const placeholderLocations = [
				{ _id: "reality", type: "reality", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, paths: [] },
				{ _id: "starCluster", type: "starCluster", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, paths: [] },
				{ _id: "starSystem", type: "starSystem", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, paths: [] },
				{ _id: "star", type: "star", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, paths: [] },
				{ _id: "planet", type: "planet", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, paths: [] },
				{ _id: "moon", type: "moon", position: [0, 0, 0], rotation: [0, 0, 0], scale: 1, paths: [] },
			];

			setScene(
				<group>
					{scenes.current.map((scenesItem, index) => {
						const hierarchyItem = getItemFromIdInHierarchy(
							JSON.parse(JSON.stringify(scenesItem?.type)),
							JSON.parse(JSON.stringify(placeholderLocationsHierarchy))
						);
						return (
							<scenesItem.scene
								key={index}
								location={placeholderLocations.find((e) => e?._id === scenesItem?.type)}
								locations={placeholderLocations}
								hierarchyItem={hierarchyItem}
								setCursorPointer={setCursorPointer}
							/>
						);
					})}
				</group>
			);

			setTimeout(() => setHasInitializedScenes(true), 2200);
		}
		initializeScenes();
	}, [scenes, getItemFromIdInHierarchy, setCursorPointer]);

	useEffect(() => {
		function getScene() {
			if (!hasInitializedScenes) return false;
			if (currentMapLocationId === false) return setScene(null);

			const location = locations.find((e) => JSON.stringify(e?._id) === JSON.stringify(currentMapLocationId));

			const hierarchyItem = getItemFromIdInHierarchy(
				JSON.parse(JSON.stringify(currentMapLocationId)),
				JSON.parse(JSON.stringify(story?.data?.locationsHierarchy))
			);

			const NewScene = scenes.current.find((e) => e?.type === location?.type)?.scene;
			if (!NewScene) return false;

			setScene(<NewScene location={location} locations={locations} hierarchyItem={hierarchyItem} setCursorPointer={setCursorPointer} />);
		}
		getScene();
	}, [setScene, story, locations, currentMapLocationId, getItemFromIdInHierarchy, setCursorPointer, scenes, hasInitializedScenes]);

	return scene;
};
