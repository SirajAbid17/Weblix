import { motion } from "framer-motion"
import {  FaClock, FaCheckCircle, FaTimesCircle } from "react-icons/fa"

export default function EditorDetail({ website }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#0F0F0F] text-white p-4  border border-gray-800 shadow-md mb-4"
    >
      
     
      <div className="flex items-center gap-2 mb-2">
       
       <h2 className="text-md font-semibold tracking-wide truncate">
  {website?.title}
</h2>
      </div>

    
      <div className="h-px bg-gray-800 mb-3"></div>

  
      <div className="space-y-2 text-sm">

      
        <div className="flex items-center gap-2 text-gray-400">
          <FaClock />
          <span>
            {new Date(website?.createdAt).toLocaleString()}
          </span>
        </div>

       
        <div className="flex items-center gap-2">
          {website?.deploy ? (
            <>
              <FaCheckCircle className="text-green-500" />
              <span className="text-green-400 font-medium">
                Deployed
              </span>
            </>
          ) : (
            <>
              <FaTimesCircle className="text-red-500" />
              <span className="text-red-400 font-medium">
                Not Deployed
              </span>
            </>
          )}
        </div>

      </div>

    
    </motion.div>
  )
}