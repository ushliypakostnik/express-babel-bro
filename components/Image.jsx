import config from '../config';

const Image = (props) => {
  const path = props.record.params.filePath;
  const { where } = props;

  let max;
  switch (where) {
    case config.VIEWS.show:
      max = 600;
      break;
    case config.VIEWS.list:
    default:
      max = 100;
      break;
  }

  return (
    <img
      src={path}
      alt={path}
      style={{ maxHeight: `${max}px`, maxWidth: `${max}px` }}
    />
  );
};

export default Image;
