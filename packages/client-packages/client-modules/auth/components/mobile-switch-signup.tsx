import React from "react";

const MobileSwitchSignup = ({isSignUp, setIsSignUp}:{isSignUp:boolean, setIsSignUp:React.Dispatch<React.SetStateAction<boolean>>}) => {
  return (
    <p
      onClick={() => setIsSignUp(!isSignUp)}
      className="mt-2  max-sm:pl-10 sm:hidden"
    >
      {isSignUp
        ? "Already have an account? Sign In"
        : "Don't have an account? Sign Up"}
    </p>
  );
};

export default MobileSwitchSignup;
