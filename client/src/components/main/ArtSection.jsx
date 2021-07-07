import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import * as Three from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function ArtSection({ imageData }) {
  const mount = useRef(null);

  useEffect(() => {
    let width = mount.current.clientWidth;
    let height = width * 0.5625;

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor('#000000');

    camera.position.setZ(1.5);

    const addVoxel = (position = new Three.Vector3(0, 0, 0), color = 0xFF00FF) => {
      const geometry = new Three.BoxGeometry(1, 1, 1);
      const material = new Three.MeshStandardMaterial({ color });
      material.roughness = 0.5;
      const voxel = new Three.Mesh(geometry, material);

      voxel.position.set(position.x, position.y, position.z);
      scene.add(voxel);
    };

    addVoxel();

    const directionalLight = new Three.DirectionalLight(0xFFFFFF, 1);
    directionalLight.position.set(5, 5, 5);

    const ambientLight = new Three.AmbientLight(0x808080);
    scene.add(directionalLight, ambientLight);

    const lightHelper = new Three.DirectionalLightHelper(directionalLight);
    const gridHelper = new Three.GridHelper(128, 64);
    scene.add(lightHelper, gridHelper);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.minPolarAngle = Math.PI / 2 - Math.PI * 0.2;
    controls.maxPolarAngle = Math.PI / 2 + Math.PI * 0.2;
    controls.minAzimuthAngle = -1;
    controls.maxAzimuthAngle = 1;
    controls.rotateSpeed = 0.2;

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      width = mount.current.clientWidth;
      height = width * 0.5625;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    const animate = () => {
      controls.update();

      renderScene();
      requestAnimationFrame(animate);
    };

    mount.current.appendChild(renderer.domElement);
    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      mount.current.removeChild(renderer.domElement);

      scene.remove(box);
      geometry.dispose();
      material.dispose();
    };
  }, []);

  return (
    <Container className="questionContainer" style={{ padding: 0 }}>

      <div ref={mount} />

    </Container>
  );
}

ArtSection.propTypes = {
  imageData: PropTypes.shape({
    id: PropTypes.number,
    url: PropTypes.string
  })
};

ArtSection.defaultProps = {
  imageData: {
    id: 0,
    url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/7.png'
  }
};
