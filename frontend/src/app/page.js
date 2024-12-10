export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Book Library
        </h2>
        <p className="text-xl text-gray-600">
          This website compiles book metadata from various sources, including
          CSV files, ONIX files, and MARC records. By cleaning and integrating
          the data, we provide you with a powerful and informative platform for
          book management and search, convenient for libraries, publishers, and
          retailers.
        </p>

        <div className="mt-8">
          <h3 className="text-4xl font-semibold text-gray-800 mb-4">
            Our Team
          </h3>
          <div className="flex justify-center space-x-20 text-3xl">
            <div className="flex flex-col items-center">
              <svg
                className="h-12 w-12 text-blue-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.485 0 4.816.545 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className=" text-gray-700">Junyu She</span>
            </div>
            <div className="flex flex-col items-center">
              <svg
                className="h-12 w-12 text-green-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.485 0 4.816.545 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className="text-gray-700">Rong Huang</span>
            </div>
            <div className="flex flex-col items-center">
              <svg
                className="h-12 w-12 text-yellow-500 mb-2"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.485 0 4.816.545 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span className=" text-gray-700">Xin Jiang</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-12">
        <h3 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
          Page Functionality Overview
        </h3>
        <ul className="space-y-8">
          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-7 w-7 text-blue-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6h4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-2xl font-medium text-gray-800">All Books</h4>
              <p className="text-lg text-gray-600">
                Browse all collected books with pagination and collection
                filtering support.
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-7 w-7 text-green-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-2xl font-medium text-gray-800">
                Search Books
              </h4>
              <p className="text-lg text-gray-600">
                Search for specific books by title, author, publisher, or ISBN.
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-7 w-7 text-yellow-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-2xl font-medium text-gray-800">Add Book</h4>
              <p className="text-lg text-gray-600">
                Manually add new book information to a specified collection
                (CSV, MARC, XML).
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-7 w-7 text-red-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5h2m-2 4h2m-2 4h2m4 4H7"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-2xl font-medium text-gray-800">Edit Book</h4>
              <p className="text-lg text-gray-600">
                Modify existing book information to ensure accuracy and
                completeness of data.
              </p>
            </div>
          </li>

          <li className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-7 w-7 text-purple-500 mt-1"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h4a1 1 0 011 1v1h4V4a1 1 0 011-1h4a1 1 0 011 1v2h2a1 1 0 011 1v2a1 1 0 01-1 1h-2v8a1 1 0 01-1 1H5a1 1 0 01-1-1v-8H2a1 1 0 01-1-1V8a1 1 0 011-1h2V5a1 1 0 011-1h4V4z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h4 className="text-2xl font-medium text-gray-800">
                Filter Books
              </h4>
              <p className="text-lg text-gray-600">
                Filter books based on missing or incomplete data fields to
                ensure data integrity and completeness.
              </p>
            </div>
          </li>
        </ul>
      </div>

      <div className="mb-12">
        <h3 className="text-4xl font-semibold text-gray-800 mb-6 text-center">
          Dataset Introduction
        </h3>
        <p className="text-xl text-gray-600 mb-6">
          Our datasets include book information collected and processed from
          different sources:
        </p>
        <ul className="space-y-8">
          <li>
            <h4 className="text-2xl font-medium text-gray-800">
              mergedCSV.json
            </h4>
            <p className="text-lg text-gray-600">
              Integrates data from two CSV files, providing basic bibliographic
              details and copy information, suitable for library inventory
              management and book retrieval.
            </p>
          </li>
          <li>
            <h4 className="text-2xl font-medium text-gray-800">
              mergedONIX.json
            </h4>
            <p className="text-lg text-gray-600">
              Extracted from ONIX files, containing rich bibliographic and
              commercial metadata, ideal for publishers, retailers, and
              e-commerce platforms.
            </p>
          </li>
          <li>
            <h4 className="text-2xl font-medium text-gray-800">marc.json</h4>
            <p className="text-lg text-gray-600">
              Converted from MARC records, offering detailed and structured
              bibliographic information commonly used in library catalog
              systems.
            </p>
          </li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-xl text-gray-600">
          We are committed to providing you with high-quality book data and
          convenient management tools to help you better organize and utilize
          book resources. The data is stored in a MongoDB database and is
          available for query and update at any time.
        </p>
      </div>
    </div>
  );
}
