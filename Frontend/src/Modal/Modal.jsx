import PropTypes from "prop-types";
const Modal = ({ isOpen, onClose, position = "center",children }) => {
  const getModalPosition = () => {
    switch (position) {
      case "left":
        return "absolute top-0 left-0";
      case "right":
        return "absolute top-8 right-0";
      default:
        return "flex items-center min-h-screen ";
    }
  };
  if (!isOpen) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-40 overflow-y-auto transition-opacity duration-500`}>
      <div
        className={`fixed inset-0 w-full h-full bg-black ${isOpen ? "opacity-60" : "opacity-0"}`}
        onClick={onClose}
      ></div>
      <div className={`px-4 py-8 ${getModalPosition()}`}>
        <div
          className={`relative w-full max-w-lg p-4 mx-auto bg-white rounded-xl shadow-lg dark:bg-gray-700 dark:text-gray-400 ${
            isOpen ? "animate-scale-in" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  position: PropTypes.string,
};
export default Modal;
