import { Link } from 'react-router-dom';

type TabItemProps = {
  title: string;
  to: string;
  selected: boolean;
};

const TabItem = ({ title, to, selected }: TabItemProps) => {
  return (
    <Link
      to={to}
      className={`p-2  ${selected ? 'border-primary border-b-2' : ''}`}
    >
      <div
        className={`px-2 py-1 border rounded-2xl min-w-30 text-center border-primary ${selected ? 'font-bold bg-primary text-white' : ''}`}
      >
        {title}
      </div>
    </Link>
  );
};

export default TabItem;
