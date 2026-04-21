const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <span className="text-sm text-gray-400 dark:text-gray-500">
          © {new Date().getFullYear()} FinanzasCtrl
        </span>
        <span className="text-xs text-gray-300 dark:text-gray-600">
          v1.0 — MVP
        </span>
      </div>
    </footer>
  );
};

export default Footer;
