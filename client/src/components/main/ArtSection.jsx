import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import * as Three from 'three';

import {
  Container
} from '@material-ui/core';

export default function ArtSection({ imageData }) {
  const mount = useRef(null);

  useEffect(() => {
    let width = mount.current.clientWidth;
    let height = mount.current.clientHeight;
    let frameId;

    const scene = new Three.Scene();

    const camera = new Three.PerspectiveCamera(75, 16 / 9, 0.1, 1000);
    const renderer = new Three.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearColor('#000000');

    camera.position.setZ(30);

    const renderScene = () => {
      renderer.render(scene, camera);
    };

    const handleResize = () => {
      width = mount.current.clientWidth;
      height = mount.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderScene();
    };

    const animate = () => {
      renderScene();
      frameId = window.requestAnimationFrame(animate);
    };

    mount.current.appendChild(renderer.domElement);
    window.addEventListener('resize', handleResize);
    frameId = requestAnimationFrame(animate);
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
