import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from '@material-ui/core/';
import AnswerModalBody from './AnswerModalBody.jsx';

export default function AnswerModal({ question }) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button onClick={handleOpen}>
        Add Answer
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <AnswerModalBody question={question} />
      </Modal>
    </>
  );
}

AnswerModal.propTypes = {
  question: PropTypes.shape({
    question_id: PropTypes.number,
    question_body: PropTypes.string,
    question_helpfulness: PropTypes.number,
    asker_name: PropTypes.string
  })
};

AnswerModal.defaultProps = {
  question: {}
};
