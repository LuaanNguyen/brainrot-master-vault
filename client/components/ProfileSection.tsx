export default function ProfileSection() {
  return (
    <div className="m-6">
      <div className="border rounded-md p-4 mb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=1"
              alt="Dianne Russell"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <div className="font-medium">Dianne Russell</div>
              <div className="text-sm text-gray-500">russel@hey.com</div>
            </div>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M12 3v18M3 12h18"></path>
            </svg>
          </div>
        </div>
      </div>
      <div className="border rounded-md p-4 mb-4">
        <h3 className="text-sm font-medium text-gray-500 mb-3">TEAM</h3>
        <div className="space-y-3">
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=1"
              alt="User"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-medium">
              Dianne Russell{" "}
              <span className="text-gray-500 text-sm">(You)</span>
            </span>
          </div>
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=2"
              alt="Wade Warren"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-medium">Wade Warren</span>
          </div>
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=3"
              alt="Arlene McCoy"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-medium">Arlene McCoy</span>
          </div>
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=4"
              alt="Kristin Watson"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-medium">Kristin Watson</span>
          </div>
          <div className="flex items-center">
            <img
              src="https://i.pravatar.cc/40?img=5"
              alt="Albert Flores"
              className="w-8 h-8 rounded-full mr-3"
            />
            <span className="font-medium">Albert Flores</span>
          </div>
        </div>
      </div>
    </div>
  );
}
