import { URLS } from "../urls";

const Footer = () => {
  return (
    <footer className="flex flex-col sm:flex-row justify-between border-t border-gray-200 pt-4 mb-6 px-4 sm:px-0">
      <div className="flex flex-col">
        <span className="text-xl mb-2 hidden sm:block">Yardsale AI</span>
        <span className="text-xs">
          © {new Date().getFullYear()} WhimsyWorks, Inc. All rights reserved.
        </span>
      </div>
      <div className="flex flex-wrap gap-x-4 sm:flex-col text-sm text-gray-600 mr-4 mt-2">
        <div>WhimsyWorks Inc.</div>
        <a href={URLS["github"]} target="_blank">
          Github
        </a>
        <a href={URLS["support-email"]} target="_blank">
          Contact
        </a>
        <a href={URLS["terms-of-service"]} target="_blank">
          Terms of Service
        </a>
        <a href={URLS["privacy-policy"]} target="_blank">
          Privacy Policy
        </a>
      </div>
    </footer>
  );
};
export default Footer;
