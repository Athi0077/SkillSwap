import React, { useState, useMemo, useRef } from "react";
import TinderCard from "react-tinder-card";
import { Check, X, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

import dp1 from "../assets/dp1.png";
import dp2 from "../assets/dp2.png";
import dp3 from "../assets/dp3.png";
import dp4 from "../assets/dp4.png";
import dp5 from "../assets/dp5.png";
import dp6 from "../assets/dp6.png";

const defaultAvatars = [dp1, dp2, dp3, dp4, dp5, dp6];
const getAvatar = (user) => {
  if (user?.profilePicture) return user.profilePicture;
  if (!user?._id) return defaultAvatars[0];
  const index = parseInt(user._id.substring(user._id.length - 4), 16) % defaultAvatars.length;
  return defaultAvatars[index] || defaultAvatars[0];
};

const MatchSwiper = ({ users, onRequest, requestStatusGetter }) => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(users.length - 1);
  const [lastDirection, setLastDirection] = useState();
  
  // used for outOfFrame closure
  const currentIndexRef = useRef(currentIndex);

  const childRefs = useMemo(
    () =>
      Array(users.length)
        .fill(0)
        .map((i) => React.createRef()),
    [users.length]
  );

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  const canGoBack = currentIndex < users.length - 1;
  const canSwipe = currentIndex >= 0;

  const swiped = (direction, userToDelete, index) => {
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    
    // Swipe Right means "Match/Request"
    if (direction === 'right') {
       const status = requestStatusGetter(userToDelete._id);
       if (status !== 'pending' && status !== 'accepted') {
           onRequest(userToDelete);
       }
    }
  };

  const outOfFrame = (name, idx) => {
    console.log(`${name} (${idx}) left the screen!`, currentIndexRef.current);
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
  };

  const swipe = async (dir) => {
    if (canSwipe && currentIndex < users.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[500px] w-full max-w-sm mx-auto text-center border-2 border-dashed border-[#2F293A] rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-300 mb-2">No more matches!</h3>
        <p className="text-gray-500 text-sm">You've seen everyone matching your current filters.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto mt-4">
      
      {/* Cards Container */}
      <div className="relative w-full h-[65vh] sm:h-[500px] mb-8 max-h-[600px]">
        {users.map((user, index) => (
          <TinderCard
            ref={childRefs[index]}
            className="absolute inset-0 select-none"
            key={user._id}
            onSwipe={(dir) => swiped(dir, user, index)}
            onCardLeftScreen={() => outOfFrame(user.name, index)}
            preventSwipe={['up', 'down']}
          >
            <div className="w-full h-full bg-[#120F17] rounded-3xl overflow-hidden border border-[#2F293A] shadow-2xl flex flex-col relative group cursor-grab active:cursor-grabbing">
              
              {/* Cover/Avatar */}
              <div className="h-[60%] w-full relative overflow-hidden bg-gradient-to-br from-purple-900/40 to-[#120F17]">
                <img 
                   src={getAvatar(user)} 
                   alt={user.name}
                   className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
                   draggable={false}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120F17] to-transparent"></div>
                
                {/* Status indicator on image */}
                {requestStatusGetter(user._id) === 'pending' && (
                  <div className="absolute top-4 right-4 bg-yellow-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                     Pending
                  </div>
                )}
                {requestStatusGetter(user._id) === 'accepted' && (
                  <div className="absolute top-4 right-4 bg-green-500/90 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg backdrop-blur-sm">
                     Matched
                  </div>
                )}

              </div>

              {/* Info Area */}
              <div className="flex-1 p-6 flex flex-col justify-end bg-[#120F17] relative z-10 -mt-10">
                 <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    {user.name}
                 </h2>
                 <p className="text-gray-400 text-sm mb-3">@{user.username}</p>

                 {/* Skills preview */}
                 <div className="flex flex-col gap-3">
                   <div>
                     <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Offers</p>
                     <div className="flex flex-wrap gap-2">
                        {user.skillsOffered?.slice(0, 3).map(skill => (
                          <span key={`offered-${skill}`} className="bg-purple-900/40 border border-purple-500/30 text-purple-300 px-2 py-1 rounded-md text-xs font-medium">
                            {skill}
                          </span>
                        ))}
                        {(user.skillsOffered?.length || 0) > 3 && (
                          <span className="text-xs text-gray-500 self-center">+{user.skillsOffered.length - 3}</span>
                        )}
                     </div>
                   </div>
                   
                   {(user.skillsWanted?.length > 0) && (
                     <div>
                       <p className="text-xs text-gray-400 mb-1 uppercase tracking-wider">Wants</p>
                       <div className="flex flex-wrap gap-2">
                          {user.skillsWanted?.slice(0, 3).map(skill => (
                            <span key={`wanted-${skill}`} className="bg-blue-900/40 border border-blue-500/30 text-blue-300 px-2 py-1 rounded-md text-xs font-medium">
                              {skill}
                            </span>
                          ))}
                          {(user.skillsWanted?.length || 0) > 3 && (
                            <span className="text-xs text-gray-500 self-center">+{user.skillsWanted.length - 3}</span>
                          )}
                       </div>
                     </div>
                   )}
                 </div>
              </div>

            </div>
          </TinderCard>
        ))}
      </div>

      {/* Swipe Controls */}
      <div className="flex justify-center items-center gap-6 z-10 w-full px-8">
        
        <button 
          onClick={() => swipe('left')}
          disabled={!canSwipe}
          className="w-16 h-16 rounded-full bg-[#1A1625] flex items-center justify-center border border-red-500/30 text-red-500 hover:bg-red-500/10 hover:border-red-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:shadow-[0_0_25px_rgba(239,68,68,0.3)] hover:-translate-y-1 active:scale-95"
        >
           <X size={32} />
        </button>

        <button 
          onClick={() => {
             if(canSwipe) navigate(`/user/${users[currentIndex]._id}`);
          }}
          disabled={!canSwipe}
          className="w-12 h-12 rounded-full bg-[#1A1625] flex items-center justify-center border border-blue-500/30 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
        >
           <Info size={24} />
        </button>

        <button 
          onClick={() => swipe('right')}
          disabled={!canSwipe}
          className="w-16 h-16 rounded-full bg-[#1A1625] flex items-center justify-center border border-green-500/30 text-green-500 hover:bg-green-500/10 hover:border-green-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:shadow-[0_0_25px_rgba(34,197,94,0.3)] hover:-translate-y-1 active:scale-95"
        >
           <Check size={32} strokeWidth={3} />
        </button>

      </div>

      {lastDirection ? (
        <h2 key={lastDirection} className="mt-6 text-sm font-medium animate-pulse text-gray-500">
          You swiped {lastDirection}
        </h2>
      ) : (
        <h2 className="mt-6 text-sm font-medium text-gray-500">
          Swipe right to send a request, left to skip.
        </h2>
      )}
    </div>
  );
};

export default MatchSwiper;
