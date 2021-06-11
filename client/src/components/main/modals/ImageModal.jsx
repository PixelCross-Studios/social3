import React from 'react';
import PropTypes from 'prop-types';

import { Modal, Button } from '@material-ui/core/';

import ImageModalBody from './ImageModalBody.jsx';

export default function ImageModal({ url }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleKey = (e) => {
    if (e.keyCode === 27) {
      setOpen(false);
    } else if (e.keyCode === 13) {
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen} onKeyDown={handleKey}>
        <img src={url} alt="thumbnail" width="auto" height="120" />
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <ImageModalBody url={url} />
      </Modal>
    </>
  );
}

ImageModal.propTypes = {
  url: PropTypes.string
};

ImageModal.defaultProps = {
  url: ''
};
