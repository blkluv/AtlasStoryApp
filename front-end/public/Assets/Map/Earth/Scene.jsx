import React, { useRef } from "react";
import { useGLTF, useAnimations } from "@react-three/drei";

export function Model(props) {
	const group = useRef();
	const { nodes, materials, animations } = useGLTF("/Assets/Map/Earth/scene.gltf");
	const { actions } = useAnimations(animations, group);
	return (
		<group ref={group} {...props} dispose={null}>
			<group name='Sketchfab_Scene'>
				<group name='Sketchfab_model' rotation={[-Math.PI / 2, 0, 0]} scale={10}>
					<group name='157f21a0fd4a468082d7f17951348031fbx' rotation={[Math.PI / 2, 0, 0]}>
						<group name='Object_2'>
							<group name='RootNode'>
								<group name='Earth_Grp'>
									<group name='group1' rotation={[0, -0.11, 0.19]}>
										<group name='Nubes' position={[-0.22, 0, 0]}>
											<mesh
												name='Nubes_tierra_nubes_0'
												geometry={nodes.Nubes_tierra_nubes_0.geometry}
												material={materials.tierra_nubes}
											/>
										</group>
										<group name='Atmosfera' scale={1.02}>
											<mesh
												name='Atmosfera_tierra_atmosfera_01_0'
												geometry={nodes.Atmosfera_tierra_atmosfera_01_0.geometry}
												material={materials.tierra_atmosfera_01}
											/>
										</group>
										<group name='Tierra'>
											<mesh
												name='Tierra_Tierra_blin_superficie_0'
												geometry={nodes.Tierra_Tierra_blin_superficie_0.geometry}
												material={materials.Tierra_blin_superficie}
											/>
										</group>
										<group name='Atmosfera1' scale={1.04}>
											<mesh
												name='Atmosfera1_tierra_atmosfera_02_0'
												geometry={nodes.Atmosfera1_tierra_atmosfera_02_0.geometry}
												material={materials.tierra_atmosfera_02}
											/>
										</group>
									</group>
								</group>
							</group>
						</group>
					</group>
				</group>
			</group>
		</group>
	);
}

useGLTF.preload("/Assets/Map/Earth/scene.gltf");