import "./Loader.css";

export const Loader = () => {
  return (
    <div className="grid place-items-center w-full min-h-58">
      <svg className="loader" viewBox="25 25 50 50">
        <circle r="20" cy="50" cx="50"></circle>
      </svg>
    </div>
  );
};
