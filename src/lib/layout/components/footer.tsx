export const Footer = () => {
  return (
    <footer className="wrapper">
      <div className="flex">
        <p className="text-xs">
          {new Date().getFullYear()} -{' '}
          <a
            href="https://andrewattilio.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            andrewattilio.com
          </a>
        </p>
      </div>
    </footer>
  );
};
