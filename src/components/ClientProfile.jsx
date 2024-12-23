export default function ClientProfile({user, approvedConsultations, notApprovedConsultations}){
    return ( <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left Section: Consultant Info */}
          <div className="bg-white rounded-lg shadow p-6">
            {user ? (
              <>
                <img
                  src="https://via.placeholder.com/150"
                  alt={user.firstName}
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                />
                <h1 className="text-xl font-bold text-center">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="mt-4">
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {user.phone}
                </p>
              </>
            ) : (
              <p>Loading user info...</p>
            )}
          </div>
    
          {/* Middle Section: Consultations */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold mb-4">Consultations</h2>
    
            <div className="mb-6">
              <h3 className="text-md font-semibold text-green-600">Approved</h3>
              {approvedConsultations.length > 0 ? (
                <ul className="mt-2">
                  {approvedConsultations.map((consultation, index) => (
                    <li key={index} className="border-b border-gray-200 py-2">
                      
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No approved consultations.</p>
              )}
            </div>
    
            <div>
              <h3 className="text-md font-semibold text-red-600">Not Approved</h3>
              {notApprovedConsultations.length > 0 ? (
                <ul className="mt-2">
                  {notApprovedConsultations.map((consultation, index) => (
                    <li key={index} className="border-b border-gray-200 py-2">
                      
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 mt-2">No pending consultations.</p>
              )}
            </div>
          </div>
    
          {/* Right Section: Available Times */}
          
          
        </div>)
}