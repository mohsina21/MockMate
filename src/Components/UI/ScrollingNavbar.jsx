import React from "react";
import { Button } from "../button";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function ScrollingNavbar({ user, handleSignOut, handleStartInterview }) {
  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="border-b border-slate-200/60 bg-white/90 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <motion.div 
          className="flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div 
            className="w-8 h-8 bg-gradient-to-br from-purple-600 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Brain className="w-5 h-5 text-white" />
          </motion.div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-700 to-teal-700 bg-clip-text text-transparent">
            MockMate
          </span>
        </motion.div>
        
        <nav className="hidden md:flex items-center space-x-8">
          {['Features', 'How it Works', 'Reviews'].map((item, index) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase().replace(' ', '-')}`}
              className="text-slate-600 hover:text-purple-700 transition-colors font-medium"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -2 }}
            >
              {item}
            </motion.a>
          ))}
        </nav>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!user ? (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="outline"
                className="border-slate-300 text-purple-700 hover:bg-purple-50 active:bg-purple-200 focus:bg-purple-200 px-6 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
                onClick={() => window.location.href = '/auth'}
              >
                Login / Sign In
              </Button>
            </motion.div>
          ) : (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleSignOut}
                variant="outline"
                className="border-slate-300 text-purple-700 hover:bg-purple-50 active:bg-purple-200 focus:bg-purple-200 px-6 py-2 font-semibold shadow-sm hover:shadow-md transition-all duration-300"
              >
                Sign Out
              </Button>
            </motion.div>
          )}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleStartInterview}
              className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Start Interview
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}