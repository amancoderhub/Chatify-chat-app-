import { Contact, Settings } from "lucide-react";

const Header: React.FC = () => {
    return (
        <div className="flex items-center justify-between border-b border-sky-400/40 bg-linear-to-r from-sky-600 to-cyan-500 px-4 py-4 text-white sm:px-5">
        <div>
            <h1 className="text-lg font-bold sm:text-xl">Messages</h1>
            <p className="text-xs text-sky-100/85">Stay close to your circle</p>
        </div>
        <div className="flex space-x-2">
            <button className="rounded-full p-2 transition hover:bg-white/10 cursor-pointer" type="button">
            <Contact className="size-4" />
            </button>
            <button className="rounded-full p-2 transition hover:bg-white/10 cursor-pointer" type="button">
            <Settings className="size-4" />
            </button>
        </div>
        </div>
    );
};

export default Header;
