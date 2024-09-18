import PropTypes from 'prop-types';

const Notification = ({ message, setMessage }) => {
  if (!message.text) return null;

  setTimeout(() => {
    setMessage({});
  }, 1000);
  return (
    <div
      className={`message ${message.type === 'error' ? 'error' : 'success'}`}
    >
      {message.text?.error ? message.text?.error : message.text}
    </div>
  );
};

Notification.propTypes = {
  setMessage: PropTypes.func.isRequired,
};

export default Notification;
