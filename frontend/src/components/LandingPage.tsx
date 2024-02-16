const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-between border-t border-gray-200 pt-4 mb-6 px-4 sm:px-0">
      <div className="flex flex-col">
        <span className="text-xl mb-2">Yardsale AI</span>
        <span className="text-xs">
          © {new Date().getFullYear()} WhimsyWorks, Inc. All rights reserved.
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 sm:flex-col text-sm text-gray-600 mr-4">
        {/* <span className="uppercase">Company</span> */}
        <div>WhimsyWorks Inc.</div>
        <div>Made in NYC 🗽</div>
        <a href="https://github.com/abi/yardsale-ai" target="_blank">
          Github
        </a>
        <a href="mailto:support@picoapps.xyz" target="_blank">
          Contact
        </a>
        <a href="https://a.picoapps.xyz/camera-write" target="_blank">
          Terms of Service
        </a>
      </div>
    </footer>
  );
};
export default Footer;
