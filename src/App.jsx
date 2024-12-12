import { MdOutlineMenu } from "react-icons/md";

function App() {
  return (
    <>
      <div className="max-w-sm w-full mx-auto">
        <div className="w-full flex justify-between">
          <div>
            <MdOutlineMenu size={28} />
          </div>

          <div className="flex gap-4">
            <p>login</p>
            <p>signin</p>
          </div>
        </div>
        <h1 className="text-gray-800 text-center font-bold py-4 border-b border-gray-400">
          QR Scanner
        </h1>
      </div>
    </>
  );
}

export default App;
