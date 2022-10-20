// Packages
import { useState, useEffect, useContext } from "react";

// Components

// Logic

// Context
import { CharacterContext } from "../../../../../CharacterContext";

// Services

// Styles

// Assets

export const AbilityStatisticsChartLogic = ({ ability }) => {
	const { character, isOnOverviewSection } = useContext(CharacterContext);

	const [graphData, setGraphData] = useState(false);
	const [graphOptions, setGraphOptions] = useState(false);

	useEffect(() => {
		function getGraphData() {
			let newGraphData = { labels: [], datasets: [{ data: [] }] };
			newGraphData.labels = ability.statistics.values.map((value) => value?.label);
			newGraphData.datasets[0].data = ability.statistics.values.map((value) => value?.value);
			newGraphData.datasets[0].label = "";
			newGraphData.datasets[0].backgroundColor = character?.data?.colour ? character?.data?.colour + "55" : "#0044ff55";
			newGraphData.datasets[0].borderColor = character?.data?.colour ? character?.data?.colour : "#0044ff";
			newGraphData.datasets[0].borderWidth = 2;
			newGraphData.datasets[0].pointBackgroundColor = character?.data?.colour ? character?.data?.colour : "#0044ff";
			return newGraphData;
		}
		function getGraphOptions() {
			let newGraphOptions = {
				scales: {
					r: {
						legend: {
							display: false,
						},
						min: 0,
						max: ability?.statistics?.maxValue,
						stepSize: 1,
						ticks: {
							display: false,
							beginAtZero: true,
							color: "#444",
						},
						pointLabels: {
							color: "#fff",
							font: {
								size: 14,
							},
						},
						grid: {
							display: true,
							lineWidth: 2,
							color: "#444",
							borderColor: "#888",
						},
					},
				},
				plugins: {
					legend: {
						display: false,
					},
				},
				animation: {
					duration: 0,
				},
				responsive: true,
				aspectRatio: 1,
				maintainAspectRatio: true,
			};
			return newGraphOptions;
		}
		setGraphData(getGraphData());
		setGraphOptions(getGraphOptions());
	}, [ability, setGraphData, setGraphOptions, character]);

	return { isOnOverviewSection, graphData, graphOptions };
};
