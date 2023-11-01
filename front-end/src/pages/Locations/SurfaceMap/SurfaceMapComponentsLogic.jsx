// Packages
import { useContext, useEffect, useState, useCallback, useRef } from "react";
import { toPath } from "svg-points";

// Components

// Logic

// Context
import { LocationsContext } from "../LocationsContext";

// Services

// Styles

// Assets

export const SurfaceMapComponentsLogic = ({
	surfaceMapContainerRef,
	surfaceMapImageComponentsContainerRef,
	surfaceMapImageRef,
	surfaceMapDrawingShapeRef,
	surfaceMapImageNewComponentsRef,
	zoom,
	pointX,
	pointY,
	locationMapImage,
}) => {
	const {
		locations,
		setLocations,
		currentMapLocationId,
		setCurrentMapLocationId,
		isSelectingSurfaceMapComponents,
		regionSelectingSurfaceMapComponentsFor,
		selectedSurfaceMapComponents,
		surfaceMapComponentsList,
		setSurfaceMapHoveringRegion,
		addComponentToSelectedSurfaceMapComponents,
		removeComponentToSelectedSurfaceMapComponents,
		isDrawingSurfaceMapComponents,
	} = useContext(LocationsContext);

	const clicks = useRef([]);
	const clickTimeout = useRef(false);
	const readyToSelectComponent = useRef(true);
	const onClickMapComponent = useCallback(
		(index) => {
			function getNewClicks(oldClicks, maxDelta) {
				let newClicks = JSON.parse(JSON.stringify(oldClicks));

				let startIndex = 0;
				newClicks.map((curr_click, index) => {
					if (index === newClicks.length - 1) return false;
					const next_click = newClicks[index + 1];
					if (next_click - curr_click > maxDelta) startIndex = index + 1;
					return true;
				});

				return newClicks.filter((_, index) => index >= startIndex);
			}

			if (isSelectingSurfaceMapComponents) {
				if (!readyToSelectComponent.current) return false;
				readyToSelectComponent.current = false;
				setTimeout(() => {
					readyToSelectComponent.current = true;
				}, 10);
				if (
					Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList).includes(
						"locations-surface-map-image-component-in-region"
					)
				) {
					surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.remove(
						"locations-surface-map-image-component-in-region"
					);
					surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.remove(
						"locations-surface-map-image-component-selected"
					);
					removeComponentToSelectedSurfaceMapComponents(index);
					return true;
				}

				if (
					!Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList).includes(
						"locations-surface-map-image-component-selected"
					)
				) {
					surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.add(
						"locations-surface-map-image-component-selected"
					);
					addComponentToSelectedSurfaceMapComponents(index);
				} else {
					surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].classList.remove(
						"locations-surface-map-image-component-selected"
					);
					removeComponentToSelectedSurfaceMapComponents(index);
				}
				return false;
			}

			const maxDelta = 400;

			clicks.current.push(Date.now());
			clicks.current = getNewClicks(clicks.current, maxDelta);
			switch (clicks.current.length / 2) {
				case 1:
					clickTimeout.current = setTimeout(() => {
						// Single Click
					}, maxDelta);
					break;
				case 2:
					clearTimeout(clickTimeout.current);
					const location = locations.find((e) => e?._id === currentMapLocationId);
					const region_id = surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[index].getAttribute("data-region-id");
					const region = location?.data?.regions?.find((e) => e?._id === region_id);
					if (region?.location) setCurrentMapLocationId(region?.location);
					setSurfaceMapHoveringRegion(false);
					break;
				default:
					break;
			}
		},
		[
			isSelectingSurfaceMapComponents,
			surfaceMapImageComponentsContainerRef,
			addComponentToSelectedSurfaceMapComponents,
			removeComponentToSelectedSurfaceMapComponents,
			locations,
			currentMapLocationId,
			setCurrentMapLocationId,
			setSurfaceMapHoveringRegion,
		]
	);

	const onMouseOverMapComponent = useCallback(
		(index) => {
			const region = locations
				?.find((e) => e?._id === currentMapLocationId)
				?.data?.regions?.find((e) => e?._id === surfaceMapComponentsList[index]);
			setSurfaceMapHoveringRegion(region?._id);
			region?.components?.map((component_index) => {
				surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[component_index].classList.add(
					"locations-surface-map-image-component-hovering-over"
				);
				return true;
			});
		},
		[surfaceMapImageComponentsContainerRef, surfaceMapComponentsList, locations, currentMapLocationId, setSurfaceMapHoveringRegion]
	);

	const onMouseOutMapComponent = useCallback(
		(index) => {
			setSurfaceMapHoveringRegion(false);
			locations
				?.find((e) => e?._id === currentMapLocationId)
				?.data?.regions?.find((e) => e?._id === surfaceMapComponentsList[index])
				?.components?.map((component_index) => {
					surfaceMapImageComponentsContainerRef?.current?.children[0]?.children[component_index].classList.remove(
						"locations-surface-map-image-component-hovering-over"
					);
					return true;
				});
		},
		[surfaceMapImageComponentsContainerRef, surfaceMapComponentsList, locations, currentMapLocationId, setSurfaceMapHoveringRegion]
	);

	useEffect(() => {
		function setDefaultPosition() {
			setTimeout(() => {
				if (!surfaceMapImageComponentsContainerRef.current?.children) return false;

				try {
					const svg_width = surfaceMapImageComponentsContainerRef.current?.children[0].getAttribute("width");
					const image_width = surfaceMapImageRef?.current?.clientWidth;
					const image_height = surfaceMapImageRef?.current?.clientHeight;

					const max_component_width = Math.floor(image_width * (zoom.current / 1)) - 2;
					const max_component_height = Math.floor(image_height * (zoom.current / 1)) - 2;

					Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path) => {
						let { width, height } = path.getClientRects()[0];
						width *= image_width / svg_width;
						height *= image_width / svg_width;

						path.classList.add("locations-surface-map-image-component");

						if (width > max_component_width && height > max_component_height) {
							path.classList.add("locations-surface-map-image-component-delete");
						} else if (JSON.stringify(path.getAttribute("fill")) !== JSON.stringify("rgb(255,255,255)")) {
							path.classList.add("locations-surface-map-image-component-delete");
						}

						return true;
					});
					Array.from(document.getElementsByClassName("locations-surface-map-image-component-delete")).map((path) => path.remove());
					Array.from(document.getElementsByClassName("locations-surface-map-image-component-hovering-over")).map((path) =>
						path.classList.remove("locations-surface-map-image-component-hovering-over")
					);

					Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
						path.addEventListener("click", () => onClickMapComponent(index));
						path.addEventListener("mouseover", () => onMouseOverMapComponent(index));
						path.addEventListener("mouseout", () => onMouseOutMapComponent(index));
						return true;
					});
				} catch {}
			}, 50);
		}
		setDefaultPosition();
	}, [
		locationMapImage,
		onClickMapComponent,
		onMouseOutMapComponent,
		onMouseOverMapComponent,
		surfaceMapImageComponentsContainerRef,
		surfaceMapImageRef,
		zoom,
	]);

	useEffect(() => {
		try {
			Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
				let new_path = path.cloneNode(true);
				path.parentNode.replaceChild(new_path, path);
				if (isSelectingSurfaceMapComponents) new_path.addEventListener("click", () => onClickMapComponent(index));
				new_path.addEventListener("mouseover", () => onMouseOverMapComponent(index));
				new_path.addEventListener("mouseout", () => onMouseOutMapComponent(index));
				return true;
			});
		} catch {}
	}, [
		isSelectingSurfaceMapComponents,
		surfaceMapImageComponentsContainerRef,
		onClickMapComponent,
		onMouseOverMapComponent,
		onMouseOutMapComponent,
	]);

	useEffect(() => {
		try {
			Array.from(surfaceMapImageComponentsContainerRef?.current?.children[0]?.children)?.map((path, index) => {
				if (selectedSurfaceMapComponents.includes(index)) path.classList.add("locations-surface-map-image-component-selected");
				return true;
			});
		} catch {}
	}, [selectedSurfaceMapComponents, surfaceMapImageComponentsContainerRef]);

	const [surfaceMapImageComponentsStyles, setSurfaceMapImageComponentsStyles] = useState({});
	useEffect(() => {
		let newSurfaceMapImageComponentsStyles = {};
		const region = locations
			?.find((e) => e?._id === currentMapLocationId)
			?.data?.regions?.find((e) => e?._id === regionSelectingSurfaceMapComponentsFor);
		if (region?.colour) newSurfaceMapImageComponentsStyles["--regionSelectingForColour"] = region?.colour;
		setSurfaceMapImageComponentsStyles(newSurfaceMapImageComponentsStyles);
	}, [setSurfaceMapImageComponentsStyles, regionSelectingSurfaceMapComponentsFor, locations, currentMapLocationId]);

	// Drawing Shapes

	const isDrawingShape = useRef(false);
	const isDrawingLine = useRef(false);
	const drawingLine = useRef(false);
	const drawingLineFirstCoords = useRef(false);
	const drawingLineCurrFirstCoords = useRef(false);
	const firstDot = useRef(false);
	const drawingShapeCoords = useRef([]);

	const onMouseMove = useCallback(
		(e) => {
			if (!isDrawingSurfaceMapComponents) return false;
			if (!isDrawingShape.current) return false;

			const posX = e?.clientX / zoom.current - pointX.current / zoom.current;
			const posY = e?.clientY / zoom.current - pointY.current / zoom.current;

			if (isDrawingLine.current) {
				const dy = drawingLineCurrFirstCoords.current[1] - posY;
				const dx = drawingLineCurrFirstCoords.current[0] - posX;
				const theta = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

				const length = Math.hypot(
					Math.abs(drawingLineCurrFirstCoords.current[0] - posX),
					Math.abs(drawingLineCurrFirstCoords.current[1] - posY)
				);
				drawingLine.current.style = `height: ${length + 1}px; top: ${drawingLineCurrFirstCoords.current[1]}px; left: ${
					drawingLineCurrFirstCoords.current[0]
				}px; transform: rotate(${theta}deg);`;

				const dist_from_start = Math.hypot(
					Math.abs(drawingLineFirstCoords.current[0] - posX),
					Math.abs(drawingLineFirstCoords.current[1] - posY)
				);

				if (dist_from_start < Math.max(1, 10 / zoom.current) && firstDot?.current) {
					firstDot.current.classList.add("locations-surface-map-drawing-point-first-hovering");
				} else {
					firstDot.current.classList.remove("locations-surface-map-drawing-point-first-hovering");
				}
			}
		},
		[pointX, pointY, zoom, isDrawingSurfaceMapComponents]
	);

	const onMouseClick = useCallback(
		(e) => {
			if (!isDrawingSurfaceMapComponents) return false;

			const posX = e?.clientX / zoom.current - pointX.current / zoom.current;
			const posY = e?.clientY / zoom.current - pointY.current / zoom.current;

			if (!isDrawingShape.current) {
				isDrawingShape.current = true;
				isDrawingLine.current = true;
				drawingLineFirstCoords.current = [posX, posY];

				const dot = document.createElement("div");
				dot.classList.add("locations-surface-map-drawing-point");
				dot.style = `top: ${posY}px; left: ${posX}px;`;
				surfaceMapDrawingShapeRef.current.appendChild(dot);
				firstDot.current = dot;

				drawingShapeCoords.current = [[posX, posY]];

				drawingLine.current = document.createElement("div");
				drawingLine.current.classList.add("locations-surface-map-drawing-line");
				surfaceMapDrawingShapeRef.current.appendChild(drawingLine.current);
				drawingLineCurrFirstCoords.current = [posX, posY];
			} else {
				isDrawingLine.current = false;
				const dot = document.createElement("div");
				dot.classList.add("locations-surface-map-drawing-point");
				dot.style = `top: ${posY}px; left: ${posX}px;`;
				surfaceMapDrawingShapeRef.current.appendChild(dot);

				drawingShapeCoords.current.push([posX, posY]);

				const dist_from_start = Math.hypot(
					Math.abs(drawingLineFirstCoords.current[0] - posX),
					Math.abs(drawingLineFirstCoords.current[1] - posY)
				);

				if (dist_from_start < Math.max(1, 10 / zoom.current)) {
					isDrawingLine.current = false;
					isDrawingShape.current = false;

					Array.from(surfaceMapDrawingShapeRef.current.children).map((el) => el.remove());

					let newDrawingShapeCoords = JSON.parse(JSON.stringify(drawingShapeCoords.current));
					drawingShapeCoords.current = [];

					newDrawingShapeCoords = newDrawingShapeCoords.map((e) => [e[0] + 1.5, e[1] + 58.5]);
					const polygon = toPath({ type: "polygon", points: newDrawingShapeCoords.map((e1) => e1.join(",")).join(" ") });

					const xmlns = "http://www.w3.org/2000/svg";
					const newPathEl = document.createElementNS(xmlns, "path");
					newPathEl.setAttributeNS(null, "d", polygon);
					surfaceMapImageNewComponentsRef.current.appendChild(newPathEl);

					let newPath = `<path fill="rgb(255,255,255)" stroke="rgb(255,255,255)" stroke-width="4" opacity="1" d="${polygon}" />`;

					setLocations((oldLocations) => {
						let newLocations = JSON.parse(JSON.stringify(oldLocations));
						const locationIndex = newLocations.findIndex((e) => e?._id === currentMapLocationId);
						if (locationIndex === -1) return newLocations;
						let newMapImageComponents = newLocations[locationIndex]?.data?.mapImageComponents.replaceAll("</svg>", "");
						newLocations[locationIndex].data.mapImageComponents = newMapImageComponents + newPath + "</svg>";
						return newLocations;
					});
				} else {
					isDrawingLine.current = true;

					drawingLine.current = document.createElement("div");
					drawingLine.current.classList.add("locations-surface-map-drawing-line");
					drawingLine.current.style = `top: ${posY}px; left: ${posX}px;`;
					surfaceMapDrawingShapeRef.current.appendChild(drawingLine.current);
					drawingLineCurrFirstCoords.current = [posX, posY];
				}
			}
		},
		[
			pointX,
			pointY,
			zoom,
			surfaceMapDrawingShapeRef,
			surfaceMapImageNewComponentsRef,
			isDrawingSurfaceMapComponents,
			currentMapLocationId,
			setLocations,
		]
	);

	useEffect(() => {
		const surfaceMapContainerRefCurrent = surfaceMapContainerRef?.current;
		if (surfaceMapContainerRef?.current) surfaceMapContainerRefCurrent.addEventListener("mousemove", onMouseMove);
		if (surfaceMapContainerRef?.current) surfaceMapContainerRefCurrent.addEventListener("click", onMouseClick);
		return () => {
			surfaceMapContainerRefCurrent?.removeEventListener("mousemove", onMouseMove);
			surfaceMapContainerRefCurrent?.removeEventListener("click", onMouseClick);
		};
	}, [onMouseMove, onMouseClick, surfaceMapContainerRef]);

	useEffect(() => {
		if (surfaceMapImageNewComponentsRef?.current?.children) {
			Array.from(surfaceMapImageNewComponentsRef.current.children).map((el) => el.remove());
		}
	}, [isDrawingSurfaceMapComponents, surfaceMapImageNewComponentsRef]);

	return { surfaceMapImageComponentsStyles };
};
